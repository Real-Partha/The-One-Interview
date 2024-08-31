import React, { useState, useCallback, useEffect } from "react";
import "./Profile.css";
import { useTheme } from "../../ThemeContext";
import NavBar from "../Navbar/Navbar";
import axios from "axios";
import { debounce } from "lodash";
import UserActivity from "./UserActivity";
import AccountSettings from "./AccountSettings";
import LoginSignupPopup from "../commonPages/LoginSignupPopup";

const Profile = () => {
  const { isDarkMode } = useTheme();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [usernameAvailable, setUsernameAvailable] = useState(true);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [validUsername, setValidUsername] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [refreshActivityTrigger, setRefreshActivityTrigger] = useState(0);
  const [activeSection, setActiveSection] = useState("profile");

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
    fetchUserData();
  }, []);

  const checkUsernameAvailability = useCallback(
    debounce(async (username) => {
      if (!username || username.length < 5) {
        setUsernameAvailable(false);
        setCheckingUsername(false);
        setValidUsername(false);
        return;
      }

      if (username === user.username) {
        setUsernameAvailable(true);
        setCheckingUsername(false);
        setValidUsername(true);
        return;
      }
      try {
        setValidUsername(true);
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/user/check-username/${username}`
        );
        setUsernameAvailable(response.data.available);
      } catch (error) {
        console.error("Error checking username:", error);
        setUsernameAvailable(false);
      }
      setCheckingUsername(false);
    }, 1000),
    [user]
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prevUser) => ({ ...prevUser, [name]: value }));
    if (name === "username") {
      setCheckingUsername(true);
      checkUsernameAvailability(value);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      const formData = new FormData();
      Object.keys(editedUser).forEach((key) => {
        if (editedUser[key] !== user[key]) {
          formData.append(key, editedUser[key]);
        }
      });
      if (selectedFile) {
        formData.append("profile_pic", selectedFile);
      }

      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/account/update-profile`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setUser(response.data.user);
      setIsEditing(false);
      setSelectedFile(null);
      fetchUserData();
      setRefreshActivityTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Error updating profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePicture = async () => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/account/delete-profile-picture`,
        {},
        { withCredentials: true }
      );
      setUser(response.data.user);
      setEditedUser(response.data.user);
      fetchUserData();
    } catch (error) {
      console.error("Error deleting profile picture:", error);
      setError("Error deleting profile picture");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!user) return <div><LoginSignupPopup /></div>;

  return (
    <div className={`profile-page ${isDarkMode ? "dark-mode" : "light-mode"}`}>
      <NavBar />
      <div className="profile-main-content">
        <aside className="profile-sidebar">
          <nav className="profile-navigation">
            <div
              className={`profile-sidebar-card ${activeSection === "profile" ? "active" : ""
                }`}
              onClick={() => setActiveSection("profile")}
            >
              <i className="fa fa-user" />
              <div className="profile-card-details">
                <div className="profile-sidebar-menu-title">Profile</div>
              </div>
            </div>
            <div
              className={`profile-sidebar-card ${activeSection === "account" ? "active" : ""
                }`}
              onClick={() => setActiveSection("account")}
            >
              <i className="fa fa-cog" />
              <div className="profile-card-details">
                <div className="profile-sidebar-menu-title">Account</div>
              </div>
            </div>
            <div
              className={`profile-sidebar-card ${activeSection === "activity" ? "active" : ""
                }`}
              onClick={() => setActiveSection("activity")}
            >
              <i className="fa fa-clock" />
              <div className="profile-card-details">
                <div className="profile-sidebar-menu-title">Recent Activity</div>
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
                          className={`profile-upper-login-type ${user.type === "google" ? "google" : "oneid"
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

              <div className="profile-card">
                <div className="profile-card-title">Profile Settings</div>
                <div className="profile-picture-section">
                  <div className="profile-picture-container">
                    <img
                      src={user.profile_pic || "/img/default-profile.png"}
                      alt="Profile"
                      className="profile-picture"
                    />
                    {isEditing && (
                      <div className="profile-picture-buttons">
                        <input
                          type="file"
                          onChange={handleFileChange}
                          style={{ display: "none" }}
                          id="fileInput"
                          accept="image/*"
                        />
                        <label htmlFor="fileInput" className="profile-button">
                          Change picture
                        </label>
                        <button
                          className="profile-button"
                          onClick={handleDeletePicture}
                        >
                          Delete picture
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="profile-info">
                  <label>First Name</label>
                  <input
                    type="text"
                    name="first_name"
                    value={isEditing ? editedUser.first_name : user.first_name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="profile-input"
                  />
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="last_name"
                    value={isEditing ? editedUser.last_name : user.last_name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="profile-input"
                  />
                  <label>Username</label>
                  <input
                    type="text"
                    name="username"
                    value={isEditing ? editedUser.username : user.username}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="profile-input"
                  />
                  {isEditing && (
                    <div className="username-availability">
                      {checkingUsername ? (
                        <span>Checking username...</span>
                      ) : usernameAvailable ? (
                        <span className="available">Username is available</span>
                      ) : validUsername ? (
                        <span className="unavailable">
                          Username is not available
                        </span>
                      ) : (
                        <span className="unavailable">
                          Username should be at least 5 characters
                        </span>
                      )}
                    </div>
                  )}
                  <label>Email</label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="profile-input"
                  />
                  <label>Gender</label>
                  <select
                    name="gender"
                    value={isEditing ? editedUser.gender : user.gender}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="profile-input profile-select"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  <label>Date of Birth</label>
                  <input
                    type="date"
                    name="date_of_birth"
                    value={
                      isEditing
                        ? editedUser.date_of_birth
                        : user.date_of_birth
                          ? new Date(user.date_of_birth)
                            .toISOString()
                            .split("T")[0]
                          : ""
                    }
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="profile-input"
                  />
                </div>
                <div className="profile-footer">
                  {isEditing && (
                    <>
                      <button
                        className="profile-save-button"
                        onClick={handleSaveChanges}
                        disabled={!usernameAvailable || isSaving}
                      >
                        Save changes
                      </button>
                      <button
                        className="profile-cancel-button"
                        onClick={() => setIsEditing(false)}
                        disabled={isSaving}
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
                {isSaving && <div className="profile-saving-bar"></div>}
                {!isEditing && (
                  <button
                    className="profile-edit-button"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </button>
                )}
                <div className="profile-footer-message">
                  **for sensitive account changes, visit the Account Section.
                </div>
              </div>
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
