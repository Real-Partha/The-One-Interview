import React, { useState, useEffect } from 'react';
import NavBar from '../../Navbar/Navbar';
import { useTheme } from '../../../ThemeContext';
import axios from 'axios';
import useNotification from '../../Notifications';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import './FAQ.css';
import { Link } from 'react-router-dom';

const FAQs = () => {
  const [faqs, setFaqs] = useState([]);
  const [userQuestion, setUserQuestion] = useState('');
  const [activeIndex, setActiveIndex] = useState(null);
  const { isDarkMode } = useTheme();
  const { SuccessNotification, ErrorNotification } = useNotification();

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/faq`);
      setFaqs(response.data);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      ErrorNotification('Failed to load FAQs. Please try again later.');
    }
  };

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    if (userQuestion.trim() === '') return;

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/faq/submit`, {
        question: userQuestion
      });
      setUserQuestion('');
      SuccessNotification('Query submitted successfully!');
    } catch (error) {
      console.error('Error submitting question:', error);
      ErrorNotification('Failed to submit your question. Please try again later.');
    }
  };

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className={`FAQ-page ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <NavBar />
      <div className="FAQ-container">
        <h1 className="FAQ-title">Frequently Asked Questions</h1>
        <Link to="/questions" className="FAQ-visit-questions-btn">Visit Questions</Link>
        <div className="FAQ-list">
          {faqs.map((faq, index) => (
            <div key={index} className={`FAQ-item ${activeIndex === index ? 'active' : ''}`}>
              <div className="FAQ-question" onClick={() => toggleFAQ(index)}>
                <h3>{faq.question}</h3>
                {activeIndex === index ? <FaChevronUp /> : <FaChevronDown />}
              </div>
              {activeIndex === index && (
                <div className="FAQ-answer">
                  <p>{faq.ans}</p>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="FAQ-user-question-section">
          <h2>Do you have any questions regarding the site?</h2>
          <form onSubmit={handleQuestionSubmit} className="FAQ-form">
            <input
              type="text"
              value={userQuestion}
              onChange={(e) => setUserQuestion(e.target.value)}
              placeholder="Enter your question here"
              required
              className="FAQ-input"
            />
            <button type="submit" className="FAQ-submit-btn">Submit Question</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FAQs;
