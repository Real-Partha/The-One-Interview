import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = ({ page = "homepage", activeSection, handleSetActiveSection }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const renderSidebarItems = () => {
    if (page === "homepage") {
      return [
        { to: "/", icon: "fa-solid fa-house", title: "Home" },
        { to: "/questions", icon: "fa-solid fa-layer-group", title: "Questions" },
        { to: "/tags", icon: "fa-solid fa-hashtag", title: "Tags" },
        { to: "/company-questions", icon: "fa-regular fa-building", title: "Corporate" },
        { to: "/interview-blogs", icon: "fa-solid fa-layer-group", title: "Interview Blogs" },
      ];
    } else {
      return [
        { section: "profile", icon: "fa fa-user", title: "Profile" },
        { section: "account", icon: "fa fa-cog", title: "Account" },
        { section: "activity", icon: "fa fa-clock", title: "Recent Activity" },
        { section: "appearance", icon: "fa fa-paint-brush", title: "Appearance" },
        { section: "notifications", icon: "fa fa-bell", title: "Notifications" },
      ];
    }
  };

  return (
    <aside className="sidebar">
      <nav className="course-navigation">
        {renderSidebarItems().map((item, index) => (
          <div key={index} className="Left-Side-bar-cards">
            {page === "homepage" ? (
              <Link to={item.to} className={`${item.title.toLowerCase()}_section`}>
                <div className="card">
                  <i className={item.icon} />
                  <div className="card-details">
                    <h4>{item.title}</h4>
                  </div>
                </div>
              </Link>
            ) : (
              <div
                className={`card ${activeSection === item.section ? "active" : ""}`}
                onClick={() => handleSetActiveSection(item.section)}
              >
                <i className={item.icon} />
                <div className="card-details">
                  <h4>{item.title}</h4>
                </div>
              </div>
            )}
          </div>
        ))}
      </nav>
      {page === "homepage" && (
        <Link to="/communities" className="commnties_button">
          <button className="join-class">Join a Community</button>
        </Link>
      )}
    </aside>
  );
};

export default Sidebar;
