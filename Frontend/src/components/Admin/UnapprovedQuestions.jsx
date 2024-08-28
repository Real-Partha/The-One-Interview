import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DOMPurify from 'dompurify';
import './UnapprovedQuestions.css';

const UnapprovedQuestions = () => {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    fetchUnapprovedQuestions();
  }, []);

  const fetchUnapprovedQuestions = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/questions/unapproved`, { withCredentials: true });
      setQuestions(response.data);
    } catch (error) {
      console.error('Error fetching unapproved questions:', error);
    }
  };

  const handleApprove = async (questionId) => {
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/admin/approve-question/${questionId}`, {}, { withCredentials: true });
      fetchUnapprovedQuestions();
    } catch (error) {
      console.error('Error approving question:', error);
    }
  };

  const handleReject = async (questionId) => {
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/admin/reject-question/${questionId}`, {}, { withCredentials: true });
      fetchUnapprovedQuestions();
    } catch (error) {
      console.error('Error rejecting question:', error);
    }
  };

  return (
    <div className="unapproved-questions">
      <h2>Unapproved Questions</h2>
      {questions.map((question) => (
        <div key={question._id} className="unapproved-questions__card">
          <h3 className="unapproved-questions__title">{question.question}</h3>
          <div 
            className="unapproved-questions__content quill-content" 
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(question.answer) }} 
          />
          <div className="unapproved-questions__meta">
            <p>Category: {question.category}</p>
            <p>Level: {question.level}</p>
            <p>Company: {question.companyName || 'Not specified'}</p>
          </div>
          <div className="unapproved-questions__tags">
            {question.tags.map((tag, index) => (
              <span key={index} className="unapproved-questions__tag">#{tag}</span>
            ))}
          </div>
          <div className="unapproved-questions__actions">
            <button onClick={() => handleApprove(question._id)} className="unapproved-questions__approve-btn">Approve</button>
            <button onClick={() => handleReject(question._id)} className="unapproved-questions__reject-btn">Reject</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UnapprovedQuestions;
