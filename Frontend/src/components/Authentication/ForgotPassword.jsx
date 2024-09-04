import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ForgotPassword.css";
import useNotification from "../Notifications";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1);
  const { ErrorNotification, SuccessNotification } = useNotification();
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/forgot-password`,
        { email }
      );
      SuccessNotification(response.data.message);
      setStep(2);
    } catch (error) {
      ErrorNotification(error.response.data.message);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/verify-forgot-password-otp`,
        { email, otp }
      );
      SuccessNotification(response.data.message);
      setStep(3);
    } catch (error) {
      ErrorNotification(error.response.data.message);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      ErrorNotification("Passwords do not match");
      return;
    }
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/reset-password`,
        { email, otp, newPassword }
      );
      SuccessNotification(response.data.message);
      setTimeout(() => {
        navigate("/login");
      }, 1000); // Redirect after 2 seconds
    } catch (error) {
      ErrorNotification(error.response.data.message);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-box">
        <div className="forgot-password-header">
          <i className="fas fa-lock-open"></i>
          <h2 className="forgot-password-heading">Forgot Password</h2>
          <p className="forgot-password-subheading">
            Let's get you back into your account!
          </p>
        </div>
        {step === 1 && (
          <form onSubmit={handleEmailSubmit}>
            <div className="forgot-password-input-group">
              <label htmlFor="email">
                <i className="fas fa-envelope"></i> Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <button type="submit" className="forgot-password-submit-button">
              <i className="fas fa-paper-plane"></i> Send OTP
            </button>
          </form>
        )}
        {step === 2 && (
          <form onSubmit={handleOtpSubmit}>
            <div className="forgot-password-input-group">
              <label htmlFor="otp">
                <i className="fas fa-key"></i> OTP
              </label>
              <input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 8-digit OTP"
                required
                maxLength="8"
              />
            </div>
            <button type="submit" className="forgot-password-submit-button">
              <i className="fas fa-check-circle"></i> Verify OTP
            </button>
          </form>
        )}
        {step === 3 && (
          <form onSubmit={handlePasswordReset}>
            <div className="forgot-password-input-group">
              <label htmlFor="newPassword">
                <i className="fas fa-lock"></i> New Password
              </label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
              />
            </div>
            <div className="forgot-password-input-group">
              <label htmlFor="confirmPassword">
                <i className="fas fa-lock"></i> Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
              />
            </div>
            <button type="submit" className="forgot-password-submit-button">
              <i className="fas fa-save"></i> Reset Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
