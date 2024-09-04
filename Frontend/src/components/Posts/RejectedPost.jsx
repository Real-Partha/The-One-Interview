import React from 'react';
import { FaTimesCircle, FaExclamationCircle, FaCog } from 'react-icons/fa';
import './RejectedPost.css';

const RejectedPost = () => {
  return (
    <div className="rejectedpost-container">
      <div className="rejectedpost-content">
        <FaTimesCircle className="rejectedpost-icon" />
        <h2 className="rejectedpost-title">Question Rejected</h2>
        <p className="rejectedpost-message">
          We're sorry, but this question has been rejected and is not available for public viewing.
        </p>
        <div className="rejectedpost-reasons">
          <h3 className="rejectedpost-reasons-title">
            <FaExclamationCircle className="rejectedpost-reasons-icon" />
            Possible reasons for rejection:
          </h3>
          <ul className="rejectedpost-reasons-list">
            <li>Violation of community guidelines or norms</li>
            <li>Duplicate or very similar to an existing question</li>
            <li>Content not relevant to the platform's scope</li>
            <li>Inappropriate or offensive language</li>
            <li>Lack of clarity or context in the question</li>
          </ul>
        </div>
        <p className="rejectedpost-submessage">
          If you believe this is an error, please contact our support team for further assistance.
        </p>
        <div className="rejectedpost-loading">
          <FaCog className="rejectedpost-loading-icon" />
          <FaCog className="rejectedpost-loading-icon rejectedpost-loading-icon--reverse" />
        </div>
      </div>
    </div>
  );
};

export default RejectedPost;
