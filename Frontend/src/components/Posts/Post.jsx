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

  const handleUpvote = async () => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/upvote`,
        { _id: questionId },
        { withCredentials: true }
      );
      fetchQuestion();
    } catch (error) {
      console.error("Error upvoting question:", error);
    }
  };

  const handleDownvote = async () => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/downvote`,
        { _id: questionId },
        { withCredentials: true }
      );
      fetchQuestion();
    } catch (error) {
      console.error("Error downvoting question:", error);
    }
  };

  const fetchQuestion = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/question/${questionId}`,
        { withCredentials: true }
      );
      setQuestion(response.data);
      setUserVote(response.data.userVote);
    } catch (error) {
      console.error("Error fetching question:", error);
    }
  };

  useEffect(() => {
    fetchQuestion();
  }, [questionId]);

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
              className={`upvote ${userVote === "upvote" ? "active" : ""}`}
              onClick={handleUpvote}
            >
              <i className="fa-solid fa-thumbs-up"></i> {userVote === "upvote" ? " Upvoted" : " Upvote"} (
              {question.upvotes})
            </button>
            <button
              className={`downvote ${userVote === "downvote" ? "active" : ""}`}
              onClick={handleDownvote}
            >
              <i className="fa-solid fa-thumbs-down"></i> {userVote === "downvote" ? " Downvoted" : " Downvote"} (
              {question.downvotes})
            </button>
            <button className="comment">
              <i className="fa-solid fa-comment"></i> Comment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
