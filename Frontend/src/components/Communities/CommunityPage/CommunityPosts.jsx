import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  FaComments,
  FaArrowUp,
  FaArrowDown,
  FaClock,
  FaEye,
  FaUser,
  FaBuilding,
  FaTag,
} from "react-icons/fa";
import "./CommunityPosts.css";

const CommunityPosts = ({ community }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/communities/${
            community.nickname
          }/questions`
        );
        setQuestions(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching questions:", error);
        setLoading(false);
      }
    };

    if (community) {
      fetchQuestions();
    }
  }, [community]);

  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months}mo ago`;
    const years = Math.floor(months / 12);
    return `${years}y ago`;
  };

  if (loading) {
    return <div className="communityposts-loading">Loading questions...</div>;
  }

  return (
    <div className="communityposts-container">
      <h2 className="communityposts-title">Community Posts</h2>
      {questions.length > 0 ? (
        <div className="communityposts-grid">
          {questions.map((question) => (
            <Link
              to={`/question/${question._id}`}
              key={question._id}
              className="communityposts-card"
            >
              <h3 className="communityposts-card-title">
                {truncateText(question.question, 100)}
              </h3>
              <p className="communityposts-card-preview">
                {truncateText(question.answer, 150)}
              </p>
              <div className="communityposts-card-info">
                <div className="communityposts-card-user">
                  <img
                    src={question.user_id.profile_pic}
                    alt={question.user_id.username}
                    className="communityposts-user-avatar"
                  />
                  <span>{question.user_id.username}</span>
                </div>
                <div className="communityposts-card-company">
                  <FaBuilding /> {question.companyName || "Unknown"}
                </div>
                <div className="communityposts-card-tags">
                  {question.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="communityposts-tag">
                      #{tag}
                    </span>
                  ))}
                  {question.tags.length > 3 && (
                    <span className="communityposts-tag">...</span>
                  )}
                </div>
                <div className="communityposts-card-stats">
                  <span className="communityposts-card-upvotes">
                    <FaArrowUp /> {question.upvotes}
                  </span>
                  <span className="communityposts-card-downvotes">
                    <FaArrowDown /> {question.downvotes}
                  </span>
                  <span className="communityposts-card-comments">
                    <FaComments /> {question.commentscount}
                  </span>
                  <span className="communityposts-card-views">
                    <FaEye /> {question.impressions || 0}
                  </span>
                  <span className="communityposts-card-date">
                    <FaClock /> {timeAgo(question.created_at)}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="communityposts-empty">
          <p>No questions have been posted yet for this community.</p>
          <button className="communityposts-ask-button">Ask a Question</button>
        </div>
      )}
    </div>
  );
};

export default CommunityPosts;
