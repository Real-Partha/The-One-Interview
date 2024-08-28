import React from 'react';
import { FaExclamationTriangle, FaCog } from 'react-icons/fa';
import './UnverifiedPost.css';

const UnverifiedPost = () => {
  return (
    <div className="unverified-post">
      <div className="unverified-post__content">
        <div className="unverified-post__icon-container">
          <FaExclamationTriangle className="unverified-post__icon" />
        </div>
        <h2 className="unverified-post__title">Question Not Yet Approved</h2>
        <p className="unverified-post__message">
          This question is currently not public as it has not been approved by our moderators.
        </p>
        <p className="unverified-post__submessage">
          We're working on reviewing it. Thank you for your patience!
        </p>
        <div className="unverified-post__loading">
          <FaCog className="unverified-post__loading-icon" />
          <FaCog className="unverified-post__loading-icon unverified-post__loading-icon--reverse" />
        </div>
      </div>
    </div>
  );
};

export default UnverifiedPost;
