import React, { useState, useEffect } from "react";
import "./NavBar.css";
import { useTheme } from "../../ThemeContext";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  const [icon, setIcon] = useState(isDarkMode ? "☀️" : "🌙");

  useEffect(() => {
    const timer = setTimeout(() => {
      setIcon(isDarkMode ? "☀️" : "🌙");
    }, 1000);
    return () => clearTimeout(timer);
  }, [isDarkMode]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleToggleTheme = () => {
    setIcon(isDarkMode ? "🌙" : "☀️");
    toggleTheme();
  };

  const navigateToProfile = () => {
    navigate("/profile");
  };

  return (
    <div className={isDarkMode ? "dark-mode" : "light-mode"}>
      <nav className="navbar">
        <div className="navbar-left">
          <img
            style={{ width: "60px", height: "60px", margin: "-15px 10px" }}
            className="logo"
            src="/img/logo_final_transparent.png"
            alt="logo"
          />
          <span className="university-name">The One Interview</span>
        </div>
        <div className="navbar-center">
          <input
            type="text"
            placeholder="Type to search"
            className="search-input"
          />
          <button className="search-button">
            <i className="fas fa-search"></i>
          </button>
        </div>
        <div className="navbar-right">
          <button onClick={handleToggleTheme} className="theme-toggle">
            {icon}
          </button>
          <a href="/login" className="nav-link">
            Login
          </a>
          <a href="/signup" className="nav-link">
            Register
          </a>
          <i className="notifications fa fa-bell"></i>
          <i className="fas fa-user-circle profile" onClick={toggleSidebar}></i>
        </div>
      </nav>

      <div className={`profile-dropdown ${isSidebarOpen ? "open" : ""}`}>
        <div className="user-info">
          <img src="user-pic.png" alt="Profile Pic" className="user-pic" />
          <h4>Dedipya Goswami</h4>
          <p>AP21110010650</p>
          <p>+91-9832994010</p>
          <p>Logged in via Google </p>
        </div>
        <div className="profile-settings">
          <a onClick={navigateToProfile}>
            <i className="fas fa-user-cog"></i>Account Settings
          </a>
          <a href="#">
            <i className="fas fa-shield-alt"></i>Privacy Settings
          </a>
          <a href="#">
            <i className="fas fa-key"></i>Change Password
          </a>
          <a href="#">
            <i className="fas fa-sign-out-alt"></i>Logout
          </a>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
