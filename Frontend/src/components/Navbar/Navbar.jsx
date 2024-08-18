import React from "react";
import "./NavBar.css";

const NavBar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img className="logo" src="../../../public/img/WhatsApp Image 2024-08-19 at 00.45.45_158b68e7.jpg" alt="logo"/>
        <span className="university-name">The One Interview</span>
      </div>
      <div className="navbar-center">
        <input type="text" placeholder="Type to search" className="search-input" />
        <button className="search-button">
          <i className="fas fa-search"></i>
        </button>
      </div>
      <div className="navbar-right">
        <a href="#" className="nav-link active">Link1</a>
        <a href="#" className="nav-link active">Link2</a>
        <a href="#" className="nav-link active">Link3</a>
        <a href="#" className="nav-link">Login</a>
        <a href="#" className="nav-link">Register</a>
      </div>
    </nav>
  );
};

export default NavBar;
