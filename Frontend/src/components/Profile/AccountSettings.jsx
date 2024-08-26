import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AccountSettings.css";
import useNotification from '../Notifications';

const AccountSettings = ({ user }) => {
  const [email, setEmail] = useState(user.email);
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [hasPassword, setHasPassword] = useState(null);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [showEmailFields, setShowEmailFields] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
      }
    };

    fetchHasPassword();
  }, []);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (newPassword !== confirmPassword) {
      ErrorNotification("New passwords don't match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/${hasPassword ? 'change-password' : 'set-password'}`,
        hasPassword ? { currentPassword, newPassword } : { newPassword },
        { withCredentials: true }
      );
      SuccessNotification(response.data.message);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordFields(false);
      setHasPassword(true);
    } catch (error) {
      ErrorNotification(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/change-email`,
        { newEmail },
        { withCredentials: true }
      );
      SuccessNotification(response.data.message);
      setOtpSent(true);
    } catch (error) {
      ErrorNotification(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/verify-email-otp`,
        { otp, newEmail },
        { withCredentials: true }
      );
      SuccessNotification(response.data.message);
      setEmail(newEmail);
      setNewEmail("");
      setOtp("");
      setShowEmailFields(false);
      setOtpSent(false);
    } catch (error) {
      ErrorNotification(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="account-settings-container">
      <h2 className="account-settings-title">Account Settings</h2>
      <div className="account-settings-email-section">
        <h3 className="account-settings-subtitle">Email</h3>
        <p className="account-settings-email">{email}</p>
        {!showEmailFields ? (
          <button
            onClick={() => setShowEmailFields(true)}
            className="account-settings-button"
            disabled={showPasswordFields}
          >
            Change Email
          </button>
        ) : (
          <form onSubmit={handleSendOtp} className="account-settings-form">
            <div className="account-settings-form-group">
              <label htmlFor="newEmail" className="account-settings-label">
                New Email
              </label>
              <input
                type="email"
                id="newEmail"
                className="account-settings-input"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                required
              />
            </div>
            {!otpSent && (
              <div className="account-settings-button-group">
                <button type="submit" className={`account-settings-button account-settings-submit-button ${isLoading ? 'account-settings-button-loading' : ''}`} disabled={isLoading}>
                  {isLoading ? <span className="account-settings-loader"></span> : null}
                  <span className="account-settings-button-text">{isLoading ? 'Sending OTP' : 'Send OTP'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEmailFields(false);
                    setOtpSent(false);
                  }}
                  className="account-settings-button account-settings-cancel-button"
                >
                  Cancel
                </button>
              </div>
            )}
          </form>
        )}
        {otpSent && (
          <form onSubmit={handleVerifyOtp} className="account-settings-form">
            <div className="account-settings-form-group">
              <label htmlFor="otp" className="account-settings-label">
                Enter OTP
              </label>
              <input
                type="text"
                id="otp"
                className="account-settings-input"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
            <button type="submit" className={`account-settings-button account-settings-submit-button ${isLoading ? 'account-settings-button-loading' : ''}`} disabled={isLoading}>
              {isLoading ? <span className="account-settings-loader"></span> : null}
              <span className="account-settings-button-text">{isLoading ? 'Verifying OTP' : 'Verify OTP'}</span>
            </button>
          </form>
        )}
      </div>
      <div className="account-settings-password-section">
        <h3 className="account-settings-subtitle">Password</h3>
        {!showPasswordFields ? (
          <button
            onClick={() => setShowPasswordFields(true)}
            className="account-settings-button"
            disabled={showEmailFields}
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
            <div className="account-settings-button-group">
              <button type="submit" className={`account-settings-button account-settings-submit-button ${isLoading ? 'account-settings-button-loading' : ''}`} disabled={isLoading}>
                {isLoading ? <span className="account-settings-loader"></span> : null}
                <span className="account-settings-button-text">{isLoading ? 'Updating' : "Submit"}</span>
              </button>
              <button
                type="button"
                onClick={() => setShowPasswordFields(false)}
                className="account-settings-button account-settings-cancel-button"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AccountSettings;
