import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import axios from "axios";
import "./Login.css";
import useNotification from "../Notifications";

const TwoFactorMessage = () => (
  <div className="two-factor-message">
    <div className="two-factor-icon">
      <i className="fas fa-shield-alt"></i>
    </div>
    <h3>2FA Protected</h3>
    <p>Your account is secured with Two-Factor Authentication.</p>
    <p>Please open your Authenticator app and enter the 2FA token below.</p>
  </div>
);

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactorToken, setTwoFactorToken] = useState("");
  const [requireTwoFactor, setRequireTwoFactor] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const twoFactorTokenRef = useRef(null);
  const { ErrorNotification, SuccessNotification } = useNotification();
  const [tempToken, setTempToken] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tempTokenParam = queryParams.get("tempToken");
    const require2FAParam = queryParams.get("require2FA");

    if (tempTokenParam && require2FAParam === "true") {
      setRequireTwoFactor(true);
      setTempToken(tempTokenParam);
    } else {
      const checkAuthStatus = async () => {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/auth/status`,
            { withCredentials: true }
          );
          if (response.data.requireTwoFactor) {
            setRequireTwoFactor(true);
            setUserId(response.data.userId);
          } else if (response.data.isAuthenticated) {
            navigate("/");
          }
        } catch (error) {
          console.error("Error checking auth status:", error);
        }
      };

      checkAuthStatus();
    }
  }, [navigate, location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      console.log("Login response:", response.data);
      if (response.data.requireTwoFactor) {
        setRequireTwoFactor(true);
        setTempToken(response.data.tempToken);
      } else if (response.data.user) {
        SuccessNotification(response.data.message);
        navigate("/");
      }
    } catch (error) {
      ErrorNotification(error.response.data.message);
      console.error("Login error:", error);
    } finally {
      setIsSubmitting(false);
      emailRef.current.blur();
      passwordRef.current.blur();
    }
  };

  const handleTwoFactorSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/verify-2fa`,
        { tempToken, token: twoFactorToken },
        { withCredentials: true }
      );
      if (response.data.user) {
        SuccessNotification(response.data.message);
        navigate("/");
      }
    } catch (error) {
      ErrorNotification(error.response.data.message);
      console.error("2FA verification error:", error);
    } finally {
      setIsSubmitting(false);
      twoFactorTokenRef.current.blur();
    }
  };

  const handleGoogleClick = () => {
    window.open(`${import.meta.env.VITE_API_URL}/auth/google`, "_self");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleTwoFactorKeyPress = (e) => {
    if (e.key === "Enter") {
      handleTwoFactorSubmit(e);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <i className="fas fa-user-circle"></i>
          <h2 className="login-heading">Welcome Back</h2>
          <p className="login-subheading">Let's get you logged in!</p>
        </div>
        {!requireTwoFactor ? (
          <form onSubmit={handleSubmit}>
            <div className="input-group">
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
                ref={emailRef}
                disabled={isSubmitting}
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">
                <i className="fas fa-lock"></i> Password
              </label>
              <div className="password-input">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  ref={passwordRef}
                  disabled={isSubmitting}
                />
                <div className="forgot-password-link">
                  <Link to="/forgot-password">Forgot Password?</Link>
                </div>
                <button
                  type="button"
                  className="password-toggle"
                  onClick={togglePasswordVisibility}
                  disabled={isSubmitting}
                >
                  <i
                    className={`fas ${
                      showPassword ? "fa-eye-slash" : "fa-eye"
                    }`}
                  ></i>
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting}
            >
              <i className="fas fa-sign-in-alt"></i>
              {isSubmitting ? "Logging you in..." : "Log In"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleTwoFactorSubmit}>
            <TwoFactorMessage />
            <div className="input-group">
              <label htmlFor="twoFactorToken">
                <i className="fas fa-key"></i> 2FA Code
              </label>
              <input
                id="twoFactorToken"
                type="text"
                value={twoFactorToken}
                onChange={(e) => setTwoFactorToken(e.target.value)}
                onKeyPress={handleTwoFactorKeyPress}
                placeholder="Enter 2FA Code"
                required
                ref={twoFactorTokenRef}
                disabled={isSubmitting}
              />
            </div>
            <button type="submit" className="submit-button">
              <i className="fas fa-check-circle"></i>
              {isSubmitting ? "Verifying..." : "Verify 2FA"}
            </button>
          </form>
        )}
        {!requireTwoFactor && (
          <>
            <div className="divider">
              <span>or</span>
            </div>
            <button
              onClick={handleGoogleClick}
              className="google-button"
              disabled={isSubmitting}
            >
              <i className="fab fa-google"></i> Sign in with Google
            </button>
            <p className="signup-link">
              Don't have an account? <Link to="/signup">Register here</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
