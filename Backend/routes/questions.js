const express = require("express");
const User = require("../models/user");
const Comment = require("../models/comment");
const Question = require("../models/question");
const Activity = require("../models/activity");
const { getSignedUrlForObject, uploadObject, deleteObject } = require("../utils/amazonS3");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");

const commentsRouter = require("./comments");
router.use("/questions", commentsRouter);

// Helper function to extract and upload images from HTML content
const processImagesInHtml = async (html) => {
  const imgRegex = /<img[^>]+src="([^">]+)"/g;
  let match;
  let processedHtml = html;

  while ((match = imgRegex.exec(html)) !== null) {
    const imgSrc = match[1];
    if (imgSrc.startsWith("data:image")) {
      // Extract base64 data
      const base64Data = imgSrc.split(",")[1];
      const buffer = Buffer.from(base64Data, "base64");

      // Generate a unique filename
      const filename = `question_images/${uuidv4()}.png`;

      // Upload to S3
      await uploadObject(filename, buffer);

      // Replace the src in HTML with the S3 filename
      processedHtml = processedHtml.replace(imgSrc, filename);
    }
  }

  return processedHtml;
};

const capitalizeWords = (str) => {
  return str.replace(/\b\w/g, (l) => l.toUpperCase());
};

// Helper function to replace image filenames with signed URLs
const replaceImageUrlsWithSignedUrls = async (html) => {
  const imgRegex = /<img[^>]+src="([^">]+)"/g;
  let match;
  let processedHtml = html;

  while ((match = imgRegex.exec(html)) !== null) {
    const imgSrc = match[1];
    if (!imgSrc.startsWith("http")) {
      const signedUrl = await getSignedUrlForObject(imgSrc);
      processedHtml = processedHtml.replace(imgSrc, signedUrl);
    }
  }

  return processedHtml;
};

const sliceHtml = (html, maxLength) => {
  // Remove HTML tags
  const text = html.replace(/<[^>]*>/g, "");

  if (text.length <= maxLength) return html;

  let slicedText = text.slice(0, maxLength);
  const lastSpaceIndex = slicedText.lastIndexOf(" ");
  if (lastSpaceIndex > 0) {
    slicedText = slicedText.slice(0, lastSpaceIndex);
  }

  return slicedText + "...";
};

router.get("/questions", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    // Extract query parameters
    const companyNames = req.query.companyName
      ? JSON.parse(req.query.companyName)
      : null;
    const tags = req.query.tag ? JSON.parse(req.query.tag) : null;
    const category = req.query.category || null;
    const dateRange = req.query.date_range || null;

    // Build the filter object
    const filter = { status: "approved" };
    if (companyNames && companyNames.length > 0) {
      filter.companyName = { $in: companyNames };
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

        // Replace image URLs with signed URLs in the answer
        const processedAnswer = await replaceImageUrlsWithSignedUrls(
          question.answer
        );

        // Slice the processed answer
        const slicedAnswer = sliceHtml(processedAnswer, 150);
        const fullAnswerAvailable = processedAnswer.length > 150;

        return {
          ...question,
          username: userMap[question.user_id.toString()] || "Unknown User",
          profile_pic: profilePicUrl,
          answer: slicedAnswer,
          fullAnswerAvailable: fullAnswerAvailable,
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

router.get("/questions/unapproved", async (req, res) => {
  try {
    const unapprovedQuestions = await Question.find({
      status: "unverified",
    }).sort({ created_at: -1 });

    const processedQuestions = await Promise.all(
      unapprovedQuestions.map(async (question) => {
        const processedAnswer = await replaceImageUrlsWithSignedUrls(
          question.answer
        );
        return {
          ...question.toObject(),
          answer: processedAnswer,
        };
      })
    );

    res.json(processedQuestions);
  } catch (error) {
    console.error("Error fetching unapproved questions:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching unapproved questions" });
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

    // Check if the question is approved
    if (question.status !== "approved") {
      return res.status(200).send({
        isVerified: false,
        message: "This question is not yet approved.",
      });
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

    if (question.status === "approved") {
      // Replace image URLs with signed URLs in the answer
      question.answer = await replaceImageUrlsWithSignedUrls(question.answer);
    }

    return res.status(200).send({
      isVerified: true,
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

    // Add status: "approved" to all search queries
    if (mainSearchTerm && hashtagKeyword) {
      searchQueries.push(
        Question.find(
          {
            $text: { $search: mainSearchTerm },
            tags: hashtagKeyword,
            status: "approved",
          },
          { score: { $meta: "textScore" } }
        )
          .sort({ score: { $meta: "textScore" } })
          .lean()
      );
    }

    if (mainSearchTerm) {
      searchQueries.push(
        Question.find(
          { $text: { $search: mainSearchTerm }, status: "approved" },
          { score: { $meta: "textScore" } }
        )
          .sort({ score: { $meta: "textScore" } })
          .lean()
      );
    }

    if (hashtagKeyword) {
      searchQueries.push(
        Question.find({ tags: hashtagKeyword, status: "approved" }).lean()
      );
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
  const uploadedImages = [];
  try {
    const processedAnswer = await processImagesInHtml(req.body.answer);

    // Keep track of uploaded images
    const imgRegex = /<img[^>]+src="([^">]+)"/g;
    let match;
    while ((match = imgRegex.exec(processedAnswer)) !== null) {
      const imgSrc = match[1];
      if (!imgSrc.startsWith("http")) {
        uploadedImages.push(imgSrc);
      }
    }

    const questionData = {
      ...req.body,
      companyName: capitalizeWords(req.body.companyName),
      answer: processedAnswer,
      status: "unverified",
      user_id: req.user._id,
      tags: req.body.tags.map((tag) =>
        tag.startsWith("#") ? tag.slice(1) : tag
      ),
    };
    const question = await Question.create(questionData);

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
    // Delete uploaded images if there was an error
    for (const imagePath of uploadedImages) {
      try {
        await deleteObject(imagePath);
      } catch (deleteErr) {
        console.error(`Failed to delete image ${imagePath}:`, deleteErr);
      }
    }
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

module.exports = router;
