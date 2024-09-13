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
import Sidebar from "../Left Sidebar/Sidebar";
import UserQuestions from "./UserQuestions";
import SavedQuestions from "./SavedQuestions";

import { Helmet } from "react-helmet";

const Profile = () => {
  const { isDarkMode } = useTheme();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [refreshActivityTrigger, setRefreshActivityTrigger] = useState(0);
  const [activeSection, setActiveSection] = useState("profile");
  const [isMainLoading, setIsMainLoading] = useState(true);
  const [loading, setLoading] = useState(true);

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
        console.log(response.data.user);
        
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

    if (tab && ["profile", "account", "activity","yourquestions","savedquestions","Back to Questions"].includes(tab)) {
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


  const pageTitle = user ? `${user.first_name}'s Profile | The One Interview` : 'User Profile | The One Interview';
  const pageDescription = user
    ? `View ${user.name}'s profile on The One Interview. Username: ${user.username}. Explore their Posts, Questions, and more.`
    : 'View user profile on The One Interview. Explore their Posts, Questions, and more.';   
    
    return (
    <div className={`profile-page ${isDarkMode ? "dark-mode" : "light-mode"}`}>

<Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="profile" />
        <meta property="og:url" content={`https://the-one-interview.vercel.app/${location.pathname}`} />  {/* Change this when the profile page for each user will be made */}
        {user && user.profile_pic && <meta property="og:image" content={user.profile_pic} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        {user && user.profile_pic && <meta name="twitter:image" content={user.profile_pic} />}
        <link rel="canonical" href={`https://the-one-interview.vercel.app/${location.pathname}`} />  {/* Change this when the profile page for each user will be made */}
      </Helmet>
      <NavBar />
      <div className="profile-main-content">
        <Sidebar
          page="profile"
          activeSection={activeSection}
          handleSetActiveSection={handleSetActiveSection}
        />

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
          {activeSection === "yourquestions" && <UserQuestions />}
          {activeSection === "savedquestions" && <SavedQuestions />}
          {activeSection === "Back to Questions" && navigate("/questions")}
        </section>
      </div>
    </div>
  );
};

export default Profile;
