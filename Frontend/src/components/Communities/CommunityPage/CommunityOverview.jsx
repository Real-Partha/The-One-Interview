// CommunityOverview.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faUser,
  faQuestionCircle,
} from "@fortawesome/free-solid-svg-icons";
import "./CommunityOverview.css";

const CommunityOverview = ({ community }) => {
  const [topQuestions, setTopQuestions] = useState([]);
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    if (community) {
      fetchTopQuestions();
      checkMembershipStatus();
    }
  }, [community]);

  const fetchTopQuestions = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/communities/${
          community.nickname
        }/top-questions`
      );
      setTopQuestions(response.data);
    } catch (error) {
      console.error("Error fetching top questions:", error);
    }
  };

  const checkMembershipStatus = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/communities/${
          community.nickname
        }/membership-status`,
        { withCredentials: true }
      );
      setIsMember(response.data.isMember);
    } catch (error) {
      console.error("Error checking membership status:", error);
    }
  };

  const handleJoin = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/communities/${community._id}/join`,
        {},
        { withCredentials: true }
      );
      setIsMember(true);
    } catch (error) {
      console.error("Error joining community:", error);
    }
  };

  if (!community) return null;

  return (
    <div className="communityoverview-container">
      <div
        className="communityoverview-banner"
        style={{ backgroundImage: `url(${community.bannerPhoto})` }}
      >
        <div className="communityoverview-profile-pic">
          <img src={community.profilePhoto} alt={community.name} />
        </div>
      </div>
      <div className="communityoverview-content">
        <div className="communityoverview-header">
          <div className="communityoverview-title">
            <h1>{community.name}</h1>
            <span className="communityoverview-nickname">
              @{community.nickname}
            </span>
          </div>
          {isMember ? (
            <div className="communityoverview-member">
              <FontAwesomeIcon icon={faCheck} /> Member
            </div>
          ) : (
            <button className="communityoverview-join-btn" onClick={handleJoin}>
              Join Community
            </button>
          )}
        </div>
        <p className="communityoverview-description">{community.description}</p>
        <div className="communityoverview-looking-for">
          <h3>Who We're Looking For:</h3>
          <div className="communityoverview-tags">
            {community.lookingFor.map((tag, index) => (
              <span key={index} className="communityoverview-tag">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="communityoverview-stats">
          <div className="communityoverview-stat">
            <FontAwesomeIcon icon={faUser} />
            <span>{community.members.length} Members</span>
          </div>
          <div className="communityoverview-stat">
            <FontAwesomeIcon icon={faQuestionCircle} />
            <span>{community.posts.length} Questions</span>
          </div>
        </div>
        <div className="communityoverview-top-questions">
          <h3>Top Questions:</h3>
          {topQuestions.length > 0 ? (
            <div className="communityoverview-questions-list">
              {topQuestions.map((question, index) => (
                <div key={index} className="communityoverview-question">
                  <h4>{question.question}</h4>
                  <div className="communityoverview-question-stats">
                    <span>{question.upvotes} upvotes</span>
                    <span>{question.commentscount} comments</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No questions curated for this community yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunityOverview;
