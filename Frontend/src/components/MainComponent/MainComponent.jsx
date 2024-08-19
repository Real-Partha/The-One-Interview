// import React from "react";
import "./MainComponent.css";

const MainContent = () => {
  return (
    <div className="main-content">
      <aside className="sidebar">
        <nav className="course-navigation">
        
          <a href="Home">Home</a>
            <a href="Courses">Questions</a>
            <a href="Interviews">Tags</a>
            <a href="Following">Following</a>
        </nav>
        <button className="join-class">Join a new Community</button>
      </aside>
      <section className="threads">
        <div className="thread-card">
          <h3 className="thread-title">Electric Pe Interview Experience</h3>
          <div className="thread-info">
            <img src="profile-pic.png" alt="Profile" className="profile-pic" />
            <div className="thread-details">
              <p>Dedipya Goswami • 6h ago • Technical Interview - 1</p>
              <p className="thread-description">
                lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
          </div>
          <button className="add-response">Add Comment</button>
        </div>
        <div className="thread-card">
          <h3 className="thread-title">Western Digital Interview Experience</h3>
          <div className="thread-info">
            <img src="profile-pic.png" alt="Profile" className="profile-pic" />
            <div className="thread-details">
              <p>Partha Pratim Paul • 3d ago • Tech Rounds</p>
              <p className="thread-description">
                Clear ho gya bc. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
          </div>
          <button className="add-response">Add Comment</button>
        </div>
      </section>
      <aside className="right-sidebar">
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

          
      </aside>
    </div>
  );
};

export default MainContent;
