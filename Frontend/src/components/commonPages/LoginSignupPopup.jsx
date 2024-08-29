// src/components/CommonPages/LoginSignupPopup.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './LoginSignupPopup.css';
import { useTheme } from '../../ThemeContext';

const LoginSignupPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  return (
    <div className={`loginsignuppopup-overlay ${isVisible ? 'loginsignuppopup-visible' : ''} ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="loginsignuppopup-container">
        <div className="loginsignuppopup-content">
          <div className="loginsignuppopup-icon">
            <i className="fas fa-lock"></i>
          </div>
          <h2 className="loginsignuppopup-title">Access Required</h2>
          <p className="loginsignuppopup-message">
            To view this content, please log in or create an account.
          </p>
          <div className="loginsignuppopup-buttons">
            <Link to="/login" className="loginsignuppopup-button loginsignuppopup-login">
              <i className="fas fa-sign-in-alt"></i> Log In
            </Link>
            <Link to="/signup" className="loginsignuppopup-button loginsignuppopup-signup">
              <i className="fas fa-user-plus"></i> Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSignupPopup;
