import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';
import useNotification from '../Notifications';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { ErrorNotification ,SuccessNotification} = useNotification();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, { email, password }, { withCredentials: true });
      if (response.data.user) {
        SuccessNotification(response.data.message);
        navigate('/');
      }
    } catch (error) {
      ErrorNotification(error.response.data.message);
      console.error('Login error:', error);
    }
  };

  const handleGoogleClick = () => {
    window.open(`${import.meta.env.VITE_API_URL}/auth/google`, "_self");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-heading">Login</h2>
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
              <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
            </button>
          </div>
          <button type="submit" className="login-submit-button">Login</button>
        </form>
        <div className="login-divider">
          <span>or</span>
        </div>
        <button onClick={handleGoogleClick} className="login-google-button">
          <i className="fab fa-google"></i> Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
