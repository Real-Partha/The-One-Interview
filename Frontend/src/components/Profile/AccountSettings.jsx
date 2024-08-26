import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./AccountSettings.css";
import useNotification from "../Notifications";
import { FaEye, FaEyeSlash } from "react-icons/fa";

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
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const { ErrorNotification, SuccessNotification } = useNotification();

  const otpRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  const handleOtpChange = (index, value) => {
    // Only allow numeric input
    if (/^\d*$/.test(value) && value.length <= 1) {
      const newOtpValues = [...otpValues];
      newOtpValues[index] = value;
      setOtpValues(newOtpValues);
      setOtp(newOtpValues.join(""));

      if (value.length === 1 && index < 5) {
        otpRefs[index + 1].current.focus();
      }
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && index > 0 && otpValues[index] === "") {
      const newOtpValues = [...otpValues];
      newOtpValues[index - 1] = "";
      setOtpValues(newOtpValues);
      setOtp(newOtpValues.join(""));
      otpRefs[index - 1].current.focus();
    }
  };

  useEffect(() => {
    const fetchHasPassword = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/account/has-password`,
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

  const handleCloseEmailFields = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowEmailFields(false);
      setOtpSent(false);
      setIsClosing(false);
    }, 700); // This should match the animation duration in CSS
  };

  const handleClosePasswordFields = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowPasswordFields(false);
      setIsClosing(false);
    }, 700); // This should match the animation duration in CSS
  };

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
        `${import.meta.env.VITE_API_URL}/account/${
          hasPassword ? "change-password" : "set-password"
        }`,
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
        `${import.meta.env.VITE_API_URL}/account/change-email`,
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

    const enteredOtp = otpValues.join("");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/account/verify-email-otp`,
        { otp: enteredOtp, newEmail },
        { withCredentials: true }
      );
      SuccessNotification(response.data.message);
      setEmail(newEmail);
      setNewEmail("");
      setOtpValues(["", "", "", "", "", ""]);
      setShowEmailFields(false);
      setOtpSent(false);
    } catch (error) {
      ErrorNotification(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    switch (field) {
      case "current":
        setShowCurrentPassword(!showCurrentPassword);
        break;
      case "new":
        setShowNewPassword(!showNewPassword);
        break;
      case "confirm":
        setShowConfirmPassword(!showConfirmPassword);
        break;
      default:
        break;
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
          <form
            onSubmit={handleSendOtp}
            className={`account-settings-form ${isClosing ? "closing" : ""}`}
          >
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
                <button
                  type="submit"
                  className={`account-settings-button account-settings-submit-button ${
                    isLoading ? "account-settings-button-loading" : ""
                  }`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="account-settings-loader"></span>
                  ) : null}
                  <span className="account-settings-button-text">
                    {isLoading ? "Sending OTP" : "Send OTP"}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={handleCloseEmailFields}
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
              <div className="otp-input-container">
                {otpValues.map((value, index) => (
                  <input
                    key={index}
                    ref={otpRefs[index]}
                    type="text"
                    inputMode="numeric"
                    pattern="\d*"
                    maxLength="1"
                    value={value}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="otp-input"
                  />
                ))}
              </div>
            </div>
            <button
              type="submit"
              className={`account-settings-button account-settings-submit-button ${
                isLoading ? "account-settings-button-loading" : ""
              }`}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="account-settings-loader"></span>
              ) : null}
              <span className="account-settings-button-text">
                {isLoading ? "Verifying OTP" : "Verify OTP"}
              </span>
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
            className={`account-settings-form ${isClosing ? "closing" : ""}`}
          >
            {hasPassword && (
              <div className="account-settings-form-group">
                <label
                  htmlFor="currentPassword"
                  className="account-settings-label"
                >
                  Current Password
                </label>
                <div className="account-settings-password-input-wrapper">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    id="currentPassword"
                    className="account-settings-input"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="account-settings-password-toggle"
                    onClick={() => togglePasswordVisibility("current")}
                  >
                    {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
            )}
            <div className="account-settings-form-group">
              <label htmlFor="newPassword" className="account-settings-label">
                New Password
              </label>
              <div className="account-settings-password-input-wrapper">
                <input
                  type={showNewPassword ? "text" : "password"}
                  id="newPassword"
                  className="account-settings-input"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="account-settings-password-toggle"
                  onClick={() => togglePasswordVisibility("new")}
                >
                  {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <div className="account-settings-form-group">
              <label
                htmlFor="confirmPassword"
                className="account-settings-label"
              >
                Confirm New Password
              </label>
              <div className="account-settings-password-input-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  className="account-settings-input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="account-settings-password-toggle"
                  onClick={() => togglePasswordVisibility("confirm")}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <div className="account-settings-button-group">
              <button
                type="submit"
                className={`account-settings-button account-settings-submit-button ${
                  isLoading ? "account-settings-button-loading" : ""
                }`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="account-settings-loader"></span>
                ) : null}
                <span className="account-settings-button-text">
                  {isLoading ? "Updating" : "Submit"}
                </span>
              </button>
              <button
                type="button"
                onClick={handleClosePasswordFields}
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
