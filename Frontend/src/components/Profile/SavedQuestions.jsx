import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./SavedQuestions.css";
import { useTheme } from "../../ThemeContext";
import ThreadSkeleton from "../HomeQuestions/threadskeleton";
import { motion, AnimatePresence } from "framer-motion";
import { FaExclamationTriangle, FaCheck, FaTimes } from "react-icons/fa";

const SavedQuestions = () => {
  const [savedQuestions, setSavedQuestions] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const observer = useRef();
  const { isDarkMode } = useTheme();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [questionToUnsave, setQuestionToUnsave] = useState(null);

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
      setTotalPages(response.data.totalPages);
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

  const handleUnsaveClick = (questionId) => {
    setQuestionToUnsave(questionId);
    setShowConfirmation(true);
  };

  const handleConfirmUnsave = async () => {
    if (questionToUnsave) {
      await handleUnsave(questionToUnsave);
      setShowConfirmation(false);
      setQuestionToUnsave(null);
    }
  };

  const handleCancelUnsave = () => {
    setShowConfirmation(false);
    setQuestionToUnsave(null);
  };

  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);

    if (seconds < 10) return "Just now";
    if (seconds < 60) return `${seconds} second${seconds > 1 ? "s" : ""} ago`;

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;

    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} day${days > 1 ? "s" : ""} ago`;

    const months = Math.floor(days / 30);
    if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;

    const years = Math.floor(months / 12);
    return `${years} year${years > 1 ? "s" : ""} ago`;
  };

  return (
    <div
      className={`SavedQuestions ${isDarkMode ? "dark-mode" : "light-mode"}`}
    >
      <h2 className="SavedQuestions-title">Saved Questions</h2>
      {savedQuestions.length === 0 && !loading ? (
        <p className="SavedQuestions-empty">
          You haven't saved any questions yet.
        </p>
      ) : (
        <AnimatePresence>
          <motion.ul className="SavedQuestions-list" layout>
            {savedQuestions.map((question, index) => (
              <motion.li
                key={question._id}
                className="SavedQuestions-item"
                ref={
                  index === savedQuestions.length - 1
                    ? lastQuestionElementRef
                    : null
                }
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: "100%" }}
                transition={{ duration: 0.3 }}
                layout
              >
                <div className="SavedQuestions-card">
                  <Link
                    to={`/question/${question._id}`}
                    className="SavedQuestions-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <h3 className="SavedQuestions-question-title">
                      {truncateText(question.question, 200)}
                    </h3>
                    <div className="SavedQuestions-info">
                      <div className="SavedQuestions-details">
                        <p className="SavedQuestions-meta">
                          <span className="SavedQuestions-category">
                            {question.category}
                          </span>
                          <span className="SavedQuestions-date">
                            {timeAgo(question.created_at)}
                          </span>
                        </p>
                        <div className="SavedQuestions-tags">
                          {question.tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="SavedQuestions-tag">
                              #{tag.toLowerCase()}
                            </span>
                          ))}
                          {question.tags.length > 3 && (
                            <span className="SavedQuestions-tag">...</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="SavedQuestions-footer">
                      <div className="SavedQuestions-stats">
                        <span className="SavedQuestions-upvotes">
                          <i className="fas fa-arrow-alt-circle-up"></i>{" "}
                          {question.upvotes || 0}
                        </span>
                        <span className="SavedQuestions-downvotes">
                          <i className="fas fa-arrow-alt-circle-down"></i>{" "}
                          {question.downvotes || 0}
                        </span>
                        <span className="SavedQuestions-views">
                          <i className="fa-solid fa-eye"></i>{" "}
                          {question.impressions || 0}
                        </span>
                        <span className="SavedQuestions-comments">
                          <i className="fa-solid fa-comments"></i>{" "}
                          {question.commentscount || 0}
                        </span>
                      </div>
                    </div>
                  </Link>
                  <button
                    className="SavedQuestions-unsave-btn"
                    onClick={() => handleUnsaveClick(question._id)}
                  >
                    Unsave
                  </button>
                </div>
              </motion.li>
            ))}
          </motion.ul>
          {showConfirmation && (
            <motion.div
              className="SavedQuestions-confirmation-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="SavedQuestions-confirmation-popup"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <FaExclamationTriangle className="SavedQuestions-confirmation-icon" />
                <h3>Are you sure?</h3>
                <p>Do you really want to unsave this question?</p>
                <div className="SavedQuestions-confirmation-buttons">
                  <button
                    className="SavedQuestions-confirm-btn"
                    onClick={handleConfirmUnsave}
                  >
                    <FaCheck /> Confirm
                  </button>
                  <button
                    className="SavedQuestions-cancel-btn"
                    onClick={handleCancelUnsave}
                  >
                    <FaTimes /> Cancel
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
      {loading &&
        Array(3)
          .fill()
          .map((_, index) => <ThreadSkeleton key={index} />)}
    </div>
  );
};

export default SavedQuestions;
