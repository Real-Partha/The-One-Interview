import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useTheme } from "../../ThemeContext";
import "./Post.css";
import './QuillContent.css';
import DOMPurify from 'dompurify';

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';

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


  const [commentLikes, setCommentLikes] = useState({});
  const [commentDislikes, setCommentDislikes] = useState({});



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
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/question/${questionId}`,
        { withCredentials: true }
      );
      setQuestion(response.data);
      setUserVote(response.data.userVote);
      setUpvotes(response.data.upvotes);
      setDownvotes(response.data.downvotes);
      setComments(response.data.comments);

      // Initialize comment likes and dislikes
      const likesObj = {};
      const dislikesObj = {};
      response.data.comments.forEach(comment => {
        likesObj[comment._id] = comment.likes ? comment.likes.length : 0;
        dislikesObj[comment._id] = comment.dislikes ? comment.dislikes.length : 0;
      });
      setCommentLikes(likesObj);
      setCommentDislikes(dislikesObj);
    } catch (error) {
      console.error("Error fetching question:", error);
    }
  };

  const handleCommentLike = async (commentId) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/comment/comments/${commentId}/like`,
        {},
        { withCredentials: true }
      );
      setCommentLikes(prev => ({ ...prev, [commentId]: response.data.likes }));
      setCommentDislikes(prev => ({ ...prev, [commentId]: response.data.dislikes }));
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
      setCommentLikes(prev => ({ ...prev, [commentId]: response.data.likes }));
      setCommentDislikes(prev => ({ ...prev, [commentId]: response.data.dislikes }));
    } catch (error) {
      console.error("Error disliking comment:", error);
    }
  };



  useEffect(() => {
    fetchQuestion();
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

  if (!question) return <div>Loading...</div>;

  return (
    <div className={`${isDarkMode ? `dark-mode` : ``}`}>
      <div className="post-main">
        <div className={`post-container ${isDarkMode ? "dark-mode" : ""}`}>
          <h1 className="post-title">{question.question}</h1>
          <div className="post-meta">
            <img
              src={question.profile_pic || "/img/profile_pic.png"}
              alt="Profile"
              className="profile-pic"
            />
            <div className="post-info">
              <p className="username">{question.username}</p>
              <p className="date">
                {new Date(question.created_at).toLocaleString()}
              </p>
            </div>
          </div>
          <div className="post-content">
            <div
              className="quill-content"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(question.answer),
              }}
            />
          </div>
          <div className="post-tags">
            {question.tags.map((tag, index) => (
              <span key={index} className="tag">
                #{tag.toLowerCase()}
              </span>
            ))}
          </div>
          <div className="post-details">
            <p className="company">
              Company: <span>{question.company_name || "Not specified"}</span>
            </p>
            <p className="category">
              Category: <span>{question.category || "Not specified"}</span>
            </p>
          </div>
          <div className="post-actions">
            <button
              className={`upvote ${userVote === "upvote" ? "active" : ""} ${debouncingButton === "upvote" ? "debouncing" : ""
                }`}
              onClick={handleUpvote}
              disabled={isDebouncing}
            >
              <i className="fa-solid fa-thumbs-up"></i>{" "}
              {userVote === "upvote" ? " Upvoted" : " Upvote"} ({upvotes})
              {debouncingButton === "upvote" && (
                <div className="debounce-bar"></div>
              )}
            </button>
            <button
              className={`downvote ${userVote === "downvote" ? "active" : ""} ${debouncingButton === "downvote" ? "debouncing" : ""
                }`}
              onClick={handleDownvote}
              disabled={isDebouncing}
            >
              <i className="fa-solid fa-thumbs-down"></i>{" "}
              {userVote === "downvote" ? " Downvoted" : " Downvote"} (
              {downvotes})
              {debouncingButton === "downvote" && (
                <div className="debounce-bar"></div>
              )}
            </button>
          </div>
          <div className="post-stats">
            <span className="view-count">
              <i className="fas fa-eye"></i> {question.impressions || 0} Views
            </span>
          </div>
          <div className="comments-section">
            <h3>
              {comments.length} {comments.length == 1 ? "Comment" : "Comments"}
            </h3>
            <form onSubmit={handleCommentSubmit} className="comment-form">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="comment-input"
              />
              <button type="submit" className="comment-submit">
                Send
              </button>
            </form>
            <div className="comments-list">
              {comments
                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                .map((comment) => (
                  <div key={comment._id} className="comment">
                    <div className="comment-header">
                      <div className="comment-user-info">
                        <img
                          src={comment.profile_pic || "/img/default_avatar.png"}
                          alt={comment.username}
                          className="comment-profile-pic"
                        />
                        <span className="comment-username">{comment.username}</span>
                      </div>
                      <span className="comment-time">{formatTimeAgo(comment.created_at)}</span>
                    </div>
                    <p className="comment-content">{comment.comment}</p>
                    <div className="comment-actions">
                      <button onClick={() => handleCommentLike(comment._id)}>
                        Like ({commentLikes[comment._id] || 0})
                      </button>
                      <button onClick={() => handleCommentDislike(comment._id)}>
                        Dislike ({commentDislikes[comment._id] || 0})
                      </button>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
