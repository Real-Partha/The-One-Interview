import React, { useState, useEffect } from "react";
import axios from "axios";
import "./UserActivity.css";

const UserActivity = ({ refreshTrigger }) => {
  const [activities, setActivities] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [newActivities, setNewActivities] = useState([]);

  const fetchActivities = async (pageNum = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/auth/user-activities?page=${pageNum}`,
        { withCredentials: true }
      );
      if (pageNum === 1) {
        setActivities(response.data.activities);
      } else {
        setNewActivities(response.data.activities);
      }
      setHasMore(response.data.hasMore);
    } catch (error) {
      console.error("Error fetching user activities:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (newActivities.length > 0) {
      const timer = setTimeout(() => {
        setActivities((prevActivities) => [
          ...prevActivities,
          ...newActivities,
        ]);
        setNewActivities([]);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [newActivities]);

  useEffect(() => {
    fetchActivities(1);
    setPage(1);
  }, [refreshTrigger]);

  useEffect(() => {
    if (page > 1) {
      fetchActivities(page);
    }
  }, [page]);

  const handleViewMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "comment":
        return "fa-comment";
      case "profile_update":
        return "fa-user-edit";
      case "profile_photo":
        return "fa-camera";
      case "username":
        return "fa-user";
      case "question":
        return "fa-question";
      case "search":
        return "fa-search";
      default:
        return "fa-circle";
    }
  };

  const getActivityIconForVote = (action) => {
    switch (action) {
      case "upvote":
        return "fa-thumbs-up";
      case "remove_upvote":
        return "fa-regular fa-thumbs-up";
      case "downvote":
        return "fa-thumbs-down";
      case "remove_downvote":
        return "fa-regular fa-thumbs-down";
      default:
        return "fa-circle";
    }
  };

  const getActivityDescription = (activity) => {
    switch (activity.type) {
      case "comment":
        return (
          <div>
            <p>Commented on a post</p>
            {activity.details && activity.details.comment_id && (
              <a
                href={`/question/${activity.target_id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Question
              </a>
            )}
          </div>
        );
      case "profile_update":
        return (
          <div>
            <p>Updated profile information:</p>
            {activity.details &&
              Object.entries(activity.details).map(([key, value]) => (
                <p key={key}>
                  {key}: from "{value.old}" to "{value.new}"
                </p>
              ))}
          </div>
        );
      case "profile_photo":
        return `${
          activity.action === "updated" ? "Updated" : "Deleted"
        } profile photo`;
      case "username":
        return `Changed username from "${activity.details.old}" to "${activity.details.new}"`;
      case "question":
        return (
          <div>
            <p>Posted a question</p>
            {activity.target_id && (
              <a
                href={`/question/${activity.target_id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Question
              </a>
            )}
          </div>
        );
      case "search":
        return `Searched for "${activity.details.query}"`;
      case "vote":
        return (
          <div>
            <p>
              {activity.action === "upvote"
                ? "Upvoted"
                : activity.action === "remove_upvote"
                ? "Removed Upvote from"
                : activity.action === "downvote"
                ? "Downvoted"
                : "Removed Downvote from"}{" "}
              a question
            </p>
            {activity.target_id && (
              <a
                href={`/question/${activity.target_id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Question
              </a>
            )}
          </div>
        );
      default:
        return "Performed an action";
    }
  };

  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);

    if (seconds < 8) {
      return "Just now";
    }

    if (seconds < 60) {
      return seconds + (seconds === 1 ? " second ago" : " seconds ago");
    }

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return minutes + (minutes === 1 ? " minute ago" : " minutes ago");
    }

    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return hours + (hours === 1 ? " hour ago" : " hours ago");
    }

    const days = Math.floor(hours / 24);
    if (days < 30) {
      return days + (days === 1 ? " day ago" : " days ago");
    }

    const months = Math.floor(days / 30);
    if (months < 12) {
      return months + (months === 1 ? " month ago" : " months ago");
    }

    const years = Math.floor(months / 12);
    return years + (years === 1 ? " year ago" : " years ago");
  };

  return (
    <div className="user-activity">
      <div className="activity-header">
        <img
          src="/img/recentLogo.png"
          alt="Recent Activity"
          className="activity-logo"
        />
        <h3>Recent Activity</h3>
      </div>
      <ul className="activity-list">
        {activities.map((activity) => (
          <li key={activity._id} className="activity-item">
            {activity.type !== "vote" ? (
              <i
                className={`fa ${getActivityIcon(activity.type)} activity-icon`}
              ></i>
            ) : (
              <i
                className={`fa ${getActivityIconForVote(
                  activity.action
                )} activity-icon`}
              ></i>
            )}
            <div className="activity-content">
              {getActivityDescription(activity)}
              <span className="activity-timestamp">
                {formatTimeAgo(activity.timestamp)}
              </span>
            </div>
          </li>
        ))}
      </ul>
      {hasMore && (
        <button
          onClick={handleViewMore}
          className="view-more-button"
          disabled={loading}
        >
          {loading ? "Loading..." : "View More"}
        </button>
      )}
    </div>
  );
};

export default UserActivity;
