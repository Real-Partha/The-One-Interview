import React, { useState, useEffect } from "react";
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshActivityTrigger, setRefreshActivityTrigger] = useState(0);
  const [activeSection, setActiveSection] = useState("profile");
  const [isMainLoading, setIsMainLoading] = useState(true);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/auth/status`,
        { withCredentials: true }
      );
      if (response.data.isAuthenticated) {
        setUser(response.data.user);
        setEditedUser(response.data.user);
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError("Error fetching user data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const firstLoading = async () => {
      setIsMainLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setIsMainLoading(false);
    };
    fetchUserData();
    firstLoading();
  }, []);

  if (isMainLoading)
    return (
      <div>
        <MainLoader />
      </div>
    );

  if (!user)
    return (
      <div>
        <LoginSignupPopup />
      </div>
    );

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
              onClick={() => setActiveSection("profile")}
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
              onClick={() => setActiveSection("account")}
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
              onClick={() => setActiveSection("activity")}
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
          {/* Upper Profile Card */}
          {activeSection === "profile" && (
            <>
              <div className="profile-upper-card-container">
                <div className="profile-upper-card">
                  <h2 className="profile-upper-card-title">Profile Card</h2>
                  <div className="profile-upper-card-content">
                    <div className="profile-upper-picture-section">
                      <img
                        src={user.profile_pic || "/img/default-profile.png"}
                        alt="Profile"
                        className="profile-upper-picture"
                      />
                      <div className="profile-upper-info-section">
                        <div className="profile-upper-email">{user.email}</div>
                        <span
                          className={`profile-upper-login-type ${
                            user.type === "google" ? "google" : "oneid"
                          }`}
                        >
                          {user.type === "google"
                            ? "Google ID Account"
                            : "One ID Account"}
                        </span>
                      </div>
                    </div>
                    <h3 className="profile-upper-full-name">{`${user.first_name} ${user.last_name}`}</h3>
                    <p className="profile-upper-username">@{user.username}</p>
                    <div className="profile-upper-details">
                      <div className="profile-upper-gender">
                        <div>Gender: {user.gender || "Not specified"} </div>
                      </div>
                      <div>
                        <div className="profile-upper-dob">
                          DOB:{" "}
                          {user.date_of_birth
                            ? new Date(user.date_of_birth).toLocaleDateString()
                            : "Not specified"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <ProfileSettings user={user} fetchUserData={fetchUserData} setRefreshActivityTrigger={setRefreshActivityTrigger} />
            </>
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
