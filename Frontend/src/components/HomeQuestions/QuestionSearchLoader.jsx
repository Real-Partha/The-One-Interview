import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import './QuestionSearchLoader.css';

const QuestionSearchLoader = () => {
  return (
    <div className="questionsearchloader-container">
      <div className="questionsearchloader-icon">
        <FontAwesomeIcon icon={faSearch} />
      </div>
      <div className="questionsearchloader-text">
        Searching
        <span className="questionsearchloader-dot">.</span>
        <span className="questionsearchloader-dot">.</span>
        <span className="questionsearchloader-dot">.</span>
      </div>
    </div>
  );
};

export default QuestionSearchLoader;
