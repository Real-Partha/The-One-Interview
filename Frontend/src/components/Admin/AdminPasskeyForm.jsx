import React, { useState } from 'react';
import './AdminPasskeyForm.css';

const AdminPasskeyForm = ({ onSubmit }) => {
  const [passkey, setPasskey] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(passkey);
  };

  return (
    <div className="admin-passkey-form">
      <h2>Enter Admin Passkey</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          value={passkey}
          onChange={(e) => setPasskey(e.target.value)}
          placeholder="Enter passkey"
          required
        />
        <button type="submit">Verify</button>
      </form>
    </div>
  );
};

export default AdminPasskeyForm;
