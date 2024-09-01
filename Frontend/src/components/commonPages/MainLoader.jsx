import React, { useState, useEffect } from "react";
import "./MainLoader.css";
import { useTheme } from "../../ThemeContext";
import tips from "./tips.json";
import BoltLoader from "./BoltLoader";

const MainLoader = () => {
  const { isDarkMode } = useTheme();
  const [currentTip, setCurrentTip] = useState("");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const changeTip = () => {
      const randomTip = tips[Math.floor(Math.random() * tips.length)];
      setCurrentTip(randomTip);
    };

    const incrementProgress = () => {
      setProgress((prev) => (prev < 100 ? prev + 1 : 0));
    };

    changeTip();
    const tipInterval = setInterval(changeTip, 7000);
    const progressInterval = setInterval(incrementProgress, 50);

    return () => {
      clearInterval(tipInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className={`mainloader-container ${isDarkMode ? "dark-mode" : ""}`}>
      <div className="mainloader-forum">
        <div className="mainloader-icon-container">
          <i className="fas fa-user-tie mainloader-icon"></i>
          <i className="fas fa-comments mainloader-icon"></i>
          <i className="fas fa-lightbulb mainloader-icon"></i>
          <i className="fas fa-chart-line mainloader-icon"></i>
        </div>
        {/* <div className="mainloader-question-circle">
          <span className="mainloader-question">?</span>
        </div> */}
        <BoltLoader size="100rem" boltColor="#6366F1" />
      </div>
      <div className="mainloader-progress-bar">
        <div className="mainloader-progress" style={{ width: `${progress}%` }}></div>
      </div>
      <p className="mainloader-text">Curating interview questions...</p>
      <div className="mainloader-tip">
        <span className="mainloader-tip-label">Tip:</span>
        <span className="mainloader-tip-content">{currentTip}</span>
      </div>
    </div>
  );
};

export default MainLoader;
