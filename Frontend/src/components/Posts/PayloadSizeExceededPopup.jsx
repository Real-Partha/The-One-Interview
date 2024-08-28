// PayloadSizeExceededPopup.jsx
import React from 'react';
import './PayloadSizeExceededPopup.css';
import { useTheme } from "../../ThemeContext";
import { FaExclamationTriangle, FaTimesCircle, FaInfoCircle, FaCheckCircle } from 'react-icons/fa';

const PayloadSizeExceededPopup = ({ onClose }) => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`payloadsizeexceededpopup-overlay ${isDarkMode ? 'payloadsizeexceededpopup-dark' : ''}`}>
      <div className="payloadsizeexceededpopup-content">
        <div className="payloadsizeexceededpopup-icon">
          <FaExclamationTriangle />
        </div>
        <h2 className="payloadsizeexceededpopup-title">Answer Size Exceeded</h2>
        <div className="payloadsizeexceededpopup-message">
          <p><FaTimesCircle className="icon-inline" /> The answer size has exceeded 5 MB.</p>
          <p><FaInfoCircle className="icon-inline" /> This may be due to too many images being used.</p>
          <p><FaCheckCircle className="icon-inline" /> Please try the following:</p>
          <ul>
            <li>Remove some images</li>
            <li>Compress existing images</li>
            <li>Provide more text content using the editor</li>
          </ul>
        </div>
        <button className="payloadsizeexceededpopup-close-btn" onClick={onClose}>
          Got it
        </button>
      </div>
    </div>
  );
};

export default PayloadSizeExceededPopup;
