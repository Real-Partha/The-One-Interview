import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './LoginSignupPopup.css';
import { useTheme } from '../../ThemeContext';

const LoginSignupPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { isDarkMode } = useTheme();
  const [activeButton, setActiveButton] = useState(null);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const handleButtonHover = (button) => {
    setActiveButton(button);
  };

  const handleButtonLeave = () => {
    setActiveButton(null);
  };

  return (
    <div className={`loginsignuppopup-overlay ${isVisible ? 'loginsignuppopup-visible' : ''} ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="loginsignuppopup-container">
        <div className="loginsignuppopup-content">
          <div className="loginsignuppopup-icon-wrapper">
            <div className="loginsignuppopup-icon">
              <i className="fas fa-lock"></i>
            </div>
            <div className="loginsignuppopup-icon-ring"></div>
          </div>
          <h2 className="loginsignuppopup-title">Exclusive Content Awaits!</h2>
          <p className="loginsignuppopup-message">
            Unlock a world of knowledge and engage with our community. Sign in or create an account to access this content.
          </p>
          <div className="loginsignuppopup-buttons">
            <Link 
              to="/login-register?mode=login" 
              className={`loginsignuppopup-button loginsignuppopup-login ${activeButton === 'login' ? 'active' : ''}`}
              onMouseEnter={() => handleButtonHover('login')}
              onMouseLeave={handleButtonLeave}
            >
              <i className="fas fa-sign-in-alt"></i> Log In
              <span className="loginsignuppopup-button-highlight"></span>
            </Link>
            <Link 
              to="/login-register?mode=signup" 
              className={`loginsignuppopup-button loginsignuppopup-signup ${activeButton === 'signup' ? 'active' : ''}`}
              onMouseEnter={() => handleButtonHover('signup')}
              onMouseLeave={handleButtonLeave}
            >
              <i className="fas fa-user-plus"></i> Sign Up
              <span className="loginsignuppopup-button-highlight"></span>
            </Link>
          </div>
        </div>
        <div className="loginsignuppopup-decoration loginsignuppopup-decoration-1"></div>
        <div className="loginsignuppopup-decoration loginsignuppopup-decoration-2"></div>
        <div className="loginsignuppopup-decoration loginsignuppopup-decoration-3"></div>
      </div>
    </div>
  );
};

export default LoginSignupPopup;
