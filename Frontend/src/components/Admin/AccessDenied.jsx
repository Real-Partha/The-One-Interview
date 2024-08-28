import React from 'react';
import { FaLock, FaExclamationTriangle } from 'react-icons/fa';
import './AccessDenied.css';

const AccessDenied = () => {
  return (
    <div className="access-denied">
      <div className="access-denied__content">
        <div className="access-denied__icon-container">
          <FaLock className="access-denied__icon" />
          <FaExclamationTriangle className="access-denied__icon access-denied__icon--warning" />
        </div>
        <h1 className="access-denied__title">Access Denied</h1>
        <p className="access-denied__message">For admin rights, please contact the administrator.</p>
        <div className="access-denied__barrier">
          <div className="access-denied__barrier-line"></div>
          <div className="access-denied__barrier-line"></div>
          <div className="access-denied__barrier-line"></div>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;
