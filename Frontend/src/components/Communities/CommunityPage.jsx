// CommunityPage.jsx

import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../../ThemeContext";
import axios from "axios";
import { Helmet } from "react-helmet";
import Sidebar from "../Left Sidebar/Sidebar";
import NavBar from "../Navbar/Navbar";
import MainLoader from "../commonPages/MainLoader";
import LoginSignupPopup from "../commonPages/LoginSignupPopup";
import CommunityOverview from "./CommunityPage/CommunityOverview";
import CommunityPosts from "./CommunityPage/CommunityPosts";
import CommunityAnnouncements from "./CommunityPage/CommunityAnnouncements";
import CommunitySettings from "./CommunityPage/CommunitySettings";
import CommunityNotFound from "./CommunityNotFound";
import "./CommunityPage.css";

const CommunityPage = () => {
  const { isDarkMode } = useTheme();
  const { nickname } = useParams();
  const [community, setCommunity] = useState(null);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState("overview");
  const [isMainLoading, setIsMainLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/auth/status`,
        { withCredentials: true }
      );
      setIsAuthenticated(response.data.isAuthenticated);
    } catch (err) {
      console.error("Error checking auth status:", err);
      setIsAuthenticated(false);
    }
  };

  const fetchCommunityData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/communities/${nickname}`,
        { withCredentials: true }
      );
      setCommunity(response.data);
    } catch (err) {
      console.error("Error fetching community data:", err);
      setError("Community not found");
    } finally {
      setIsMainLoading(false);
    }
  };

  useEffect(() => {
    const initializePage = async () => {
      await checkAuthStatus();
      if (isAuthenticated) {
        await fetchCommunityData();
      } else {
        setIsMainLoading(false);
      }
    };

    initializePage();

    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");

    if (
      tab &&
      ["overview", "posts", "announcements", "settings"].includes(tab)
    ) {
      setActiveSection(tab);
    } else {
      setActiveSection("overview");
    }
  }, [location, nickname, isAuthenticated]);

  const handleSetActiveSection = (section) => {
    if (section === "Back To Feed") {
      navigate("/communities");
    } else {
      setActiveSection(section);
      navigate(`?tab=${section}`);
    }
  };

  if (isMainLoading) {
    return <MainLoader />;
  }

  if (!isAuthenticated) {
    return <LoginSignupPopup />;
  }

  if (error) {
    return <CommunityNotFound />;
  }

  const pageTitle = community
    ? `${community.name} | The One Interview`
    : "Community | The One Interview";
  const pageDescription = community
    ? `Explore the ${community.name} community on The One Interview. Join discussions, share knowledge, and connect with like-minded individuals.`
    : "Explore communities on The One Interview. Join discussions, share knowledge, and connect with like-minded individuals.";

  return (
    <div
      className={`communitypage-container ${
        isDarkMode ? "dark-mode" : "light-mode"
      }`}
    >
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content={`https://the-one-interview.vercel.app/community/${nickname}`}
        />
        {community && community.bannerPhoto && (
          <meta property="og:image" content={community.bannerPhoto} />
        )}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        {community && community.bannerPhoto && (
          <meta name="twitter:image" content={community.bannerPhoto} />
        )}
        <link
          rel="canonical"
          href={`https://the-one-interview.vercel.app/community/${nickname}`}
        />
      </Helmet>

      <NavBar />
      <div className="communitypage-main-content">
        <Sidebar
          page="community"
          activeSection={activeSection}
          handleSetActiveSection={handleSetActiveSection}
        />

        <section className="communitypage-content">
          {activeSection === "overview" && (
            <CommunityOverview community={community} />
          )}
          {activeSection === "posts" && (
            <CommunityPosts community={community} />
          )}
          {activeSection === "announcements" && (
            <CommunityAnnouncements community={community} />
          )}
          {activeSection === "settings" && (
            <CommunitySettings community={community} />
          )}
        </section>
      </div>
    </div>
  );
};

export default CommunityPage;
