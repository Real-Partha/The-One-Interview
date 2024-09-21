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
import CommunityOverview from "./CommunityOverview";
import CommunityPosts from "./CommunityPosts";
import CommunityAnnouncements from "./CommunityAnnouncements";
import CommunitySettings from "./CommunitySettings";
import "./CommunityPage.css"; // You'll need to create this CSS file

const CommunityPage = () => {
  const { isDarkMode } = useTheme();
  const { nickname } = useParams();
  const [community, setCommunity] = useState(null);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState("overview");
  const [isMainLoading, setIsMainLoading] = useState(true);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  const fetchCommunityData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/communities/${nickname}`,
        { withCredentials: true }
      );
      setCommunity(response.data);
    } catch (err) {
      console.error("Error fetching community data:", err);
      setError("Error fetching community data");
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

    fetchCommunityData();
    firstLoading();

    if (tab && ["overview", "posts", "announcements", "settings"].includes(tab)) {
      setActiveSection(tab);
    } else {
      setActiveSection("overview");
    }
  }, [location, nickname]);

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

  if (!community) {
    return <LoginSignupPopup />;
  }

  const pageTitle = community ? `${community.name} | The One Interview` : 'Community | The One Interview';
  const pageDescription = community
    ? `Explore the ${community.name} community on The One Interview. Join discussions, share knowledge, and connect with like-minded individuals.`
    : 'Explore communities on The One Interview. Join discussions, share knowledge, and connect with like-minded individuals.';

  return (
    <div className={`community-page ${isDarkMode ? "dark-mode" : "light-mode"}`}>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://the-one-interview.vercel.app/community/${nickname}`} />
        {community && community.bannerPhoto && <meta property="og:image" content={community.bannerPhoto} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        {community && community.bannerPhoto && <meta name="twitter:image" content={community.bannerPhoto} />}
        <link rel="canonical" href={`https://the-one-interview.vercel.app/community/${nickname}`} />
      </Helmet>

      <NavBar />
      <div className="community-main-content">
        <Sidebar
          page="community"
          activeSection={activeSection}
          handleSetActiveSection={handleSetActiveSection}
        />

        <section className="community-content">
          {activeSection === "overview" && <CommunityOverview community={community} />}
          {activeSection === "posts" && <CommunityPosts community={community} />}
          {activeSection === "announcements" && <CommunityAnnouncements community={community} />}
          {activeSection === "settings" && <CommunitySettings community={community} />}
        </section>
      </div>
    </div>
  );
};

export default CommunityPage;
