// CommunityNotFound.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../ThemeContext';
import './CommunityNotFound.css';

const CommunityNotFound = () => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`communitynotfound-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <h1 className="communitynotfound-title">Oops! Community Not Found</h1>
      <p className="communitynotfound-message">
        The community you're looking for doesn't exist or has been removed.
      </p>
      <Link to="/communities" className="communitynotfound-link">
        Explore Other Communities
      </Link>
    </div>
  );
};

export default CommunityNotFound;
