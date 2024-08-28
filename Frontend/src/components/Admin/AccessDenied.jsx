import React from 'react';
import { FaLock } from 'react-icons/fa';
import './AccessDenied.css';

const AccessDenied = () => {
  return (
    <div className="access-denied">
      <FaLock className="access-denied__icon" />
      <h1 className="access-denied__title">Access Denied</h1>
      <p className="access-denied__message">For admin rights, please contact the administrator.</p>
    </div>
  );
};

export default AccessDenied;
