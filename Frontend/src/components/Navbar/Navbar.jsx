import React, { useState } from "react";
import "./NavBar.css";

const NavBar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-left">
          <img
            className="logo"
            src="../../../public/img/WhatsApp Image 2024-08-19 at 00.45.45_158b68e7.jpg"
            alt="logo"
          />
          <span className="university-name">The One Interview</span>
        </div>
        <div className="navbar-center">
          <input
            type="text"
            placeholder="Type to search"
            className="search-input"
          />
          <button className="search-button">
            <i className="fas fa-search"></i>
          </button>
        </div>
        <div className="navbar-right">
          <a href="#" className="nav-link">
            Login
          </a>
          <a href="#" className="nav-link">
            Register
          </a>
         <i className="notifications fa fa-bell"></i>
          <i
            className="fas fa-user-circle profile"
            onClick={toggleSidebar}
          ></i>
          {/* <i className="fas fa-sun"></i>
          <i className="fas fa-moon"></i> */}
        </div>
      </nav>

      {isSidebarOpen && (
        <aside className="right-sidebar">
          <div className="lecturer-info">
            <img
              src="lecturer-pic.png"
              alt="Lecturer"
              className="lecturer-pic"
            />
            <h4>Dr. Ronald Jackson</h4>
            <p>Main Lecturer</p>
            <p>+48 550 233 553</p>
            <p>ronald.jackson@uniec.pl</p>
          </div>
          <div className="attendees-list">
            {/* List of attendees here */}
          </div>
        </aside>
      )}
    </div>
  );
};

export default NavBar;
