import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AccountSettings.css";
import useNotification from '../Notifications';

const AccountSettings = ({ user }) => {
  const [email, setEmail] = useState(user.email);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [hasPassword, setHasPassword] = useState(null);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const { ErrorNotification, SuccessNotification } = useNotification();

  useEffect(() => {
    const fetchHasPassword = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/auth/has-password`,
          {
            withCredentials: true,
          }
        );
        setHasPassword(response.data.hasPassword);
      } catch (error) {
        ErrorNotification(error.response.data.message);
        setError(error.response.data.message || "An error occurred");
      }
    };

    fetchHasPassword();
  }, []);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      ErrorNotification("New passwords don't match");
      setError("New passwords don't match");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/${hasPassword ? 'change-password' : 'set-password'}`,
        hasPassword ? { currentPassword, newPassword } : { newPassword },
        { withCredentials: true }
      );
      SuccessNotification(response.data.message);
      setSuccess(response.data.message);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordFields(false);
      setHasPassword(true);
    } catch (error) {
      ErrorNotification(error.response.data.message);
      setError(error.response.data.message || "An error occurred");
    }
  };

  return (
    <div className="account-settings-container">
      <h2 className="account-settings-title">Account Settings</h2>
      <div className="account-settings-email-section">
        <h3 className="account-settings-subtitle">Email</h3>
        <p className="account-settings-email">{email}</p>
        <p className="account-settings-email-note">
          Email cannot be changed at this time.
        </p>
      </div>
      <div className="account-settings-password-section">
        <h3 className="account-settings-subtitle">Password</h3>
        {!showPasswordFields ? (
          <button
            onClick={() => setShowPasswordFields(true)}
            className="account-settings-button"
          >
            {hasPassword ? "Reset Password" : "Set Password"}
          </button>
        ) : (
          <form
            onSubmit={handlePasswordChange}
            className="account-settings-form"
          >
            {hasPassword && (
              <div className="account-settings-form-group">
                <label
                  htmlFor="currentPassword"
                  className="account-settings-label"
                >
                  Current Password
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  className="account-settings-input"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
            )}
            <div className="account-settings-form-group">
              <label htmlFor="newPassword" className="account-settings-label">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                className="account-settings-input"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="account-settings-form-group">
              <label
                htmlFor="confirmPassword"
                className="account-settings-label"
              >
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="account-settings-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="account-settings-button">
              {hasPassword ? "Change Password" : "Set Password"}
            </button>
            <button
              type="button"
              onClick={() => setShowPasswordFields(false)}
              className="account-settings-button account-settings-cancel-button"
            >
              Cancel
            </button>
          </form>
        )}
      </div>
      {error && <p className="account-settings-error-message">{error}</p>}
      {success && <p className="account-settings-success-message">{success}</p>}
    </div>
  );
};

export default AccountSettings;
