const express = require("express");
const User = require("../models/user");
const Comment = require("../models/comment");
const Question = require("../models/question");
const Activity = require("../models/activity");
const { getSignedUrlForObject } = require("../utils/amazonS3");
const router = express.Router();

const commentsRouter = require("./comments");
router.use("/questions", commentsRouter);

router.get("/questions", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    // Extract query parameters
    const companyNames = req.query.company_name
      ? JSON.parse(req.query.company_name)
      : null;
    const tags = req.query.tag ? JSON.parse(req.query.tag) : null;
    const category = req.query.category || null;
    const dateRange = req.query.date_range || null;

    // Build the filter object
    const filter = { status: "approved" };
    if (companyNames && companyNames.length > 0) {
      filter.company_name = { $in: companyNames };
    }
    if (tags && tags.length > 0) {
      filter.tags = { $in: tags };
    }
    if (category) {
      filter.category = category;
    }

    // Fetch total questions count
    const totalQuestions = await Question.countDocuments(filter);
    const totalPages = Math.ceil(totalQuestions / limit);

    // Apply date range filter if specified
    let questions;
    if (dateRange) {
      const now = new Date();
      let dateLimit;

      switch (dateRange) {
        case "year":
          dateLimit = new Date(now.setFullYear(now.getFullYear() - 1));
          break;
        case "month":
          dateLimit = new Date(now.setMonth(now.getMonth() - 1));
          break;
        case "week":
          dateLimit = new Date(now.setDate(now.getDate() - 7));
          break;
        case "day":
          dateLimit = new Date(now.setDate(now.getDate() - 1));
          break;
        default:
          dateLimit = null;
      }

      if (dateLimit) {
        filter.created_at = { $gte: dateLimit };
      }
    }

    // Fetch questions with applied filters
    questions = await Question.find(filter).skip(skip).limit(limit).lean();

    const userIds = questions.map((q) => q.user_id);
    const users = await User.find(
      { _id: { $in: userIds } },
      { _id: 1, username: 1 }
    ).lean();

    const userMap = users.reduce((acc, user) => {
      acc[user._id.toString()] = user.username;
      return acc;
    }, {});

    const questionsWithUsernames = await Promise.all(
      questions.map(async (question) => {
        const profilepic = await User.findOne({ _id: question.user_id }).select(
          "profile_pic -_id"
        );
        const profilePicUrl = await getSignedUrlForObject(
          profilepic.toObject().profile_pic
        );
        return {
          ...question,
          username: userMap[question.user_id.toString()] || "Unknown User",
          profile_pic: profilePicUrl,
        };
      })
    );

    return res.status(200).send({
      questions: questionsWithUsernames,
      currentPage: page,
      totalPages: totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send({
      questions: [],
      error: "An error occurred while fetching questions",
    });
  }
});

router.get("/question/:id", async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).send({ error: "User not authenticated" });
    }

    const question = await Question.findOne({ _id: req.params.id });
    if (!question) {
      return res.status(400).send({ error: "Invalid question_id" });
    }
    await Question.updateOne(
      { _id: req.params.id },
      { $inc: { impressions: 1 } }
    );
    const user = await User.findOne({ _id: question.user_id }).lean();
    const profilepic = await User.findOne({ _id: question.user_id }).select(
      "profile_pic -_id"
    );
    const profilePicUrl = await getSignedUrlForObject(
      profilepic.toObject().profile_pic
    );
    const comments = await Comment.find({ question_id: req.params.id });
    const commentUserIds = comments.map((c) => c.user_id);
    const commentUsers = await User.find(
      { _id: { $in: commentUserIds } },
      { _id: 1, username: 1, profile_pic: 1 }
    ).lean();
    const commentUserMap = commentUsers.reduce((acc, user) => {
      acc[user._id.toString()] = {
        username: user.username,
        profile_pic: user.profile_pic,
      };
      return acc;
    }, {});

    const commentsWithUsernames = await Promise.all(
      comments.map(async (comment) => {
        const userInfo = commentUserMap[comment.user_id.toString()] || {
          username: "Unknown User",
          profile_pic: null,
        };
        const commentProfilePicUrl = userInfo.profile_pic
          ? await getSignedUrlForObject(userInfo.profile_pic)
          : null;
        return {
          ...comment.toObject(),
          username: userInfo.username,
          profile_pic: commentProfilePicUrl,
        };
      })
    );

    const currentUserId = req.user._id;
    const userVote = question.upvotedBy.includes(currentUserId)
      ? "upvote"
      : question.downvotedBy.includes(currentUserId)
      ? "downvote"
      : null;

    return res.status(200).send({
      ...question.toObject(),
      username: user.username,
      profile_pic: profilePicUrl,
      comments: commentsWithUsernames,
      userVote: userVote,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .send({ error: "An error occurred while fetching question" });
  }
});

