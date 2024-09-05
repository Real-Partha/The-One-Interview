import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Signup.css";
import useNotification from "../Notifications";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    date_of_birth: "",
  });
  const { ErrorNotification, SuccessNotification } = useNotification();
  const [showPassword, setShowPassword] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const otpRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/auth/status`,
          { withCredentials: true }
        );
        if (response.data.isAuthenticated) {
          navigate("/");
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
      }
    };

    checkAuthStatus();
  }, [navigate]);

  const handleChange = (e) => {
    let value = e.target.value;
    if (e.target.name === "username") {
      value = value.replace(/\s/g, "").toLowerCase();
    }
    setFormData({ ...formData, [e.target.name]: value });
    if (e.target.name === "username") {
      setCheckingUsername(true);
      setUsernameAvailable(null);
    }
    if (e.target.name === "email") {
      setCheckingEmail(true);
      setEmailExists(false);
      if (value && !validateEmail(value)) {
        setEmailError("Please enter a valid email address");
      } else {
        setEmailError("");
      }
    }
    if (e.target.name === "password") {
      validatePassword(value);
    }

    if (e.target.name === "confirmPassword") {
      if (value !== formData.password) {
        setConfirmPasswordError("Passwords do not match");
      } else {
        setConfirmPasswordError("");
      }
    }
  };

  const validatePassword = (password) => {
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
    } else if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
      setPasswordError("Password must contain both letters and numbers");
    } else {
      setPasswordError("");
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  useEffect(() => {
    const checkUsernameAvailability = async () => {
      if (formData.username && formData.username.length > 2) {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/user/check-username/${
              formData.username
            }`
          );
          setUsernameAvailable(response.data.available);
        } catch (error) {
          console.error("Error checking username:", error);
          setUsernameAvailable(false);
        }
      } else {
        setUsernameAvailable(null);
      }
      setCheckingUsername(false);
    };

    const timeoutId = setTimeout(() => {
      checkUsernameAvailability();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [formData.username]);

  useEffect(() => {
    const checkEmailAvailability = async () => {
      if (validateEmail(formData.email)) {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/user/check-email/${formData.email}`
          );
          setEmailExists(response.data.exists);
        } catch (error) {
          console.error("Error checking email:", error);
          setEmailExists(false);
        }
      }
      setCheckingEmail(false);
    };

    const timeoutId = setTimeout(() => {
      checkEmailAvailability();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [formData.email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/signup`,
        formData,
        { withCredentials: true }
      );
      if (response.data.message === "OTP sent to your email for verification") {
        setOtpSent(true);
        SuccessNotification(response.data.message);
      }
    } catch (error) {
      console.error("Signup error:", error);
      ErrorNotification(error.response?.data?.message || "Error signing up");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    // Only allow numeric input
    if (/^\d*$/.test(value) && value.length <= 1) {
      const newOtpValues = [...otpValues];
      newOtpValues[index] = value;
      setOtpValues(newOtpValues);

      // Move to the next input if a digit is entered and it's not the last input
      if (value.length === 1 && index < 5) {
        otpRefs[index + 1].current.focus();
      }
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    const newOtpValues = [...otpValues];

    for (let i = 0; i < pastedData.length; i++) {
      if (/^\d$/.test(pastedData[i])) {
        newOtpValues[i] = pastedData[i];
      }
    }

    setOtpValues(newOtpValues);

    // Focus on the last non-empty input or the last input if all are filled
    const lastNonEmptyIndex = newOtpValues.reduce(
      (lastIndex, value, index) => (value !== "" ? index : lastIndex),
      5
    );
    otpRefs[lastNonEmptyIndex].current.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && index > 0 && otpValues[index] === "") {
      otpRefs[index - 1].current.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpString = otpValues.join("");
    setIsVerifying(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/verify-registration-otp`,
        { email: formData.email, otp: otpString },
        { withCredentials: true }
      );
      if (response.data.user) {
        SuccessNotification(response.data.message);
        window.location.href = "/";
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      ErrorNotification(error.response?.data?.message || "Error verifying OTP");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleGoogleClick = () => {
    window.open(`${import.meta.env.VITE_API_URL}/auth/google`, "_self");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const isFormValid = () => {
    return (
      formData.username &&
      formData.first_name &&
      formData.last_name &&
      formData.email &&
      validateEmail(formData.email) &&
      formData.password &&
      formData.confirmPassword &&
      formData.gender &&
      formData.date_of_birth &&
      usernameAvailable &&
      !emailExists &&
      !passwordError &&
      !emailError &&
      formData.password === formData.confirmPassword
    );
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <div className="signup-header">
          <i className="fas fa-user-plus"></i>
          <h2 className="signup-heading">Create Account</h2>
          <p className="signup-subheading">Join our community today!</p>
        </div>
        {!otpSent ? (
          <form onSubmit={handleSubmit}>
            <div className="signup-input-group">
              <label htmlFor="username">
                <i className="fas fa-user"></i> Username
              </label>
              <input
                id="username"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Choose a username"
                required
                className="signup-input"
              />
              {checkingUsername && (
                <span className="signup-username-checking">
                  <i className="fas fa-spinner fa-spin"></i> Checking...
                </span>
              )}
              {!checkingUsername && usernameAvailable !== null && (
                <span
                  className={`signup-username-availability ${
                    usernameAvailable ? "available" : "unavailable"
                  }`}
                >
                  {usernameAvailable ? (
                    <>
                      <i className="fas fa-check-circle"></i> Username is
                      available
                    </>
                  ) : (
                    <>
                      <i className="fas fa-times-circle"></i> Username is not
                      available
                    </>
                  )}
                </span>
              )}
            </div>
            <div className="signup-input-group">
              <label htmlFor="first_name">
                <i className="fas fa-user-edit"></i> First Name
              </label>
              <input
                id="first_name"
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="Enter your first name"
                required
                className="signup-input"
              />
            </div>
            <div className="signup-input-group">
              <label htmlFor="last_name">
                <i className="fas fa-user-edit"></i> Last Name
              </label>
              <input
                id="last_name"
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Enter your last name"
                required
                className="signup-input"
              />
            </div>
            <div className="signup-input-group">
              <label htmlFor="email">
                <i className="fas fa-envelope"></i> Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="signup-input"
              />
              {checkingEmail && !emailError && formData.email && (
                <span className="signup-email-checking">
                  <i className="fas fa-spinner fa-spin"></i> Checking...
                </span>
              )}
              {!checkingEmail && emailExists && (
                <span className="signup-email-error">
                  <i className="fas fa-exclamation-circle"></i> Account already
                  exists with this email
                </span>
              )}
              {emailError && (
                <span className="signup-email-error">
                  <i className="fas fa-exclamation-circle"></i> {emailError}
                </span>
              )}
            </div>
            <div className="signup-input-group signup-password-group">
              <label htmlFor="password">
                <i className="fas fa-lock"></i> Password
              </label>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                required
                className="signup-input"
              />
              <button
                type="button"
                className="signup-password-toggle"
                onClick={togglePasswordVisibility}
              >
                <i
                  className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
                ></i>
              </button>
            </div>
            {passwordError && (
              <span className="signup-password-error">
                <i className="fas fa-exclamation-circle"></i> {passwordError}
              </span>
            )}
            <div className="signup-input-group">
              <label htmlFor="confirmPassword">
                <i className="fas fa-lock"></i> Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
                className="signup-input"
              />
              {confirmPasswordError && (
                <span className="signup-confirm-password-error">
                  <i className="fas fa-exclamation-circle"></i>{" "}
                  {confirmPasswordError}
                </span>
              )}
            </div>
            <div className="signup-input-group">
              <label htmlFor="gender">
                <i className="fas fa-venus-mars"></i> Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="signup-input"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="signup-input-group">
              <label htmlFor="date_of_birth">
                <i className="fas fa-birthday-cake"></i> Date of Birth
              </label>
              <input
                id="date_of_birth"
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
                required
                className="signup-input"
              />
            </div>
            <button
              type="submit"
              className={`signup-submit-button ${
                isLoading ? "button-loading" : ""
              }`}
              disabled={!isFormValid() || isLoading}
              title={
                !isFormValid() ? "Please fill out all fields properly" : ""
              }
            >
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Verifying
                  registration...
                </>
              ) : (
                <>
                  <i className="fas fa-user-plus"></i> Sign Up
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="otp-verification">
            <h3>Enter OTP sent to your email</h3>
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
                  onPaste={handleOtpPaste}
                  className="otp-input"
                />
              ))}
            </div>
            <button
              onClick={handleVerifyOtp}
              className={`signup-submit-button ${
                isVerifying ? "button-loading" : ""
              }`}
              disabled={isVerifying || otpValues.some((digit) => digit === "")}
            >
              {isVerifying ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Verifying OTP...
                </>
              ) : (
                <>
                  <i className="fas fa-check-circle"></i> Verify OTP
                </>
              )}
            </button>
          </div>
        )}
        <div className="signup-divider">
          <span>or</span>
        </div>
        <button
          onClick={handleGoogleClick}
          disabled={isLoading}
          className="signup-google-button"
        >
          <i className="fab fa-google"></i> Sign up with Google
        </button>
        <p className="login-link">
          Already have an account? <Link to="/login">Log in here</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
