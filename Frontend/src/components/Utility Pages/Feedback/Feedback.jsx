// components/Utility Pages/Feedback/Feedback.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaStar,
  FaRegStar,
  FaPaperPlane,
  FaSpinner,
  FaUser,
  FaSort,
  FaSearch,
  FaQuestion,
  FaPalette,
  FaMoon,
  FaSun,
  FaComments,
  FaHome,
} from "react-icons/fa";
import "./Feedback.css";

const Feedback = () => {
  const [ratings, setRatings] = useState({
    usability: 0,
    navigation: 0,
    design: 0,
    questionQuality: 0,
    answerQuality: 0,
    searchFunctionality: 0,
    sortingOptions: 0,
    companyTagging: 0,
    lightMode: 0,
    darkMode: 0,
  });
  const [hoveredRatings, setHoveredRatings] = useState({});
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    if (isSubmitted) {
      window.scrollTo(0, 0);
      setTimeout(() => {
        setShowConfetti(false);
      }, 5000); // Stop confetti after 5 seconds
    }
  }, [isSubmitted]);

  const handleStarHover = (category, value) => {
    setHoveredRatings((prev) => ({ ...prev, [category]: value }));
  };

  const handleStarClick = (category, value) => {
    setRatings((prev) => ({ ...prev, [category]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/feedback`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...ratings, comment }),
        }
      );

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        throw new Error("Failed to submit feedback");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (category) => {
    return (
      <div className="feedback-stars">
        {[...Array(5)].map((_, index) => (
          <span
            key={index}
            className={`feedback-star ${
              index < (hoveredRatings[category] || ratings[category])
                ? "active"
                : ""
            }`}
            onMouseEnter={() => handleStarHover(category, index + 1)}
            onMouseLeave={() => handleStarHover(category, 0)}
            onClick={() => handleStarClick(category, index + 1)}
          >
            {index < ratings[category] ? <FaStar /> : <FaRegStar />}
          </span>
        ))}
      </div>
    );
  };

  useEffect(() => {
    if (isSubmitted) {
      window.scrollTo(0, 0);
    }
  }, [isSubmitted]);

  const renderConfetti = () => {
    if (!showConfetti) return null;

    const pieces = [];
    const colors = ["#f00", "#0f0", "#00f", "#ff0", "#f0f", "#0ff"];
    for (let i = 0; i < 100; i++) {
      const style = {
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 5}s`,
        backgroundColor: colors[Math.floor(Math.random() * colors.length)],
      };
      pieces.push(<div key={i} className="confetti-piece" style={style}></div>);
    }
    return pieces;
  };

  if (isSubmitted) {
    return (
      <div className="feedback-main-container">
        <div className="feedback-thank-you">
          <h2>Thank you for your valuable feedback!</h2>
          <p>
            We appreciate your input and will use it to improve our website.
          </p>
          <Link to="/" className="feedback-home-button">
            <FaHome /> Return to Home
          </Link>
          <div className="feedback-confetti">{renderConfetti()}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="feedback-main-container">
      <div className="feedback-container">
        <h1 className="feedback-title">Help Us Improve Your Experience</h1>
        <form onSubmit={handleSubmit} className="feedback-form">
          <div className="feedback-ratings">
            <div className="feedback-rating">
              <label>
                <FaUser /> Usability
              </label>
              {renderStars("usability")}
            </div>
            <div className="feedback-rating">
              <label>
                <FaSort /> Navigation
              </label>
              {renderStars("navigation")}
            </div>
            <div className="feedback-rating">
              <label>
                <FaPalette /> Design
              </label>
              {renderStars("design")}
            </div>
            <div className="feedback-rating">
              <label>
                <FaQuestion /> Question Quality
              </label>
              {renderStars("questionQuality")}
            </div>
            <div className="feedback-rating">
              <label>
                <FaComments /> Answer Quality
              </label>
              {renderStars("answerQuality")}
            </div>
            <div className="feedback-rating">
              <label>
                <FaSearch /> Search Functionality
              </label>
              {renderStars("searchFunctionality")}
            </div>
            <div className="feedback-rating">
              <label>
                <FaSort /> Sorting Options
              </label>
              {renderStars("sortingOptions")}
            </div>
            <div className="feedback-rating">
              <label>
                <FaUser /> Company Tagging
              </label>
              {renderStars("companyTagging")}
            </div>
            <div className="feedback-rating">
              <label>
                <FaSun /> Light Mode
              </label>
              {renderStars("lightMode")}
            </div>
            <div className="feedback-rating">
              <label>
                <FaMoon /> Dark Mode
              </label>
              {renderStars("darkMode")}
            </div>
          </div>
          <div className="feedback-comment">
            <label htmlFor="comment">Your thoughts</label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us what you think about our forum..."
            />
          </div>
          <button
            type="submit"
            className="feedback-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <FaSpinner className="feedback-spinner" /> Submitting...
              </>
            ) : (
              <>
                <FaPaperPlane /> Submit Feedback
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Feedback;
