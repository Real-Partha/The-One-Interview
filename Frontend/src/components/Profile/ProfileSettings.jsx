import React, { useState, useCallback } from "react";
import axios from "axios";
import { debounce } from "lodash";

const ProfileSettings = ({ user, fetchUserData, setRefreshActivityTrigger }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  const [selectedFile, setSelectedFile] = useState(null);
  const [usernameAvailable, setUsernameAvailable] = useState(true);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [validUsername, setValidUsername] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

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
      fetchUserData();
      setIsEditing(false);
      setSelectedFile(null);
      setRefreshActivityTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePicture = async () => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/account/delete-profile-picture`,
        {},
        { withCredentials: true }
      );
      fetchUserData();
    } catch (error) {
      console.error("Error deleting profile picture:", error);
    }
  };

  return (
    <div className="profile-card">
      <div className="profile-header">
        <div className="profile-card-title">Profile Settings</div>
        {!isEditing && (
          <button
            className="profile-edit-button"
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </button>
        )}
      </div>
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
              <button className="profile-button" onClick={handleDeletePicture}>
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
              <span className="unavailable">Username is not available</span>
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
              ? new Date(user.date_of_birth).toISOString().split("T")[0]
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
      <div className="profile-footer-message">
        **for sensitive account changes, visit the Account Section.
      </div>
    </div>
  );
};

export default ProfileSettings;
