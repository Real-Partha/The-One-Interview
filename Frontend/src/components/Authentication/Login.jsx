import React, { useState,useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  const location = useLocation();
  const { ErrorNotification, SuccessNotification } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const requireTwoFactor = params.get("requireTwoFactor");
    const userId = params.get("userId");

    if (requireTwoFactor === "true" && userId) {
      setRequireTwoFactor(true);
      setUserId(userId);
    }
  }, [location]);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/auth/status`, { withCredentials: true });
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
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      if (response.data.requireTwoFactor) {
        setRequireTwoFactor(true);
        setUserId(response.data.userId);
      } else if (response.data.user) {
        SuccessNotification(response.data.message);
        navigate("/");
      }
    } catch (error) {
      ErrorNotification(error.response.data.message);
      console.error("Login error:", error);
    }
  };

  const handleTwoFactorSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/verify-2fa`,
        { userId, token: twoFactorToken },
        { withCredentials: true }
      );
      if (response.data.user) {
        SuccessNotification(response.data.message);
        navigate("/");
      }
    } catch (error) {
      ErrorNotification(error.response.data.message);
      console.error("2FA verification error:", error);
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
        <h2 className="login-heading">Login</h2>
        {!requireTwoFactor ? (
          <form onSubmit={handleSubmit}>
            <div className="login-input-group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="login-input"
              />
            </div>
            <div className="login-input-group login-password-group">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="login-input"
              />
              <button
                type="button"
                className="login-password-toggle"
                onClick={togglePasswordVisibility}
              >
                <i
                  className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
                ></i>
              </button>
            </div>
            <button type="submit" className="login-submit-button">
              Login
            </button>
          </form>
        ) : (
          <form onSubmit={handleTwoFactorSubmit}>
            <TwoFactorMessage />
            <div className="login-input-group">
              <input
                type="text"
                value={twoFactorToken}
                onChange={(e) => setTwoFactorToken(e.target.value)}
                onKeyPress={handleTwoFactorKeyPress}
                placeholder="Enter 2FA Code"
                required
                className="login-input"
              />
            </div>
            <button type="submit" className="login-submit-button">
              Verify 2FA
            </button>
          </form>
        )}
        {!requireTwoFactor && (
          <>
            <div className="login-divider">
              <span>or</span>
            </div>
            <button onClick={handleGoogleClick} className="login-google-button">
              <i className="fab fa-google"></i> Sign in with Google
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
