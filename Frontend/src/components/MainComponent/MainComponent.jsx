// import React from "react";
import "./MainComponent.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { useTheme } from "../../ThemeContext";
import { Link } from "react-router-dom";
import CreateQuestionPage from "../Posts/CreateQuestionPage";
import { Typewriter } from "react-simple-typewriter";
import { debounce } from "lodash";

const MainComponent = () => {
  const navigate = useNavigate();
  const [threads, setThreads] = useState([]);
  const [currentPage, setCurrentPage] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const { isDarkMode } = useTheme();
  const [showCreateQuestion, setShowCreateQuestion] = useState(false);

  const fetchThreads = useCallback(async (page) => {
    if (page) {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/questions`,
          {
            params: { page: page },
            withCredentials: true,
          }
        );
        setThreads(response.data.questions);
        setTotalPages(response.data.totalPages);
        setHasNextPage(response.data.hasNextPage);
        setHasPrevPage(response.data.hasPrevPage);
      } catch (error) {
        console.error("Error fetching threads:", error);
      }
    }
  }, []);

  useEffect(() => {
    const savedPage = getPageWithExpiration();
    if (savedPage) {
      setCurrentPage(parseInt(savedPage, 10));
    } else {
      setCurrentPage(1);
    }
    fetchThreads(savedPage ? parseInt(savedPage, 10) : 1);
  }, []);
  useEffect(() => {
    fetchThreads(currentPage);
  }, [currentPage, fetchThreads]);

  function timeAgo(date) {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);

    if (seconds < 10) {
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
  }

  const handleSubmit = () => {
    setIsSubmitting(true);
    // Simulating an API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsDropdownOpen(false);
      // Here you would typically send the answers to your backend
      console.log(answers);
    }, 2000);
  };

  const handleRedirect = () => {
    navigate("/create-question");
  };

  const setPageWithExpiration = (page) => {
    const now = new Date().getTime();
    const item = {
      value: page,
      expiry: now + 5 * 60 * 1000, // 15 minutes from now
    };
    localStorage.setItem("currentPage", JSON.stringify(item));
  };

  const getPageWithExpiration = () => {
    const itemStr = localStorage.getItem("currentPage");
    if (!itemStr) {
      return null;
    }
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

  const resetPage = () => {
    setCurrentPage(1);
    setPageWithExpiration('1');
  };

  const handleUserSearch = async (e) => {
    if (e.key === "Enter") {
      const query = e.target.value.trim();
      if (!query) {
        alert("Please type something to search.");
        return;
      }

      try {
        resetPage();
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/questionsearch`,
          {
            params: { query: query },
          }
        );
        setThreads(response.data.questions);
        setTotalPages(response.data.totalPages);
        setHasNextPage(response.data.hasNextPage);
        setHasPrevPage(response.data.hasPrevPage);
      } catch (error) {
        console.error("Error fetching threads:", error);
      }
    }
  };

  return (
    <div className={`${isDarkMode ? "dark-mode" : "light-mode"}`}>
      <div className={`main-content`}>
        <aside className="sidebar">
          <nav className="course-navigation">
            <div className="Left-Side-bar-cards">
              <div className="home_Section">
                <div className="card">
                  <i className="fa fa-home" />
                  <div className="card-details">
                    <h4>Home</h4>
                  </div>
                </div>
              </div>
            </div>

            <div className="Left-Side-bar-cards">
              <div className="questions_section">
                <div className="card">
                  <i className="fa-solid fa-layer-group" />
                  <div className="card-details">
                    <h4>Questions</h4>
                  </div>
                </div>
              </div>
            </div>

            <div className="Left-Side-bar-cards">
              <div className="tags_section">
                <div className="card">
                  <i className="fa-solid fa-hashtag"></i>
                  <div className="card-details">
                    <h4>Tags</h4>
                  </div>
                </div>
              </div>
            </div>

            <div className="Left-Side-bar-cards">
              <div className="company_names">
                <div className="card">
                  <i className="fa-regular fa-building"></i>
                  <div className="card-details">
                    <h4>Corporate </h4>
                  </div>
                </div>
              </div>
            </div>
          </nav>
          <button className="join-class">Join a new Community</button>
        </aside>
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
            <button
              className="add-thread-button"
              onClick={() => setShowCreateQuestion(!showCreateQuestion)}
            >
              <i className="fa-solid fa-plus"></i>
            </button>
          </div>
          <div
            className={`create-question-animation ${
              showCreateQuestion ? "show" : ""
            }`}
          >
            {showCreateQuestion && (
              <div className="rolling">
                <CreateQuestionPage />
              </div>
            )}
          </div>

          {threads.map((thread) => (
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
                  {thread.answer.slice(0, 150)}
                  {thread.answer.length > 100 ? "..." : ""}
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
                      <span className="date">{timeAgo(thread.created_at)}</span>
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
                  <p className="view-message">
                    Click to view detailed answer and information
                  </p>
                  <div className="thread-views">
                    <i className="fa-solid fa-eye"></i>
                    <span>{thread.impressions || 0}</span>
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
          </div>
        </section>
        <section className="right-sidebar">
          <div className="Side-bar-cards">
            <div className="editors-choices">
              <div className="card">
                <img src="editors-choice-1.png" alt="Editor's Choice 1" />
                <div className="card-details">
                  <h4>Editors Choice</h4>
                  <p>Description of Editors Choice </p>
                </div>
              </div>
            </div>
          </div>

          <div className="Side-bar-cards">
            <div className="most-liked">
              <div className="card">
                <img src="editors-choice-1.png" alt="Editor's Choice 1" />
                <div className="card-details">
                  <h4>Most Upvoted</h4>
                  <p>Description of Most Upvoted </p>
                </div>
              </div>
            </div>
          </div>

          <div className="Side-bar-cards">
            <div className="top-companies">
              <div className="card">
                <img src="editors-choice-1.png" alt="Editor's Choice 1" />
                <div className="card-details">
                  <h4>Top Companies</h4>
                  <p>Description of Top Companies </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* </aside> */}
      </div>
    </div>
  );
};

export default MainComponent;
