// src/components/commonPages/NotFound.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaExclamationTriangle, FaHome, FaSearch } from 'react-icons/fa';
import './NotFound.css';
import { useTheme } from '../../ThemeContext';

const NotFound = () => {
  const { isDarkMode } = useTheme();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className={`notfound-container ${isDarkMode ? 'notfound-dark' : ''}`}>
      <div className={`notfound-content ${isVisible ? 'notfound-visible' : ''}`}>
        <div className="notfound-glitch" data-text="404">404</div>
        <div className="notfound-icon-wrapper">
          <FaExclamationTriangle className="notfound-icon" />
        </div>
        <h2 className="notfound-subtitle">Oops! Page Not Found</h2>
        <p className="notfound-message">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <div className="notfound-buttons">
          <Link to="/" className="notfound-home-button">
            <FaHome className="notfound-button-icon" />
            Back to Home
          </Link>
          <Link to="/questions" className="notfound-search-button">
            <FaSearch className="notfound-button-icon" />
            Search Questions
          </Link>
        </div>
      </div>
      <div className="notfound-particles">
        {[...Array(20)].map((_, index) => (
          <div key={index} className="notfound-particle"></div>
        ))}
      </div>
    </div>
  );
};

export default NotFound;
