import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useTheme } from "../../ThemeContext";
import "./Post.css";
import "./QuillContent.css";
import DOMPurify from "dompurify";
import UnverifiedPost from "./UnverifiedPost";
import RejectedPost from "./RejectedPost";
import LoginSignupPopup from "../commonPages/LoginSignupPopup";
import MainLoader from "../commonPages/MainLoader";
import { Helmet } from "react-helmet";
import {
  FaThumbsUp,
  FaThumbsDown,
  FaEye,
  FaComment,
  FaPaperPlane,
  FaShareAlt,
  FaBookmark,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import useNotification from "../Notifications.jsx";
import ProfilePreview from '../UserProfile/ProfilePreview.jsx';


const Post = () => {
  const { questionId } = useParams();
  const [question, setQuestion] = useState(null);
  const [userVote, setUserVote] = useState(null);
  const { isDarkMode } = useTheme();
  const [isDebouncing, setIsDebouncing] = useState(false);
  const [debouncingButton, setDebouncingButton] = useState(null);
  const [upvotes, setUpvotes] = useState(0);
  const [downvotes, setDownvotes] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [isMainLoading, setIsMainLoading] = useState(true);
  const [commentLikes, setCommentLikes] = useState({});
  const [commentDislikes, setCommentDislikes] = useState({});
  const [questionWarning, setQuestionWarning] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  const { SuccessNotification, ErrorNotification } = useNotification();
  const [showProfilePreview, setShowProfilePreview] = useState(false);
  const [previewUser, setPreviewUser] = useState(null);

  const handleShare = () => {
    const postUrl = window.location.href;
    navigator.clipboard
      .writeText(postUrl)
      .then(() => {
        SuccessNotification("Link copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        ErrorNotification("Failed to copy link");
      });
  };


  const handleProfileClick = async (username) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/${username}`);
      setPreviewUser({
        ...response.data,
        profilePicture: response.data.profilePicture || response.data.profile_pic
      });
      setShowProfilePreview(true);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleCloseProfilePreview = () => {
    setShowProfilePreview(false);
    setPreviewUser(null);
  };


  const generateMetaDescription = (question, answer) => {
    const cleanAnswer = answer.replace(/<[^>]*>/g, "");
    return `${question} - ${cleanAnswer.slice(0, 150)}...`;
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/account/savequestion`,
        { questionId },
        { withCredentials: true }
      );
      if (response.data.saved) {
        setIsSaved(true);
        SuccessNotification("Question saved successfully!");
      } else {
        setIsSaved(false);
        SuccessNotification("Question removed from saved list");
      }
    } catch (error) {
      console.error("Error saving question:", error);
      ErrorNotification("Error saving question. Please try again.");
      if (error.response && error.response.status === 401) {
        navigate("/login");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const debounce = (func, buttonId) => {
    return async (...args) => {
      if (isDebouncing) return;
      setIsDebouncing(true);
      setDebouncingButton(buttonId);
      try {
        await func(...args);
      } finally {
        setIsDebouncing(false);
        setDebouncingButton(null);
      }
    };
  };

  const commentListRef = useRef(null);

  const debouncedUpvote = debounce(async () => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/upvote`,
        { _id: questionId },
        { withCredentials: true }
      );
      if (response.status === 200) {
        if (userVote === "upvote") {
          setUpvotes(upvotes - 1);
          setUserVote(null);
        } else if (userVote === "downvote") {
          setUpvotes(upvotes + 1);
          setDownvotes(downvotes - 1);
          setUserVote("upvote");
        } else {
          setUpvotes(upvotes + 1);
          setUserVote("upvote");
        }
      }
    } catch (error) {
      console.error("Error upvoting question:", error);
    }
  }, "upvote");

  const debouncedDownvote = debounce(async () => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/downvote`,
        { _id: questionId },
        { withCredentials: true }
      );
      if (response.status === 200) {
        if (userVote === "downvote") {
          setDownvotes(downvotes - 1);
          setUserVote(null);
        } else if (userVote === "upvote") {
          setDownvotes(downvotes + 1);
          setUpvotes(upvotes - 1);
          setUserVote("downvote");
        } else {
          setDownvotes(downvotes + 1);
          setUserVote("downvote");
        }
      }
    } catch (error) {
      console.error("Error downvoting question:", error);
    }
  }, "downvote");

  const handleUpvote = () => {
    debouncedUpvote();
  };

  const handleDownvote = () => {
    debouncedDownvote();
  };

  const fetchQuestion = async () => {
    try {
      setIsMainLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 300));
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/question/${questionId}`,
        { withCredentials: true }
      );

      if (response.data.error === "User not authenticated") {
        setShowLoginPopup(true);
      } else {
        if (response.data.isVerified === "approved") {
          setQuestion(response.data);
          setUserVote(response.data.userVote);
          setUpvotes(response.data.upvotes);
          setDownvotes(response.data.downvotes);
          setComments(response.data.comments);

          // Initialize comment likes and dislikes
          const likesObj = {};
          const dislikesObj = {};
          response.data.comments.forEach((comment) => {
            likesObj[comment._id] = comment.likes ? comment.likes.length : 0;
            dislikesObj[comment._id] = comment.dislikes
              ? comment.dislikes.length
              : 0;
          });
          setCommentLikes(likesObj);
          setCommentDislikes(dislikesObj);
        } else {
          setQuestion(response.data);
          if (response.data.isVerified === "unverified") {
            setQuestionWarning(
              "This post is not yet verified by the admin. It is only visible to you."
            );
          }
          if (response.data.isVerified === "rejected") {
            setQuestionWarning(
              "This post has been rejected by the admin. It is only visible to you."
            );
          }
        }
      }
    } catch (error) {
      console.error("Error fetching question:", error);
      if (error.response && error.response.status === 401) {
        setShowLoginPopup(true);
      }
    } finally {
      setIsMainLoading(false);
    }
  };

  const handleCommentLike = async (commentId) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/comment/comments/${commentId}/like`,
        {},
        { withCredentials: true }
      );
      setCommentLikes((prev) => ({
        ...prev,
        [commentId]: response.data.likes,
      }));
      setCommentDislikes((prev) => ({
        ...prev,
        [commentId]: response.data.dislikes,
      }));
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  const handleCommentDislike = async (commentId) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/comment/comments/${commentId}/dislike`,
        {},
        { withCredentials: true }
      );
      setCommentLikes((prev) => ({
        ...prev,
        [commentId]: response.data.likes,
      }));
      setCommentDislikes((prev) => ({
        ...prev,
        [commentId]: response.data.dislikes,
      }));
    } catch (error) {
      console.error("Error disliking comment:", error);
    }
  };

  useEffect(() => {
    fetchQuestion();
    const checkSavedStatus = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/account/issaved/${questionId}`,
          { withCredentials: true }
        );
        setIsSaved(response.data.isSaved);
      } catch (error) {
        console.error("Error checking saved status:", error);
      }
    };
    checkSavedStatus();
  }, [questionId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/auth/status`,
      {
        withCredentials: true,
      }
    );
    if (response.data.isAuthenticated === false) {
      alert("Please log in to comment");
      return;
    }
    const user = response.data.user;
    try {
      const commentResponse = await axios.post(
        `${import.meta.env.VITE_API_URL}/questions/comments`,
        {
          question_id: questionId,
          comment: newComment,
          user_id: user._id,
        },
        { withCredentials: true }
      );
      const newCommentData = {
        ...commentResponse.data,
        username: user.username,
        profile_pic: user.profile_pic,
      };
      setComments([newCommentData, ...comments]);
      setNewComment("");
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);

    if (seconds < 15) {
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

  if (isMainLoading) {
    return (
      <div>
        <MainLoader />;
      </div>
    );
  }

  const handleCloseLoginPopup = () => {
    setShowLoginPopup(false);
  };

  if (showLoginPopup) {
    return <LoginSignupPopup onClose={handleCloseLoginPopup} />;
  }

  if (question && question.isVerified === "unverified" && !question.user_id) {
    return <UnverifiedPost />;
  }

  if (question && question.isVerified === "rejected" && !question.user_id) {
    return <RejectedPost />;
  }

  return (
    <motion.div
      className={`Post-wrapper ${isDarkMode ? "dark-mode" : ""}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {question && (
        <Helmet>
          <title>{`${question.question} | The One Interview`}</title>
          <meta
            name="description"
            content={generateMetaDescription(
              question.question,
              question.answer
            )}
          />
          <meta
            name="keywords"
            content={`interview question, ${question.tags.join(", ")}, ${
              question.companyName
            }, ${question.category}`}
          />
          <meta
            property="og:title"
            content={`${question.question} | The One Interview`}
          />
          <meta
            property="og:description"
            content={generateMetaDescription(
              question.question,
              question.answer
            )}
          />
          <meta property="og:type" content="article" />
          <meta
            property="og:url"
            content={`https://the-one-interview.vercel.app/question/${questionId}`}
          />
          <meta property="og:image" content="/img/og-image.png" />
          <link
            rel="canonical"
            href={`https://the-one-interview.vercel.app/question/${questionId}`}
          />
        </Helmet>
      )}

      <div className="Post-main">
        <motion.div
          className="Post-container"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {questionWarning && (
            <div
              className={`Post-warning ${
                question.isVerified === "unverified"
                  ? "Post-pending"
                  : "Post-rejected"
              }`}
            >
              {questionWarning}
            </div>
          )}
          <h1 className="Post-title">{question.question}</h1>
          <div className="Post-meta">
        <img
          src={question.profile_pic || "/img/profile_pic.png"}
          alt="Profile"
          className="Post-profile-pic"
          onClick={() => handleProfileClick(question.username)}
          style={{ cursor: 'pointer' }}
        />
            <div className="Post-info">
              <p className="Post-username">{question.username}</p>
              <p className="Post-date">
                {new Date(question.created_at).toLocaleString()}
              </p>
            </div>
          </div>
          <div className="Post-content">
            <div
              className="quill-content"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(question.answer),
              }}
            />
          </div>
          <motion.div
            className="Post-tags-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {question.tags.map((tag, index) => (
              <Link to={`/tags?tag=${tag.toLowerCase()}`} target="_blank" key={index}>
                <motion.span
                  key={index}
                  className="Post-tag"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.3 }}
                >
                  #{tag.toLowerCase()}
                </motion.span>
              </Link>
            ))}
          </motion.div>
          <div className="Post-details">
            <p className="Post-company">
              Company: <span>{question.companyName || "Not specified"}</span>
            </p>
            <p className="Post-category">
              Category: <span>{question.category || "Not specified"}</span>
            </p>
          </div>
          <div className="Post-actions">
            <motion.button
              className={`Post-vote-btn ${
                userVote === "upvote" ? "active upvote" : ""
              }`}
              onClick={handleUpvote}
              disabled={isDebouncing}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaThumbsUp />
              <span>{userVote === "upvote" ? "Upvoted" : "Upvote"}</span>
              <span className="Post-vote-count">({upvotes})</span>
            </motion.button>
            <motion.button
              className={`Post-vote-btn ${
                userVote === "downvote" ? "active downvote" : ""
              }`}
              onClick={handleDownvote}
              disabled={isDebouncing}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaThumbsDown />
              <span>{userVote === "downvote" ? "Downvoted" : "Downvote"}</span>
              <span className="Post-vote-count">({downvotes})</span>
            </motion.button>
            <motion.button
              className="Post-action-btn share"
              onClick={handleShare}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaShareAlt />
              <span>Share</span>
            </motion.button>
            <motion.button
              className={`Post-action-btn ${isSaved ? "saved" : ""}`}
              onClick={handleSave}
              disabled={isSaving}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaBookmark />
              <span>{isSaving ? "Saving..." : isSaved ? "Saved" : "Save"}</span>
            </motion.button>
          </div>
          <div className="Post-stats">
            <span className="Post-view-count">
              <FaEye /> {question.impressions || 0}{" "}
              {question.impressions === 1 ? "View" : "Views"}
            </span>
          </div>
          <div className="Post-comments">
            <h3 className="Post-comments-title">
              <FaComment /> {comments.length}{" "}
              {comments.length === 1 ? "Comment" : "Comments"}
            </h3>
            <form onSubmit={handleCommentSubmit} className="Post-comment-form">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="Post-comment-input"
              />
              <motion.button
                type="submit"
                className="Post-comment-submit"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaPaperPlane />
              </motion.button>
            </form>
            <div className="Post-comments-list" ref={commentListRef}>
              <AnimatePresence>
                {comments
                  .sort(
                    (a, b) => new Date(b.created_at) - new Date(a.created_at)
                  )
                  .map((comment, index) => (
                    <motion.div
                      key={comment._id}
                      className="Post-comment"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                    >
                      {/* {index < 3 && (
                        <FaMedal className={`Post-comment-medal Post-medal-${index + 1}`} />
                      )} */}
                      <div className="Post-comment-header">
                        <div className="Post-comment-user-info">
                          <img
                            src={
                              comment.profile_pic || "/img/default_avatar.png"
                            }
                            alt={comment.username}
                            className="Post-comment-profile-pic"
                          />
                          <span className="Post-comment-username">
                            {comment.username}
                          </span>
                        </div>
                        <span className="Post-comment-time">
                          {formatTimeAgo(comment.created_at)}
                        </span>
                      </div>
                      <p className="Post-comment-content">{comment.comment}</p>
                      <div className="Post-comment-actions">
                        <motion.button
                          className={`Post-comment-like-btn ${
                            commentLikes[comment._id] > 0 ? "liked" : ""
                          }`}
                          onClick={() => handleCommentLike(comment._id)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <FaThumbsUp />
                          <span>{commentLikes[comment._id] || 0}</span>
                        </motion.button>
                        <motion.button
                          className={`Post-comment-dislike-btn ${
                            commentDislikes[comment._id] > 0 ? "disliked" : ""
                          }`}
                          onClick={() => handleCommentDislike(comment._id)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <FaThumbsDown />
                          <span>{commentDislikes[comment._id] || 0}</span>
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
      <AnimatePresence>
        {showProfilePreview && previewUser && (
          <ProfilePreview user={previewUser} onClose={handleCloseProfilePreview} />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Post;
