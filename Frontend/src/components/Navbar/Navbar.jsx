import React, { useState, useEffect, useContext } from "react";
import "./NavBar.css";
import { useTheme } from "../../ThemeContext";
import { useNavigate } from "react-router-dom";
import { SearchContext } from "../context/SearchContext";
import axios from "axios";

const NavBar = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  const [icon, setIcon] = useState(isDarkMode ? "☀️" : "🌙");
  const { setSearchQuery } = useContext(SearchContext);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/auth/status`,
        { withCredentials: true }
      );
      setIsAuthenticated(response.data.isAuthenticated);
      setUser(response.data.user);
    } catch (error) {
      console.error("Error checking auth status:", error);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isSidebarOpen && !event.target.closest('.profile-dropdown') && !event.target.closest('.profile')) {
        setIsSidebarOpen(false);
      }
    };
  
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isSidebarOpen]);

  const handleSearchChange = (e) => {
    if (e.key === "Enter") {
      setSearchQuery(e.target.value);
      e.target.value = "";
    }
  };

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
    setIsSidebarOpen(false);
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
            onKeyDown={handleSearchChange}
          />
          <button className="search-button">
            <i className="fas fa-search"></i>
          </button>
        </div>
        <div className="navbar-right">
          <button onClick={handleToggleTheme} className="theme-toggle">
            {icon}
          </button>
          {isAuthenticated ? (
            <>
              <i className="notifications fa fa-bell"></i>
              <i
                className="fas fa-user-circle profile"
                onClick={toggleSidebar}
              ></i>
            </>
          ) : (
            <>
              <a href="/login" className="nav-link">
                Login
              </a>
              <a href="/signup" className="nav-link">
                Register
              </a>
            </>
          )}
        </div>
      </nav>

      <div className={`profile-dropdown ${isSidebarOpen ? "open" : ""}`}>
        {user && (
          <div className="user-info">
            <img
              src={user.profile_pic || "/img/default-profile.png"}
              alt="Profile Picture"
              className="user-pic"
            />
            <h3 className="user-name">{`${user.first_name} ${user.last_name}`}</h3>
            <p className="user-username">@{user.username}</p>
            <p className="user-email">{user.email}</p>
            <p
              className={`user-login-type ${
                user.type === "google" ? "google" : "oneid"
              }`}
            >
              {user.type === "google"
                ? "Logged in using Google"
                : "Logged in using The One ID"}
            </p>
          </div>
        )}
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
