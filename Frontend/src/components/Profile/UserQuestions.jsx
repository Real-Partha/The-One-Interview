import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import DOMPurify from "dompurify";
import "./UserQuestions.css";

const UserQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const fetchUserQuestions = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/user/questions`,
          { withCredentials: true }
        );
        setQuestions(response.data);
      } catch (error) {
        console.error("Error fetching user questions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserQuestions();
  }, []);

  const getBadgeColor = (status) => {
    switch (status) {
      case "approved":
        return "green";
      case "unverified":
        return "yellow";
      case "rejected":
        return "red";
      default:
        return "gray";
    }
  };

  const getBadgeText = (status) => {
    return status === "unverified" ? "Pending" : status;
  };

  const filteredQuestions = questions.filter((question) => {
    if (filter === "All") return true;
    return question.status.toLowerCase() === filter.toLowerCase();
  });

  if (loading) {
    return <div className="userquestions-loading">Loading...</div>;
  }

  return (
    <div className="userquestions-container">
      <h2 className="userquestions-title">Your Questions</h2>
      <div className="userquestions-filter">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="userquestions-dropdown"
        >
          <option value="All">All</option>
          <option value="Approved">Approved</option>
          <option value="Unverified">Pending</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>
      {filteredQuestions.length === 0 ? (
        <p className="userquestions-empty">
          You haven't asked any questions in this category yet.
        </p>
      ) : (
        filteredQuestions.map((question) => (
          <div key={question._id} className="userquestions-card">
            <div
              className={`userquestions-badge ${getBadgeColor(question.status)}`}
            >
              {getBadgeText(question.status)}
            </div>
            <h3 className="userquestions-question">{question.question}</h3>
            <div
              className="userquestions-answer quill-content"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(question.answer) }}
            />
            <div className="userquestions-meta">
              <span>
                Posted on: {new Date(question.created_at).toLocaleDateString()}
              </span>
              <span>Views: {question.impressions}</span>
            </div>
            <Link
              to={`/question/${question._id}`}
              className="userquestions-preview-button"
            >
              Preview Question
            </Link>
          </div>
        ))
      )}
    </div>
  );
};

export default UserQuestions;
