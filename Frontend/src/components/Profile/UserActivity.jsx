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
        `${
          import.meta.env.VITE_API_URL
        }/account/user-activities?page=${pageNum}`,
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

  const getActivityIcon = (type, action) => {
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
        return action === "upvote" || action === "remove_upvote"
          ? "fa-thumbs-up"
          : "fa-thumbs-down";
      case "password":
        return "fa-key";
      case "email":
        return "fa-envelope";
      case "2fa":
        return "fa-shield-alt";
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
            <div className="user-activity-title">Commented on a post</div>
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
            <div className="user-activity-title">
              Updated profile information
            </div>
            {activity.details &&
              Object.entries(activity.details).map(([key, value]) => (
                <p key={key}>
                  {value.old === null || value.old === ""
                    ? `Set ${key} to "${value.new}"`
                    : value.new === null || value.new === ""
                    ? `Removed value for ${key}`
                    : `Changed ${key} from "${value.old}" to "${value.new}"`}
                </p>
              ))}
          </div>
        );
      case "profile_photo":
        return (
          <div className="user-activity-title">
            {`${
              activity.action === "updated" ? "Updated" : "Deleted"
            } profile photo`}
          </div>
        );
      case "username":
        return (
          <div className="user-activity-title">
            {`Changed username from "${activity.details.old}" to "${activity.details.new}"`}
          </div>
        );
      case "question":
        return (
          <div>
            <div className="user-activity-title">Posted a question</div>
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
        return (
          <div className="user-activity-title">
            {`Searched for "${activity.details.query}"`}
          </div>
        );
      case "vote":
        return (
          <div>
            <div className="user-activity-title">
              {activity.action === "upvote"
                ? "Upvoted"
                : activity.action === "remove_upvote"
                ? "Removed Upvote from"
                : activity.action === "downvote"
                ? "Downvoted"
                : "Removed Downvote from"}{" "}
              a question
            </div>
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
      case "password":
        return (
          <div className="user-activity-title">
            {activity.action === "changed"
              ? "Changed password"
              : "Set password"}
          </div>
        );
      case "email":
        return (
          <div className="user-activity-title">
            {`Changed email from "${activity.details.old}" to "${activity.details.new}"`}
          </div>
        );
      case "2fa":
        return (
          <div className="user-activity-title">
            {activity.action === "enabled"
              ? "Enabled Two-factor authentication"
              : "Disabled Two-factor authentication"}
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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          id="order-history"
          className="user-activity-icon"
        >
          <path d="M9,9a1,1,0,0,1,1-1h4a1,1,0,0,1,0,2H10A1,1,0,0,1,9,9Zm8,3H10a1,1,0,0,0,0,2h7a1,1,0,0,0,0-2Zm0,4H10a1,1,0,0,0,0,2h7a1,1,0,0,0,0-2ZM30,8a5.984,5.984,0,0,1-8,5.65V27a3,3,0,0,1-3,3H6a3,3,0,0,1-3-3V25a1,1,0,0,1,1-1H5V6A4,4,0,0,1,9,2H21a.983.983,0,0,1,.8.425A5.988,5.988,0,0,1,30,8ZM6,28H16.184A2.966,2.966,0,0,1,16,27V26H5v1A1,1,0,0,0,6,28ZM20,12.46A5.969,5.969,0,0,1,19.54,4H9A2,2,0,0,0,7,6V24H17a1,1,0,0,1,1,1v2a1,1,0,0,0,2,0ZM28,8a4,4,0,1,0-4,4A4,4,0,0,0,28,8ZM26,7H25a1,1,0,0,0-2,0V8a1,1,0,0,0,1,1h2a1,1,0,0,0,0-2Z"></path>
        </svg>
        <div className="user-activity-heading">Recent Activity</div>
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
