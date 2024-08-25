import React, { useState, useEffect } from "react";
import axios from "axios";
import "./UserActivity.css";

const UserActivity = ({ refreshTrigger }) => {
  const [activities, setActivities] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

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
        setActivities((prevActivities) => [
          ...prevActivities,
          ...response.data.activities,
        ]);
      }
      setHasMore(response.data.hasMore);
    } catch (error) {
      console.error("Error fetching user activities:", error);
    }
    setLoading(false);
  };

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
      case "vote":
        return "fa-thumbs-up";
      default:
        return "fa-circle";
    }
  };

  const getActivityDescription = (activity) => {
    switch (activity.type) {
      case "comment":
        return "Commented on a post";
      case "profile_update":
        return "Updated profile information";
      case "profile_photo":
        return `${
          activity.action === "updated" ? "Updated" : "Deleted"
        } profile photo`;
      case "username":
        return "Changed username";
      case "question":
        return "Posted a question";
      case "search":
        return `Searched for "${activity.details.query}"`;
      case "vote":
        return `${
          activity.action === "upvote" ? "Upvoted" : "Downvoted"
        } a question`;
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
        {activities.map((activity, index) => (
          <li key={activity._id} className="activity-item">
            <i
              className={`fa ${getActivityIcon(activity.type)} activity-icon`}
            ></i>
            <div className="activity-content">
              <p>{getActivityDescription(activity)}</p>
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
