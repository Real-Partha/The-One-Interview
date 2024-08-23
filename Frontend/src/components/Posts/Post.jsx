import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useTheme } from "../../ThemeContext";
import "./Post.css";

const Post = () => {
  const { questionId } = useParams();
  const [question, setQuestion] = useState(null);
  const [userVote, setUserVote] = useState(null);
  const { isDarkMode } = useTheme();
  const [isDebouncing, setIsDebouncing] = useState(false);
  const [debouncingButton, setDebouncingButton] = useState(null);
  const [upvotes, setUpvotes] = useState(0);
  const [downvotes, setDownvotes] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const debounce = (func, buttonId) => {
    return async (...args) => {
      if (isDebouncing) return;
      setIsDebouncing(true);
      setDebouncingButton(buttonId);
      try {
        await func(...args);
      } finally {
        setIsDebouncing(false);
        setDebouncingButton(null);
      }
    };
  };

  const debouncedUpvote = debounce(async () => {
    try {
      const response  = await axios.patch(
        `${import.meta.env.VITE_API_URL}/upvote`,
        { _id: questionId },
        { withCredentials: true }
      );
      if (response.status === 200) {
        if (userVote === "upvote") {
          setUpvotes(upvotes - 1);
          setUserVote(null);
        } else if (userVote === "downvote") {
          setUpvotes(upvotes + 1);
          setDownvotes(downvotes - 1);
          setUserVote("upvote");
        } else {
          setUpvotes(upvotes + 1);
          setUserVote("upvote");
        }
      }
    } catch (error) {
      console.error("Error upvoting question:", error);
    }
  }, "upvote");

  const debouncedDownvote = debounce(async () => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/downvote`,
        { _id: questionId },
        { withCredentials: true }
      );
      if (response.status === 200) {
        if (userVote === "downvote") {
          setDownvotes(downvotes - 1);
          setUserVote(null);
        } else if (userVote === "upvote") {
          setDownvotes(downvotes + 1);
          setUpvotes(upvotes - 1);
          setUserVote("downvote");
        } else {
          setDownvotes(downvotes + 1);
          setUserVote("downvote");
        }
      }
    } catch (error) {
      console.error("Error downvoting question:", error);
    }
  }, "downvote");

  const handleUpvote = () => {
    debouncedUpvote();
  };

  const handleDownvote = () => {
    debouncedDownvote();
  };

  const fetchQuestion = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/question/${questionId}`,
        { withCredentials: true }
      );
      setQuestion(response.data);
      setUserVote(response.data.userVote);
      setUpvotes(response.data.upvotes);
      setDownvotes(response.data.downvotes);
      setComments(response.data.comments);
    } catch (error) {
      console.error("Error fetching question:", error);
    }
  };

  useEffect(() => {
    fetchQuestion();
  }, [questionId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/questions/comments`,
        {
          question_id: questionId,
          comment: newComment,
          user_id: question.user_id, // Assuming the user is logged in
        },
        { withCredentials: true }
      );
      setComments([...comments, response.data]);
      setNewComment("");
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
  };

  if (!question) return <div>Loading...</div>;



  return (
    <div className={`${isDarkMode ? `dark-mode` : ``}`}>
      <div className="post-main">
        <div className={`post-container ${isDarkMode ? "dark-mode" : ""}`}>
          <h1 className="post-title">{question.question}</h1>
          <div className="post-meta">
            <img
              src={question.profile_pic || "/img/profile_pic.png"}
              alt="Profile"
              className="profile-pic"
            />
            <div className="post-info">
              <p className="username">{question.username}</p>
              <p className="date">
                {new Date(question.created_at).toLocaleString()}
              </p>
            </div>
          </div>
          <div className="post-content">
            <p>{question.answer}</p>
          </div>
          <div className="post-tags">
            {question.tags.map((tag, index) => (
              <span key={index} className="tag">
                #{tag.toLowerCase()}
              </span>
            ))}
          </div>
          <div className="post-details">
            <p className="company">
              Company: <span>{question.company_name || "Not specified"}</span>
            </p>
            <p className="category">
              Category: <span>{question.category || "Not specified"}</span>
            </p>
          </div>
          <div className="post-actions">
            <button
              className={`upvote ${userVote === "upvote" ? "active" : ""} ${
                debouncingButton === "upvote" ? "debouncing" : ""
              }`}
              onClick={handleUpvote}
              disabled={isDebouncing}
            >
              <i className="fa-solid fa-thumbs-up"></i>{" "}
              {userVote === "upvote" ? " Upvoted" : " Upvote"} (
              {upvotes})
              {debouncingButton === "upvote" && (
                <div className="debounce-bar"></div>
              )}
            </button>
            <button
              className={`downvote ${userVote === "downvote" ? "active" : ""} ${
                debouncingButton === "downvote" ? "debouncing" : ""
              }`}
              onClick={handleDownvote}
              disabled={isDebouncing}
            >
              <i className="fa-solid fa-thumbs-down"></i>{" "}
              {userVote === "downvote" ? " Downvoted" : " Downvote"} (
              {downvotes})
              {debouncingButton === "downvote" && (
                <div className="debounce-bar"></div>
              )}
            </button>
          </div>
          <div className="comments-section">
            <h3>Comments</h3>
            <form onSubmit={handleCommentSubmit} className="comment-form">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="comment-input"
              />
              <button type="submit" className="comment-submit">
                Send
              </button>
            </form>
            <div className="comments-list">
              {comments
                .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
                .map((comment) => (
                  <div key={comment._id} className="comment">
                    <div className="comment-header">
                      <div className="comment-user-info">
                        <img
                          src={comment.profile_pic || "/img/default_avatar.png"}
                          alt={comment.username}
                          className="comment-profile-pic"
                        />
                        <span className="comment-username">{comment.username}</span>
                      </div>
                      <span className="comment-time">
                        {formatTimeAgo(comment.created_at)}
                      </span>
                    </div>
                    <p className="comment-content">{comment.comment}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
