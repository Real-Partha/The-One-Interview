import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UnapprovedQuestions from './UnapprovedQuestions';
import AccessDenied from './AccessDenied';
import AdminPasskeyForm from './AdminPasskeyForm';
import useNotification from '../Notifications';
import './AdminPage.css';

const AdminPage = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const { SuccessNotification, ErrorNotification } = useNotification();

  useEffect(() => {
    checkAdminStatus();
  }, []);

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
    </div>
  );
};

export default AdminPage;
