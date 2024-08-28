const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');

const Question = require("../models/question");
const Comment = require("../models/comment");
const Activity = require("../models/activity");

router.get("/comments", async (req, res) => {
  try {
    console.log(req.query.question_id);
    const question_id = req.query.question_id;
    const status = await Question.findOne({ _id: question_id }).lean();
    if (status === null) {
      return res
        .status(400)
        .send({ status: false, error: "Invalid question_id" });
    }
    const comments = await Comment.find({ question_id: question_id }).lean();
    return res.status(200).send(comments);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .send({
        status: false,
        error: "An error occurred while fetching comments",
      });
  }
});

router.post("/comments", async (req, res) => {
  try {
    const status = await Question.findOne({ _id: req.body.question_id }).lean();
    if (status === null) {
      return res
        .status(400)
        .send({ status: false, error: "Invalid question_id" });
    }
    if (req.body.comment === "") {
      return res
        .status(400)
        .send({ status: false, error: "Please provide a comment" });
    }
    // increase replies count by 1
    await Question.updateOne(
      { _id: req.body.question_id },
      { $inc: { commentscount: 1 } }
    );
    const comment = await Comment.create(req.body);

    // Record activity
    await Activity.create({
      user_id: req.user._id,
      type: "comment",
      target_id: comment.question_id,
      details: { comment_id: comment._id },
    });

    return res.status(201).send(comment);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .send({
        status: false,
        error: "An error occurred while creating comment",
      });
  }
});

router.delete("/comments", async (req, res) => {
  try {
    const comment = await Comment.findById(req.body._id);
    if (comment === null) {
      return res.status(400).send({ error: "Invalid comment_id" });
    }
    
    await Comment.findByIdAndDelete(req.body._id);
    return res
      .status(200)
      .send({ status: true, message: "Comment deleted successfully" });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .send({
        status: false,
        error: "An error occurred while deleting comment",
      });
  }
});

// Like a comment
router.patch("/comments/:commentId/like", async (req, res) => {
  try {
    const { commentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      console.log("Invalid comment ID format");
      return res.status(400).send({ error: "Invalid comment ID" });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).send({ error: "Comment not found" });
    }

    // For testing purposes, use a dummy user ID if req.user is undefined
    const userId = req.user ? req.user._id : '000000000000000000000000';

    const userIndex = comment.likes.indexOf(userId);
    if (userIndex === -1) {
      comment.likes.push(userId);
      const dislikeIndex = comment.dislikes.indexOf(userId);
      if (dislikeIndex > -1) {
        comment.dislikes.splice(dislikeIndex, 1);
      }
    } else {
      comment.likes.splice(userIndex, 1);
    }

    await comment.save();

    res.status(200).send({
      likes: comment.likes.length,
      dislikes: comment.dislikes.length,
    });
  } catch (err) {
    console.error("Error in liking comment:", err);
    res.status(500).send({ error: "An error occurred while liking the comment" });
  }
});

// Dislike a comment
router.patch("/comments/:commentId/dislike", async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).send({ error: "Comment not found" });
    }

    const userIndex = comment.dislikes.indexOf(req.user._id);
    if (userIndex === -1) {
      comment.dislikes.push(req.user._id);
      // Remove user from likes if they previously liked
      const likeIndex = comment.likes.indexOf(req.user._id);
      if (likeIndex > -1) {
        comment.likes.splice(likeIndex, 1);
      }
    } else {
      comment.dislikes.splice(userIndex, 1);
    }

    await comment.save();
    res.status(200).send({ likes: comment.likes.length, dislikes: comment.dislikes.length });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "An error occurred while disliking the comment" });
  }
});

module.exports = router;
