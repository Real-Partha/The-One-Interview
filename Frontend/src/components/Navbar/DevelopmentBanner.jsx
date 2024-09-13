import React from "react";
import { Link } from "react-router-dom";
import { useBanner } from "../context/BannerContext";
import "./DevelopmentBanner.css";

const DevelopmentBanner = () => {
  const { showBanner, setShowBanner } = useBanner();

  if (!showBanner) return null;

  return (
    <div className="development-banner">
      <div className="banner-fade banner-fade-left"></div>
      <div className="banner-content">
        <p>
          This website is under active development. Please kindly share your
          valuable feedback and suggestions to help us fix bugs and improve the
          overall experience.
          <Link
            to="/feedback"
            onClick={() => setShowBanner(false)}
            className="development-banner-feedback-link"
          >
            Click here to give feedback
          </Link>
          .
        </p>
      </div>
      <div className="banner-fade banner-fade-right"></div>
      <button className="close-banner" onClick={() => setShowBanner(false)}>
        ×
      </button>
    </div>
  );
};

export default DevelopmentBanner;
