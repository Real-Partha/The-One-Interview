// import React from "react";
import "./HomeQuestions.css";
import axios from "axios";
import { useEffect, useState, useCallback, useContext } from "react";
import { useTheme } from "../../ThemeContext";
import { Link } from "react-router-dom";
import CreateQuestionPage from "../Posts/CreateQuestionPage";
import { Typewriter } from "react-simple-typewriter";
import { debounce } from "lodash";
import { SearchContext } from "../context/SearchContext";
import ThreadSkeleton from "./threadskeleton";
import DOMPurify from "dompurify";
import Sidebar from "../Left Sidebar/Sidebar";
import MainLoader from "../commonPages/MainLoader";
import QuestionSearchLoader from "./QuestionSearchLoader";

const MainComponent = () => {
  const [threads, setThreads] = useState([]);
  const [currentPage, setCurrentPage] = useState(null);
  const [isquestionloading, setIsQuestionLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const { isDarkMode } = useTheme();
  const [showCreateQuestion, setShowCreateQuestion] = useState(false);
  const [inputPage, setInputPage] = useState("");
  const [searchMessage, setSearchMessage] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isMainLoading, setIsMainLoading] = useState(false);
  const [isSearchResultsVisible, setIsSearchResultsVisible] = useState(false);
  const { searchQuery, setSearchQuery } = useContext(SearchContext);

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

  useEffect(() => {
    const loadFirstThreads = async () => {
      setIsMainLoading(true);
      const savedPage = getPageWithExpiration();
      if (savedPage) {
        setCurrentPage(parseInt(savedPage, 10));
      } else {
        setCurrentPage(1);
      }
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIsMainLoading(false);
    };

    loadFirstThreads();

    return () => {
      setSearchQuery("");
    };
  }, [setSearchQuery]);

  const fetchThreads = useCallback(async (page) => {
    setIsQuestionLoading(true);
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
    } finally {
      setIsQuestionLoading(false);
    }
  }, []);

  const truncateHTML = (html, maxLength) => {
    const div = document.createElement("div");
    div.innerHTML = DOMPurify.sanitize(html);
    const text = div.textContent || div.innerText || "";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

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
    setPageWithExpiration("1");
  };

  const handleUserSearch = useCallback(
    async (query) => {
      if (!query) {
        setIsSearching(false);
        setIsSearchResultsVisible(false);
        setSearchQuery(""); // Reset the search query in context
        return fetchThreads(currentPage);
      }

      try {
        setIsSearching(true);
        setIsSearchResultsVisible(true);
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/questionsearch`,
          {
            params: { query: query },
            withCredentials: true,
          }
        );
        setThreads(response.data.questions);
        setTotalPages(response.data.totalPages);
        setHasNextPage(response.data.hasNextPage);
        setHasPrevPage(response.data.hasPrevPage);
        setCurrentPage(1); // Reset to first page of search results

        if (response.data.questions.length === 0) {
          setSearchMessage(`No results found for '${query}'`);
        } else {
          setSearchMessage(`Search Results for '${query}'`);
        }
      } catch (error) {
        console.error("Error fetching threads:", error);
        setSearchMessage(
          "An error occurred while searching. Please try again."
        );
      } finally {
        setIsSearching(false);
      }
    },
    [currentPage, fetchThreads]
  );

  useEffect(() => {
    const handleInitialLoad = async () => {
      if (!isMainLoading && currentPage !== null) {
        setIsQuestionLoading(true);
        try {
          if (searchQuery) {
            await handleUserSearch(searchQuery);
          } else {
            await fetchThreads(currentPage);
          }
        } catch (error) {
          console.error("Error loading data:", error);
        } finally {
          setIsQuestionLoading(false);
        }
      }
    };

    handleInitialLoad();
  }, [currentPage, fetchThreads, isMainLoading, searchQuery, handleUserSearch]);

  const toggleCreateQuestion = () => {
    setShowCreateQuestion((prev) => !prev);
  };

  useEffect(() => {
    return () => {
      setSearchQuery("");
    };
  }, [setSearchQuery]);

  if (isMainLoading)
    return (
      <div>
        <MainLoader />
      </div>
    );

  return (
    <div className={`${isDarkMode ? "dark-mode" : "light-mode"}`}>
      <div className={`main-content`}>
        <Sidebar />
        <section className="threads">
          {isSearching ? (
            <div>
              <QuestionSearchLoader />
            </div>
          ) : isSearchResultsVisible && searchQuery ? (
            <div className="search-results">
              <h2>{searchMessage}</h2>
              {threads.length === 0 && (
                <div className="no-results">
                  <i className="fas fa-search fa-3x"></i>
                  <p>No questions found for your search query.</p>
                  <p>
                    Try adjusting your search terms or explore other topics.
                  </p>
                </div>
              )}
            </div>
          ) : (
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
                onClick={toggleCreateQuestion}
              >
                <i className="fa-solid fa-plus"></i>
              </button>
            </div>
          )}
          <div
            className={`create-question-animation ${
              showCreateQuestion ? "show" : ""
            }`}
          >
            <CreateQuestionPage onClose={toggleCreateQuestion} />
          </div>

          {isquestionloading
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
              Page {threads.length > 0 ? currentPage : 0} of {totalPages}
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
        <section className="right-sidebar">
          <div className="Side-bar-cards">
            <div className="editors-choices">
              <div className="right-card">
                <img src="/img/ec.png" alt="Editor's Choice 1" />
                <div className="card-details">
                  <h4>Editors Choice</h4>
                  <p>Description of Editors Choice </p>
                </div>
              </div>
            </div>
          </div>

          <div className="Side-bar-cards">
            <div className="most-liked">
              <Link to="/most-upvoted">
                <div className="right-card">
                  <img src="img/mliked.png" alt="Most-Liked" />

                  <div className="card-details">
                    <h4> Most Upvoted</h4>
                    <p>Description of Most Upvoted </p>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          <div className="Side-bar-cards">
            <div className="top-companies">
              <div className="right-card">
                <img src="img/TopComp.png" alt="Editor's Choice 1" />
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