router.get("/questionsearch", async (req, res) => {
  try {
    const search = req.query.query || "";
    // Record activity (only for authenticated users)
    if (req.isAuthenticated()) {
      await Activity.create({
        user_id: req.user._id,
        type: "search",
        details: { query: search },
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    let mainSearchTerm = search;
    let hashtagKeyword = "";

    if (search.includes("#")) {
      const parts = search.split("#");
      mainSearchTerm = parts[0].trim();
      hashtagKeyword = parts[1].trim();
    }

    const searchQueries = [];

    if (mainSearchTerm && hashtagKeyword) {
      searchQueries.push(
        Question.find(
          { $text: { $search: mainSearchTerm }, tags: hashtagKeyword },
          { score: { $meta: "textScore" } }
        )
          .sort({ score: { $meta: "textScore" } })
          .lean()
      );
    }

    if (mainSearchTerm) {
      searchQueries.push(
        Question.find(
          { $text: { $search: mainSearchTerm } },
          { score: { $meta: "textScore" } }
        )
          .sort({ score: { $meta: "textScore" } })
          .lean()
      );
    }

    if (hashtagKeyword) {
      searchQueries.push(Question.find({ tags: hashtagKeyword }).lean());
    }

    const [mainAndTagResults, mainResults, tagResults] = await Promise.all(
      searchQueries
    );

    const combinedResults = [
      ...(mainAndTagResults || []),
      ...(mainResults || []),
      ...(tagResults || []),
    ];

    const totalQuestions = combinedResults.length;
    const totalPages = Math.ceil(totalQuestions / limit);
    const paginatedResults = combinedResults.slice(skip, skip + limit);

    const userIds = paginatedResults.map((q) => q.user_id);
    const users = await User.find(
      { _id: { $in: userIds } },
      { _id: 1, username: 1 }
    ).lean();
    const userMap = users.reduce((acc, user) => {
      acc[user._id.toString()] = user.username;
      return acc;
    }, {});

    const questionsWithUsernames = await Promise.all(
      paginatedResults.map(async (question) => {
        const profilepic = await User.findOne({ _id: question.user_id }).select(
          "profile_pic -_id"
        );
        const profilePicUrl = await getSignedUrlForObject(
          profilepic.toObject().profile_pic
        );
        return {
          ...question,
          username: userMap[question.user_id.toString()] || "Unknown User",
          profile_pic: profilePicUrl,
        };
      })
    );

    return res.status(200).send({
      questions: questionsWithUsernames,
      currentPage: page,
      totalPages: totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send({
      questions: [],
      error: "An error occurred while fetching questions",
    });
  }
});

router.post("/question", async (req, res) => {
  try {
    const questionData = {
      ...req.body,
      status: "unverified",
      user_id: req.user._id,
      tags: req.body.tags.map((tag) =>
        tag.startsWith("#") ? tag.slice(1) : tag
      ), // Remove '#' from tags
    };
    const question = await Question.create(questionData);

    // Record activity
    await Activity.create({
      user_id: req.user._id,
      type: "question",
      target_id: question._id,
    });

    return res.status(201).send({
      message: "Question submitted successfully and is pending approval.",
      question: question,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send({
      status: false,
      error: "An error occurred while creating question",
    });
  }
});

router.delete("/question", async (req, res) => {
  try {
    const question = await Question.findById(req.body.id);
    if (question === null) {
      return res.status(400).send({ error: "Invalid question_id" });
    }
    await Question.findByIdAndDelete(req.body.id);
    return res.status(200).send({ status: true });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ status: false });
  }
});

router.patch("/upvote", async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).send({ error: "User not authenticated" });
    }

    const { _id } = req.body;
    const userId = req.user._id;

    const question = await Question.findById(_id);
    if (!question) {
      return res.status(400).send({ error: "Invalid question_id" });
    }

    const alreadyUpvoted = question.upvotedBy.includes(userId);
    const alreadyDownvoted = question.downvotedBy.includes(userId);

    // Record activity
    await Activity.create({
      user_id: req.user._id,
      type: "vote",
      action: alreadyUpvoted ? "remove_upvote" : "upvote",
      target_id: _id,
    });

    if (alreadyUpvoted) {
      let update = { $inc: { upvotes: -1 }, $pull: { upvotedBy: userId } };
      await Question.updateOne({ _id }, update);
      return res
        .status(200)
        .send({ status: true, message: "Upvote Removed Successfully" });
    }

    let update = { $inc: { upvotes: 1 }, $push: { upvotedBy: userId } };
    if (alreadyDownvoted) {
      update.$inc.downvotes = -1;
      update.$pull = { downvotedBy: userId };
    }

    await Question.updateOne({ _id }, update);
    return res
      .status(200)
      .send({ status: true, message: "Question upvoted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).send({
      status: false,
      error: "An error occurred while upvoting question",
    });
  }
});

router.patch("/downvote", async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).send({ error: "User not authenticated" });
    }

    const { _id } = req.body;
    const userId = req.user._id;

    const question = await Question.findById(_id);
    if (!question) {
      return res.status(400).send({ error: "Invalid question_id" });
    }

    const alreadyDownvoted = question.downvotedBy.includes(userId);
    const alreadyUpvoted = question.upvotedBy.includes(userId);

    // Record activity
    await Activity.create({
      user_id: req.user._id,
      type: "vote",
      action: alreadyDownvoted ? "remove_downvote" : "downvote",
      target_id: _id,
    });

    if (alreadyDownvoted) {
      let update = { $inc: { downvotes: -1 }, $pull: { downvotedBy: userId } };
      await Question.updateOne({ _id }, update);
      return res
        .status(200)
        .send({ status: true, message: "Downvote Removed Successfully" });
    }

    let update = { $inc: { downvotes: 1 }, $push: { downvotedBy: userId } };
    if (alreadyUpvoted) {
      update.$inc.upvotes = -1;
      update.$pull = { upvotedBy: userId };
    }

    await Question.updateOne({ _id }, update);
    return res
      .status(200)
      .send({ status: true, message: "Question downvoted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).send({
      status: false,
      error: "An error occurred while downvoting question",
    });
  }
});

router.get("/checkusername", async (req, res) => {
  console.log("i m here");
  const username = req.query.username;
  try {
    const user = await User.findOne({ username: username });
    console.log(user);
    return res.status(200).send({ status: user === null ? true : false });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ status: false });
  }
});
module.exports = router;
