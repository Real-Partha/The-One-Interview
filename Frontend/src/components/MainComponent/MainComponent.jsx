// import React from "react";
import "./MainComponent.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

const MainComponent = () => {
  const navigate = useNavigate();
  const [threads, setThreads] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);

  useEffect(() => {
    fetchThreads(currentPage);
  }, [currentPage]);

  const fetchThreads = async (page) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/home/question`,
        {
          params: { page: page },
        }
      );
      setThreads(response.data.questions);
      setTotalPages(response.data.totalPages);
      setHasNextPage(response.data.hasNextPage);
      setHasPrevPage(response.data.hasPrevPage);
    } catch (error) {
      console.error("Error fetching threads:", error);
    }
  };

  function timeAgo(date) {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    if (seconds < 10){
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
  

  const handleRedirect = () => {
    navigate("/create-question");
  };

  const handleNextPage = () => {
    if (hasNextPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (hasPrevPage) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="main-content">
      <aside className="sidebar">
        <nav className="course-navigation">
          <div className="Left-Side-bar-cards">
            <div className="home_Section">
              {/* <h3>Editor's Choices</h3> */}
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
              {/* <h3>Editor's Choices</h3> */}
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
              {/* <h3>Editor's Choices</h3> */}
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
              {/* <h3>Editor's Choices</h3> */}
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
          <input
            type="text"
            placeholder="Add a new thread"
            className="add-thread-input"
          />
          <button className="add-thread-button" onClick={handleRedirect}>
            <i className="fa-solid fa-plus"></i>
          </button>
        </div>
        {threads.map((thread) => (
          <div key={thread._id} className="thread-card">
            <h3 className="thread-title">{thread.question}</h3>
            <div className="thread-info">
              <img
                src={thread.profile_pic || "/img/profile_pic.png"}
                alt="Profile"
                className="profile-pic"
              />
              <div className="thread-details">
                <p className="thread-meta">
                  <span className="username">{thread.username}</span> •{" "}
                  <span className="date">{timeAgo(thread.created_at)}</span>
                </p>
                <p className="thread-description">{thread.answer}</p>
                <div className="thread-tags">
                  {thread.tags.map((tag, index) => (
                    console.log(typeof tag),
                    <span key={index} className="tag">{'#'+tag.toLowerCase()}</span>
                  ))}
                </div>
                <p className="thread-category">
                  Category: <span>{thread.category || "Not specified"}</span>
                </p>
                <p className="thread-company">
                  Company: <span>{thread.company_name || "Not specified"}</span>
                </p>
              </div>
            </div>
            <div className="giving_responses">
              <button className="add-response">Add Comment</button>
              <div className="vote-buttons">
                <i className="fa-regular fa-thumbs-up"></i>
                <i className="fa-regular fa-thumbs-down"></i>
              </div>
            </div>
          </div>
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
        {/* <aside className="right-sidebar"> */}
        <div className="Side-bar-cards">
          <div className="editors-choices">
            {/* <h3>Editor's Choices</h3> */}
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
            {/* <h3>Editor's Choices</h3> */}
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
            {/* <h3>Editor's Choices</h3> */}
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
  );
};

export default MainComponent;
