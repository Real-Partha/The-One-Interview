import React, { useState, useEffect, useContext } from "react";
import "./Navbar.css";
import { useTheme } from "../../ThemeContext";
import { useNavigate, Link } from "react-router-dom";
import { SearchContext } from "../context/SearchContext";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Sidebar from "../Left Sidebar/Sidebar";

const NavBar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  const [icon, setIcon] = useState(isDarkMode ? "☀️" : "🌙");
  const { setSearchQuery } = useContext(SearchContext);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("profile");
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

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

  const getCurrentPage = () => {
    if (location.pathname.startsWith("/profile")) {
      return "profile";
    }
    return "homepage";
  };

  const handleSetActiveSection = (section) => {
    setActiveSection(section);
    if (section === "account") {
      navigate("/profile?tab=account");
    } else {
      navigate(`/profile?tab=${section}`);
    }
    setIsMobileMenuOpen(false);
  };

  const handleMobileMenuItemClick = (to) => {
    navigate(to);
    setIsMobileMenuOpen(false);
  };

  const shouldShowSearchBar = () => {
    const { pathname } = location;
    return !(
      pathname === "/login-register" ||
      // pathname === '/signup' ||
      pathname === "/profile"
    );
  };

  const handleLogout = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_API_URL}/auth/logout`, {
        withCredentials: true,
      });
      setIsAuthenticated(false);
      setUser(null);
      setIsSidebarOpen(false);
      window.location.href = "/";
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isSidebarOpen &&
        !event.target.closest(".profile-dropdown") &&
        !event.target.closest(".profile")
      ) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isSidebarOpen]);

  const toggleMobileSearch = () => {
    setIsMobileSearchOpen(!isMobileSearchOpen);
  };

  const handleMobileSearch = (e) => {
    if (e.key === "Enter") {
      const searchQuery = e.target.value;
      setSearchQuery(searchQuery);
      e.target.value = "";
      setIsMobileSearchOpen(false);
      e.target.blur();
      navigate("/questions", { state: { searchQuery } });
    }
  };

  const handleSearchChange = (e) => {
    if (e.key === "Enter") {
      const searchQuery = e.target.value;
      setSearchQuery(searchQuery);
      e.target.value = "";
      if (location.pathname.startsWith("/question/")) {
        navigate("/questions", { state: { searchQuery, fromPost: true } });
      } else {
        navigate("/questions", { state: { searchQuery } });
      }
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

  const navigateToAccount = () => {
    setIsSidebarOpen(false);
    navigate("/profile?tab=account");
  };

  const navigateToPrivacy = () => {
    setIsSidebarOpen(false);
    navigate("/privacy");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className={isDarkMode ? "dark-mode" : "light-mode"}>
      <nav className="navbar">
        <div className="navbar-left">
          <button className="hamburger-menu" onClick={toggleMobileMenu}>
            <i className="fas fa-bars"></i>
          </button>
          <button className="search-icon-mobile" onClick={toggleMobileSearch}>
            <i className="fas fa-search"></i>
          </button>
        </div>
        <Link to="/" className="navbar-homepage-link">
          <div className="navbar-left">
            <img
              style={{ width: "70px", height: "70px", margin: "-15px 10px" }}
              className="logo"
              src="logo1.png"
              alt="logo"
            />
            <span className="university-name">The One Interview</span>
          </div>
        </Link>
        {shouldShowSearchBar() && (
          <div className="navbar-center desktop-only">
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
        )}
        <div className="navbar-right">
          <button onClick={handleToggleTheme} className="theme-toggle">
            {icon}
          </button>
          {isAuthenticated ? (
            <>
              {/* <i className="notifications fa fa-bell"></i> */}
              <i
                className="fas fa-user-circle profile"
                onClick={toggleSidebar}
              ></i>
            </>
          ) : (
            <>
              {/* <a href="/login-register" className="nav-link">
                Login/Register
              </a> */}
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
      <div className={`mobile-search-bar ${isMobileSearchOpen ? "open" : ""}`}>
        <input
          type="text"
          placeholder="Type to search"
          className="mobile-search-input"
          onKeyDown={handleMobileSearch}
        />
      </div>

      <div className={`mobile-menu ${isMobileMenuOpen ? "open" : ""}`}>
        <div className="mobile-menu-header">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
            <img
              className="mobile-logo"
              src="logo1.png"
              alt="logo"
            />
            <span className="mobile-site-name">The One Interview</span>
          </Link>
          <button className="close-menu" onClick={toggleMobileMenu}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <Sidebar
          page={getCurrentPage()}
          isMobile={true}
          activeSection={activeSection}
          handleSetActiveSection={handleSetActiveSection}
          handleMobileMenuItemClick={handleMobileMenuItemClick}
        />
      </div>

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
                : "Logged in using One ID"}
            </p>
          </div>
        )}
        <div className="profile-settings">
          <a onClick={navigateToProfile} className="navbar-account-settings">
            <i className="fas fa-user-cog"></i>Your Space
          </a>
          <a onClick={navigateToPrivacy} className="navbar-account-settings">
            <i className="fas fa-shield-alt"></i>Privacy Policy
          </a>
          <a onClick={navigateToAccount} className="navbar-account-settings">
            <i className="fas fa-key"></i>Change Password
          </a>
          <a className="logout-profile" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i>Logout
          </a>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
