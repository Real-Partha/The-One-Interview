import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Profile.css";
import { useTheme } from "../../ThemeContext";
import NavBar from "../Navbar/Navbar";
import axios from "axios";
import UserActivity from "./UserActivity";
import AccountSettings from "./AccountSettings";
import LoginSignupPopup from "../commonPages/LoginSignupPopup";
import MainLoader from "../commonPages/MainLoader";
import ProfileSettings from "./ProfileSettings";

const Profile = () => {
  const { isDarkMode } = useTheme();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [refreshActivityTrigger, setRefreshActivityTrigger] = useState(0);
  const [activeSection, setActiveSection] = useState("profile");
  const [isMainLoading, setIsMainLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  const fetchUserData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/auth/status`,
        { withCredentials: true }
      );
      if (response.data.isAuthenticated) {
        setUser(response.data.user);
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError("Error fetching user data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");

    const firstLoading = async () => {
      if (!tab) {
        setIsMainLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 3000));
        setIsMainLoading(false);
      } else {
        setIsMainLoading(false);
      }
    };

    fetchUserData();
    firstLoading();

    if (tab && ["profile", "account", "activity"].includes(tab)) {
      setActiveSection(tab);
    } else {
      setActiveSection("profile");
    }
  }, [location]);

  const handleSetActiveSection = (section) => {
    setActiveSection(section);
    navigate(`?tab=${section}`);
  };

  if (isMainLoading) {
    return (
      <div>
        <MainLoader />
      </div>
    );
  }

  if (!user) {
    return (
      <div>
        <LoginSignupPopup />
      </div>
    );
  }

  return (
    <div className={`profile-page ${isDarkMode ? "dark-mode" : "light-mode"}`}>
      <NavBar />
      <div className="profile-main-content">
        <aside className="profile-sidebar">
          <nav className="profile-navigation">
            <div
              className={`profile-sidebar-card ${
                activeSection === "profile" ? "active" : ""
              }`}
              onClick={() => handleSetActiveSection("profile")}
            >
              <i className="fa fa-user" />
              <div className="profile-card-details">
                <div className="profile-sidebar-menu-title">Profile</div>
              </div>
            </div>
            <div
              className={`profile-sidebar-card ${
                activeSection === "account" ? "active" : ""
              }`}
              onClick={() => handleSetActiveSection("account")}
            >
              <i className="fa fa-cog" />
              <div className="profile-card-details">
                <div className="profile-sidebar-menu-title">Account</div>
              </div>
            </div>
            <div
              className={`profile-sidebar-card ${
                activeSection === "activity" ? "active" : ""
              }`}
              onClick={() => handleSetActiveSection("activity")}
            >
              <i className="fa fa-clock" />
              <div className="profile-card-details">
                <div className="profile-sidebar-menu-title">
                  Recent Activity
                </div>
              </div>
            </div>
            <div className="profile-sidebar-card">
              <i className="fa fa-paint-brush" />
              <div className="profile-card-details">
                <div className="profile-sidebar-menu-title">Appearance</div>
              </div>
            </div>
            <div className="profile-sidebar-card">
              <i className="fa fa-bell" />
              <div className="profile-card-details">
                <div className="profile-sidebar-menu-title">Notifications</div>
              </div>
            </div>
          </nav>
        </aside>

        <section className="profile-content">
          {activeSection === "profile" && (
            <ProfileSettings
              user={user}
              fetchUserData={fetchUserData}
              setRefreshActivityTrigger={setRefreshActivityTrigger}
            />
          )}
          {activeSection === "account" && (
            <AccountSettings user={user} fetchUserData={fetchUserData} />
          )}
          {activeSection === "activity" && (
            <div className="profile-main-userActivity">
              <UserActivity refreshTrigger={refreshActivityTrigger} />
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Profile;
