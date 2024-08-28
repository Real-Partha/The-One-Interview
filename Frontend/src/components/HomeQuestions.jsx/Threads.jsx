import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import DOMPurify from "dompurify";
import debounce from "lodash.debounce";
import Typewriter from "typewriter-effect";
import CreateQuestionPage from "./CreateQuestionPage";
import ThreadSkeleton from "./threadskeleton";
import { useTheme } from "./useTheme";

const AddQandThread = () => {
  const navigate = useNavigate();
  const [threads, setThreads] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isQuestionLoading, setIsQuestionLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [showCreateQuestion, setShowCreateQuestion] = useState(false);
  const [inputPage, setInputPage] = useState("");
  const { isDarkMode } = useTheme();

  const handlePageInputChange = (e) => {
    setInputPage(e.target.value);
  };

  const handlePageInputSubmit = (e) => {
    e.preventDefault();
    const pageNumber = parseInt(inputPage, 10);
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      setPageWithExpiration(pageNumber.toString());
      debouncedScrollToTop();
      setInputPage("");
    }
  };

  const fetchThreads = useCallback(async (page) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/questions`,
        {
          params: { page: page },
          withCredentials: true,
        }
      );
      setIsQuestionLoading(false);
      setThreads(response.data.questions);
      setTotalPages(response.data.totalPages);
      setHasNextPage(response.data.hasNextPage);
      setHasPrevPage(response.data.hasPrevPage);
    } catch (error) {
      console.error("Error fetching threads:", error);
    }
  }, []);

  useEffect(() => {
    const savedPage = getPageWithExpiration();
    const pageToLoad = savedPage ? parseInt(savedPage, 10) : 1;
    setCurrentPage(pageToLoad);
    fetchThreads(pageToLoad);
  }, [fetchThreads]);

  useEffect(() => {
    fetchThreads(currentPage);
  }, [currentPage, fetchThreads]);

  const truncateHTML = (html, maxLength) => {
    const div = document.createElement("div");
    div.innerHTML = DOMPurify.sanitize(html);
    const text = div.textContent || div.innerText || "";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);

    if (seconds < 10) return "Just now";
    if (seconds < 60) return `${seconds} second${seconds > 1 ? "s" : ""} ago`;

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;

    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} day${days > 1 ? "s" : ""} ago`;

    const months = Math.floor(days / 30);
    if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;

    const years = Math.floor(months / 12);
    return `${years} year${years > 1 ? "s" : ""} ago`;
  };

  const setPageWithExpiration = (page) => {
    const now = new Date().getTime();
    const item = {
      value: page,
      expiry: now + 15 * 60 * 1000, // 15 minutes from now
    };
    localStorage.setItem("currentPage", JSON.stringify(item));
  };

  const getPageWithExpiration = () => {
    const itemStr = localStorage.getItem("currentPage");
    if (!itemStr) return null;

    const item = JSON.parse(itemStr);
    const now = new Date().getTime();
    if (now > item.expiry) {
      localStorage.removeItem("currentPage");
      return null;
    }
    return item.value;
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const debouncedScrollToTop = useCallback(debounce(scrollToTop, 300), []);

  const handleNextPage = useCallback(() => {
    if (hasNextPage) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      setPageWithExpiration(newPage.toString());
      debouncedScrollToTop();
    }
  }, [hasNextPage, currentPage, debouncedScrollToTop]);

  const handlePrevPage = useCallback(() => {
    if (hasPrevPage) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      setPageWithExpiration(newPage.toString());
      debouncedScrollToTop();
    }
  }, [hasPrevPage, currentPage, debouncedScrollToTop]);

  const toggleCreateQuestion = () => {
    setShowCreateQuestion((prev) => !prev);
  };

  return (
    <section className="threads">
      <div className="add-thread-container">
        <div className="add-thread-input">
          <Typewriter
            words={["ADD A NEW QUESTION"]}
            loop={true}
            cursor
            cursorStyle="|"
            typeSpeed={70}
            deleteSpeed={50}
            delaySpeed={1000}
          />
        </div>
        <button className="add-thread-button" onClick={toggleCreateQuestion}>
          <i className="fa-solid fa-plus"></i>
        </button>
      </div>
      <div
        className={`create-question-animation ${
          showCreateQuestion ? "show" : ""
        }`}
      >
        <CreateQuestionPage onClose={toggleCreateQuestion} />
      </div>

      {isQuestionLoading
        ? Array(7)
            .fill()
            .map((_, index) => <ThreadSkeleton key={index} />)
        : threads.map((thread) => (
            <Link
              to={`/question/${thread._id}`}
              key={thread._id}
              className="thread-card-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="thread-card">
                <h3 className="thread-title">{thread.question}</h3>
                <p className="thread-answer-preview">
                  {truncateHTML(thread.answer, 150)}
                </p>
                <div className="thread-info">
                  <img
                    src={thread.profile_pic || "/img/profile_pic.png"}
                    alt="Profile"
                    className="profile-pic"
                  />
                  <div className="thread-details">
                    <p className="thread-meta">
                      <span className="username">{thread.username}</span> •
                      <span className="date">
                        {timeAgo(thread.created_at)}
                      </span>
                    </p>
                    <div className="thread-tags">
                      {thread.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="tag">
                          #{tag.toLowerCase()}
                        </span>
                      ))}
                      {thread.tags.length > 3 && (
                        <span className="tag">...</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="thread-footer">
                  <div className="thread-votes">
                    <span className="upvotes">
                      <i className="fas fa-arrow-alt-circle-up"></i>{" "}
                      {thread.upvotes || 0}{" "}
                      {thread.upvotes === 1 ? "upvote" : "upvotes"}
                    </span>
                    <span className="downvotes">
                      <i className="fas fa-arrow-alt-circle-down"></i>{" "}
                      {thread.downvotes || 0}{" "}
                      {thread.downvotes === 1 ? "downvote" : "downvotes"}
                    </span>
                  </div>
                  <div className="thread-stats">
                    <div className="thread-views">
                      <i className="fa-solid fa-eye"></i>
                      <span>
                        {thread.impressions || 0}{" "}
                        {thread.impressions === 1 ? "View" : "Views"}
                      </span>
                    </div>
                    <div className="thread-comments">
                      <i className="fa-solid fa-comments"></i>
                      <span>
                        {thread.commentscount || 0}{" "}
                        {thread.commentscount === 1
                          ? "Comment"
                          : "Comments"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
      <div className="pagination">
        <button onClick={handlePrevPage} disabled={!hasPrevPage}>
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={handleNextPage} disabled={!hasNextPage}>
          Next
        </button>
        <form onSubmit={handlePageInputSubmit} className="page-input-form">
          <label htmlFor="pageInput">Jump to :</label>
          <input
            type="number"
            id="pageInput"
            value={inputPage}
            onChange={handlePageInputChange}
            min="1"
            max={totalPages}
            className="page-input"
          />
        </form>
      </div>
    </section>
  );
};

export default AddQandThread;
