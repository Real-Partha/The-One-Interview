import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Signup.css";
import useNotification from '../Notifications';

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
  const { ErrorNotification ,SuccessNotification} = useNotification();
  const [showPassword, setShowPassword] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const navigate = useNavigate();

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
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/signup`,
        formData,
        { withCredentials: true }
      );
      if (response.data.user) {
        SuccessNotification(response.data.message);
        navigate("/");
      }
    } catch (error) {
      console.error("Signup error:", error);
      ErrorNotification(error.response?.data?.message || "Error signing up");
      // alert(error.response?.data?.message || "Error signing up");
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
        <h2 className="signup-heading">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="signup-input-group">
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              required
              className="signup-input"
            />
            {checkingUsername && (
              <span className="signup-username-checking">Checking...</span>
            )}
            {!checkingUsername && usernameAvailable !== null && (
              <span
                className={`signup-username-availability ${
                  usernameAvailable ? "available" : "unavailable"
                }`}
              >
                {usernameAvailable
                  ? "✓ Username is available"
                  : "✗ Username is not available"}
              </span>
            )}
          </div>
          <div className="signup-input-group">
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              placeholder="First Name"
              required
              className="signup-input"
            />
          </div>
          <div className="signup-input-group">
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              placeholder="Last Name"
              required
              className="signup-input"
            />
          </div>
          <div className="signup-input-group">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="signup-input"
            />
            {checkingEmail && !emailError && formData.email && (
              <span className="signup-email-checking">Checking...</span>
            )}
            {!checkingEmail && emailExists && (
              <span className="signup-email-error">
                ✗ Account already exists with this email
              </span>
            )}
            {emailError && (
              <span className="signup-email-error">{emailError}</span>
            )}
          </div>
          <div className="signup-input-group signup-password-group">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
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
            <span className="signup-password-error">{passwordError}</span>
          )}
          <div className="signup-input-group">
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              required
              className="signup-input"
            />
            {confirmPasswordError && (
              <span className="signup-confirm-password-error">
                {confirmPasswordError}
              </span>
            )}
          </div>
          <div className="signup-input-group">
            <select
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
            <input
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
            className="signup-submit-button"
            disabled={!isFormValid()}
            title={!isFormValid() ? "Please fill out all fields properly" : ""}
          >
            Sign Up
          </button>
        </form>
        <div className="signup-divider">
          <span>or</span>
        </div>
        <button onClick={handleGoogleClick} className="signup-google-button">
          <i className="fab fa-google"></i> Sign up with Google
        </button>
      </div>
    </div>
  );
};

export default Signup;
