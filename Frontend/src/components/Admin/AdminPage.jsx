import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UnapprovedQuestions from './UnapprovedQuestions';
import AccessDenied from './AccessDenied';
import AdminPasskeyForm from './AdminPasskeyForm';
import useNotification from '../Notifications';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import './AdminPage.css';

import FeedbackCharts from './FeedbackCharts';

const AdminPage = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [pendingFAQs, setPendingFAQs] = useState([]);
  const [activeFAQ, setActiveFAQ] = useState(null);
  const { SuccessNotification, ErrorNotification } = useNotification();

  useEffect(() => {
    checkAdminStatus();
  }, []);

  useEffect(() => {
    if (isVerified) {
      fetchPendingFAQs();
    }
  }, [isVerified]);

  const checkAdminStatus = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/check-status`, { withCredentials: true });
      setIsAdmin(response.data.isAdmin);
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    }
  };

  const handlePasskeySubmit = async (passkey) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/admin/verify-passkey`, { passkey }, { withCredentials: true });
      if (response.data.verified) {
        setIsVerified(true);
        SuccessNotification('Admin Access Granted');
      } else {
        ErrorNotification('Invalid Passkey');
      }
    } catch (error) {
      console.error('Error verifying passkey:', error);
      ErrorNotification('Error verifying passkey');
    }
  };

  const fetchPendingFAQs = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/faq/pending`, { withCredentials: true });
      setPendingFAQs(response.data);
    } catch (error) {
      console.error('Error fetching pending FAQs:', error);
      ErrorNotification('Error fetching pending FAQs');
    }
  };

  const handleRejectFAQ = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/faq/${id}`, { withCredentials: true });
      SuccessNotification('FAQ rejected successfully');
      fetchPendingFAQs();
    } catch (error) {
      console.error('Error rejecting FAQ:', error);
      ErrorNotification('Error rejecting FAQ');
    }
  };

  const handleAnswerFAQ = async (id, answer) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/faq/answer/${id}`, { ans: answer }, { withCredentials: true });
      SuccessNotification('FAQ answered successfully');
      fetchPendingFAQs();
    } catch (error) {
      console.error('Error answering FAQ:', error);
      ErrorNotification('Error answering FAQ');
    }
  };

    const [feedbackData, setFeedbackData] = useState([]);
  
    useEffect(() => {
      // Fetch feedback data from your API
      const fetchFeedbackData = async () => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/feedback`);
          const data = await response.json();
          setFeedbackData(data);
        } catch (error) {
          console.error('Error fetching feedback data:', error);
        }
      };
  
      fetchFeedbackData();
    }, []);

  const toggleFAQ = (index) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

  if (!isAdmin) {
    return <AccessDenied />;
  }

  if (!isVerified) {
    return <AdminPasskeyForm onSubmit={handlePasskeySubmit} />;
  }

  return (
    <div className="admin-page">
      <h1>Admin Dashboard</h1>
      <UnapprovedQuestions />
      <section className="faq-requests">
        <h2> <span className='pending-req'>Pending</span> FAQ Requests</h2>
        <div className="faq-list">
          {pendingFAQs.map((faq, index) => (
            <div key={faq._id} className={`faq-item ${activeFAQ === index ? 'active' : ''}`}>
              <div className="faq-question" onClick={() => toggleFAQ(index)}>
                <h3>{faq.question}</h3>
                {activeFAQ === index ? <FaChevronUp /> : <FaChevronDown />}
              </div>
              {activeFAQ === index && (
                <div className="faq-answer">
                  <textarea
                    placeholder="Enter your answer here"
                    onChange={(e) => faq.tempAnswer = e.target.value}
                  />
                  <button onClick={() => handleAnswerFAQ(faq._id, faq.tempAnswer)} className="faq-answer-btn">Submit Answer</button>
                  <button onClick={() => handleRejectFAQ(faq._id)} className="faq-reject-btn">Reject FAQ</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
      <FeedbackCharts feedbackData={feedbackData} />
    </div>
  );
};

export default AdminPage;
