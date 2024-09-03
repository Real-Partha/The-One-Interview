import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DOMPurify from 'dompurify';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import useNotification from '../Notifications';
import './UnapprovedQuestions.css';

const UnapprovedQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [activeQuestion, setActiveQuestion] = useState(null);
  const { SuccessNotification, ErrorNotification } = useNotification();

  useEffect(() => {
    fetchUnapprovedQuestions();
  }, []);

  const fetchUnapprovedQuestions = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/questions/unapproved`, { withCredentials: true });
      setQuestions(response.data);
    } catch (error) {
      console.error('Error fetching unapproved questions:', error);
      ErrorNotification('Error fetching unapproved questions');
    }
  };

  const handleApprove = async (questionId) => {
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/admin/approve-question/${questionId}`, {}, { withCredentials: true });
      SuccessNotification('Question Approved!');
      fetchUnapprovedQuestions();
    } catch (error) {
      console.error('Error approving question:', error);
      ErrorNotification('Error approving question');
    }
  };

  const handleReject = async (questionId) => {
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/admin/reject-question/${questionId}`, {}, { withCredentials: true });
      SuccessNotification('Question Rejected');
      fetchUnapprovedQuestions();
    } catch (error) {
      console.error('Error rejecting question:', error);
      ErrorNotification('Error rejecting question');
    }
  };

  const toggleQuestion = (index) => {
    setActiveQuestion(activeQuestion === index ? null : index);
  };

  return (
    <div className="unapproved-questions">
      <h2><span className="pending-req">Pending</span> Unapproved Questions</h2>
      <div className="question-list">
        {questions.map((question, index) => (
          <div key={question._id} className={`question-item ${activeQuestion === index ? 'active' : ''}`}>
            <div className="question-header" onClick={() => toggleQuestion(index)}>
              <h3 className="question-title">{question.question}</h3>
              {activeQuestion === index ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            {activeQuestion === index && (
              <div className="question-content">
                <div 
                  className="question-answer quill-content" 
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(question.answer) }} 
                />
                <div className="question-meta">
                  <p>Category: {question.category}</p>
                  <p>Level: {question.level}</p>
                  <p>Company: {question.companyName || 'Not specified'}</p>
                </div>
                <div className="question-tags">
                  {question.tags.map((tag, tagIndex) => (
                    <span key={tagIndex} className="question-tag">#{tag}</span>
                  ))}
                </div>
                <div className="question-actions">
                  <button onClick={() => handleApprove(question._id)} className="question-approve-btn">Approve</button>
                  <button onClick={() => handleReject(question._id)} className="question-reject-btn">Reject</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UnapprovedQuestions;
