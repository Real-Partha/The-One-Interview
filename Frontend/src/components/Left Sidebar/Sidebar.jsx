import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = ({ page = "homepage", activeSection, handleSetActiveSection }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const renderHomepageSidebar = () => (
    <>
      <nav className="course-navigation">
        <div className="Left-Side-bar-cards">
          <Link to="/" className="home_Section">
            <div className="card">
              <i className="fa-solid fa-house" />
              <div className="card-details">
                <h4>Home</h4>
              </div>
            </div>
          </Link>
        </div>

        <div className="Left-Side-bar-cards">
          <Link to="/questions" className="questions_section">
            <div className="card">
              <i className="fa-solid fa-layer-group" />
              <div className="card-details">
                <h4>Questions</h4>
              </div>
            </div>
          </Link>
        </div>

        <div className="Left-Side-bar-cards">
          <Link to="/tags" className="tags_section">
            <div className="card">
              <i className="fa-solid fa-hashtag"></i>
              <div className="card-details">
                <h4>Tags</h4>
              </div>
            </div>
          </Link>
        </div>

        <div className="Left-Side-bar-cards">
          <Link to="/company-questions" className="company_names_section">
            <div className="card">
              <i className="fa-regular fa-building"></i>
              <div className="card-details">
                <h4>Corporate </h4>
              </div>
            </div>
          </Link>
        </div>

        <div className="Left-Side-bar-cards">
          <Link to="/interview-blogs" className="interview_blogs_section">
            <div className="card">
              <i className="fa-solid fa-layer-group" />
              <div className="card-details">
                <h4>Interview Blogs</h4>
              </div>
            </div>
          </Link>
        </div>
      </nav>
      <Link to="/communities" className="commnties_button">
        <button className="join-class">Join a Community</button>
      </Link>
    </>
  );

  const renderProfileSidebar = () => (
    <nav className="profile-navigation">
      <div
        className={`profile-sidebar-card ${
          activeSection === "profile" ? "active" : ""
        }`}
        onClick={() => handleSetActiveSection("profile")}
      >
        <i className="fa fa-user" />
        <div className="profile-card-details">
          <div className="profile-sidebar-menu-title">Profile</div>
        </div>
      </div>
      <div
        className={`profile-sidebar-card ${
          activeSection === "account" ? "active" : ""
        }`}
        onClick={() => handleSetActiveSection("account")}
      >
        <i className="fa fa-cog" />
        <div className="profile-card-details">
          <div className="profile-sidebar-menu-title">Account</div>
        </div>
      </div>
      <div
        className={`profile-sidebar-card ${
          activeSection === "activity" ? "active" : ""
        }`}
        onClick={() => handleSetActiveSection("activity")}
      >
        <i className="fa fa-clock" />
        <div className="profile-card-details">
          <div className="profile-sidebar-menu-title">Recent Activity</div>
        </div>
      </div>
      <div className="profile-sidebar-card">
        <i className="fa fa-paint-brush" />
        <div className="profile-card-details">
          <div className="profile-sidebar-menu-title">Appearance</div>
        </div>
      </div>
      <div className="profile-sidebar-card">
        <i className="fa fa-bell" />
        <div className="profile-card-details">
          <div className="profile-sidebar-menu-title">Notifications</div>
        </div>
      </div>
    </nav>
  );

  return (
    <aside className={page === "profile" ? "profile-sidebar" : "sidebar"}>
      {page === "profile" ? renderProfileSidebar() : renderHomepageSidebar()}
    </aside>
  );
};

export default Sidebar;
