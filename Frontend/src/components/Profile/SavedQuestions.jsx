import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./SavedQuestions.css";

const SavedQuestions = () => {
  const [savedQuestions, setSavedQuestions] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const observer = useRef();

  const lastQuestionElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const fetchSavedQuestions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/account/saved-questions?page=${page}`,
        { withCredentials: true }
      );
      setSavedQuestions((prevQuestions) => [
        ...prevQuestions,
        ...response.data.questions,
      ]);
      setHasMore(response.data.hasMore);
    } catch (error) {
      console.error("Error fetching saved questions:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSavedQuestions();
  }, [page]);

  const handleUnsave = async (questionId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/account/savequestion`,
        { questionId },
        { withCredentials: true }
      );
      setSavedQuestions((prevQuestions) =>
        prevQuestions.filter((question) => question._id !== questionId)
      );
    } catch (error) {
      console.error("Error unsaving question:", error);
    }
  };

  return (
    <div className="SavedQuestions">
      <h2 className="SavedQuestions-title">Saved Questions</h2>
      {savedQuestions.length === 0 && !loading ? (
        <p className="SavedQuestions-empty">
          You haven't saved any questions yet.
        </p>
      ) : (
        <ul className="SavedQuestions-list">
          {savedQuestions.map((question, index) => (
            <li
              key={question._id}
              className="SavedQuestions-item"
              ref={
                index === savedQuestions.length - 1
                  ? lastQuestionElementRef
                  : null
              }
            >
              <Link
                to={`/question/${question._id}`}
                className="SavedQuestions-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                <h3 className="SavedQuestions-question-title">
                  {question.question}
                </h3>
                <div className="SavedQuestions-question-details">
                  <span className="SavedQuestions-company">
                    {question.companyName}
                  </span>
                  <span className="SavedQuestions-category">
                    {question.category}
                  </span>
                  <span className="SavedQuestions-date">
                    {new Date(question.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="SavedQuestions-question-stats">
                  <span className="SavedQuestions-upvotes">
                    👍 {question.upvotes}
                  </span>
                  <span className="SavedQuestions-downvotes">
                    👎 {question.downvotes}
                  </span>
                  <span className="SavedQuestions-comments">
                    💬 {question.commentscount}
                  </span>
                </div>
                <div className="SavedQuestions-tags">
                  {question.tags.map((tag, i) => (
                    <span key={i} className="SavedQuestions-tag">
                      #{tag}
                    </span>
                  ))}
                </div>
              </Link>
              <button
                className="SavedQuestions-unsave-btn"
                onClick={() => handleUnsave(question._id)}
              >
                Unsave
              </button>
            </li>
          ))}
        </ul>
      )}
      {loading && <div className="SavedQuestions-loader">Loading...</div>}
    </div>
  );
};

export default SavedQuestions;
