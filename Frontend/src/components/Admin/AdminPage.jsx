import React from 'react';
import UnapprovedQuestions from './UnapprovedQuestions';

const AdminPage = () => {
  return (
    <div className="admin-page">
      <h1>Admin Dashboard</h1>
      <UnapprovedQuestions />
    </div>
  );
};

export default AdminPage;
