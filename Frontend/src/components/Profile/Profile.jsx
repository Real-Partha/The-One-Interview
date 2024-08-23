import React, { useState, useCallback } from 'react';
import { debounce } from 'lodash';
import './Profile.css';
import { useTheme } from "../../ThemeContext";
import NavBar from '../Navbar/Navbar';

const Profile = () => {
  const { isDarkMode } = useTheme();
  const [profileName, setProfileName] = useState('Dedipya Goswami');
  const [username, setUsername] = useState('dedipya001');
  const [status, setStatus] = useState('On duty');
  const [aboutMe, setAboutMe] = useState('Discuss only on work hour, unless you wanna discuss about music 🤘');
  
  const debouncedSave = useCallback(
    debounce((newValue, field) => {
      console.log(`Saving ${field}:`, newValue);
      // Here you would typically send an API request to save the changes
    }, 500),
    []
  );

  const handleInputChange = (e, field) => {
    const { value } = e.target;
    switch (field) {
      case 'profileName':
        setProfileName(value);
        break;
      case 'status':
        setStatus(value);
        break;
      case 'aboutMe':
        setAboutMe(value);
        break;
      default:
        break;
    }
    debouncedSave(value, field);
  };

  return (
    <div className={`profile-page ${isDarkMode ? "dark-mode" : "light-mode"}`}>
      <NavBar />
      <div className="profile-main-content">
        <aside className="profile-sidebar">
          <nav className="profile-navigation">
            <div className="profile-sidebar-card">
              <i className="fa fa-user" />
              <div className="profile-card-details">
                <h4>Profile</h4>
              </div>
            </div>
            <div className="profile-sidebar-card">
              <i className="fa fa-cog" />
              <div className="profile-card-details">
                <h4>Account</h4>
              </div>
            </div>
            <div className="profile-sidebar-card">
              <i className="fa fa-bookmark" />
              <div className="profile-card-details">
                <h4>Bookmarks</h4>
              </div>
            </div>
            <div className="profile-sidebar-card">
              <i className="fa fa-paint-brush" />
              <div className="profile-card-details">
                <h4>Appearance</h4>
              </div>
            </div>
            <div className="profile-sidebar-card">
              <i className="fa fa-bell" />
              <div className="profile-card-details">
                <h4>Notifications</h4>
              </div>
            </div>
          </nav>
        </aside>
        
        <section className="profile-content">
          <div className="profile-card">
            <h2 className="profile-card-title">Profile Settings</h2>
            <div className="profile-picture-section">
              <img src="profile-pic.jpg" alt="Profile" className="profile-picture" />
              <button className="profile-button">Change picture</button>
              <button className="profile-button">Delete picture</button>
            </div>
            <div className="profile-info">
              <label>Profile name</label>
              <input 
                type="text" 
                value={profileName} 
                onChange={(e) => handleInputChange(e, 'profileName')} 
                className="profile-input"
              />
              <label>Username</label>
              <input 
                type="text" 
                value={username} 
                disabled
                className="profile-input"
              />
             
              <label>Status recently</label>
              <input 
                type="text" 
                value={status} 
                onChange={(e) => handleInputChange(e, 'status')} 
                className="profile-input"
              />
              <label>About me</label>
              <textarea 
                value={aboutMe} 
                onChange={(e) => handleInputChange(e, 'aboutMe')}
                className="profile-textarea"
              ></textarea>
            </div>
            <div className="profile-footer">
              <button className="profile-save-button">Save changes</button>
            </div>
          </div>
        </section>
        
        <aside className="profile-right-sidebar">
          <div className="profile-right-sidebar-card">
            <img src="activity.png" alt="Recent Activity" />
            <div className="profile-card-details">
              <h4>Recent Activity</h4>
              <p>View your recent actions</p>
            </div>
          </div>
          <div className="profile-right-sidebar-card">
            <img src="stats.png" alt="Profile Stats" />
            <div className="profile-card-details">
              <h4>Profile Stats</h4>
              <p>See your profile statistics</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Profile;
