import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useTheme } from '../../ThemeContext';
import Sidebar from '../Left Sidebar/Sidebar';
import { FaTrophy, FaArrowUp, FaEye, FaComment, FaMedal, FaFire } from 'react-icons/fa';
import './MostUpvoted.css';

const MostUpvoted = () => {
  const [topQuestions, setTopQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    fetchTopQuestions();
  }, []);

  useEffect(() => {
    fetchTopQuestions();
    window.scrollTo(0, 0);
  }, []);

  const fetchTopQuestions = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/questions/most-upvoted`);
      setTopQuestions(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching top questions:', error);
      setIsLoading(false);
    }
  };

  const getMedalColor = (index) => {
    switch (index) {
      case 0: return 'gold';
      case 1: return 'silver';
      case 2: return 'bronze';
      default: return 'none';
    }
  };

  return (
    <div className={`Most-Upvoted-page ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <Sidebar />
      <div className="Most-Upvoted-content">
        <h1 className="Most-Upvoted-title">
          <FaTrophy className="Most-Upvoted-trophy-icon" /> Most Upvoted Questions
        </h1>
        <div className="Most-Upvoted-subtitle">
          <FaFire className="Most-Upvoted-fire-icon" /> Hot Topics
        </div>
        {isLoading ? (
          <div className="Most-Upvoted-loading-spinner"></div>
        ) : (
          <div className="Most-Upvoted-question-grid">
            {topQuestions.map((question, index) => (
              <Link to={`/question/${question._id}`} key={question._id} className="Most-Upvoted-question-card">
                <div className={`Most-Upvoted-question-rank ${getMedalColor(index)}`}>
                  {index < 3 ? <FaMedal /> : index + 1}
                </div>
                <h2 className="Most-Upvoted-question-title">{question.question}</h2>
                <div className="Most-Upvoted-question-stats">
                  <span className="Most-Upvoted-upvotes">
                    <FaArrowUp /> {question.upvotes}
                  </span>
                  <span className="Most-Upvoted-views">
                    <FaEye /> {question.impressions}
                  </span>
                  <span className="Most-Upvoted-comments">
                    <FaComment /> {question.commentscount}
                  </span>
                </div>
                <div className="Most-Upvoted-question-tags">
                  {question.tags.slice(0, 3).map((tag, tagIndex) => (
                    <span key={tagIndex} className="Most-Upvoted-tag">
                      #{tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MostUpvoted;
