// HomeComponent.jsx

import { Link } from 'react-router-dom';
import './HomeComponent.css';

const HomeComponent = () => {
  return (
    <div className="home-container">
      <aside className="sidebar">
        <nav className="course-navigation">
          {/* Left sidebar content (same as MainComponent) */}
          <div className="Left-Side-bar-cards">
            <Link to="/" className="home_Section">
              <div className="card">
                <i className="fa fa-home" />
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
          {/* Add other sidebar items */}
        </nav>
      </aside>
      
      <main className="home-content">
        <h1>Welcome to The One Interview</h1>
        
        <section className="feature-carousel">
          <h2>Our Features</h2>
          <div className="carousel">
            <div className="carousel-item">
              <i className="fas fa-check-circle"></i>
              <h3>All Questions Answered</h3>
              <p>Get comprehensive answers to all your interview questions.</p>
            </div>
            <div className="carousel-item">
              <i className="fas fa-star"></i>
              <h3>Quality Interview Questions</h3>
              <p>Access a curated list of high-quality interview questions.</p>
            </div>
            <div className="carousel-item">
              <i className="fas fa-users"></i>
              <h3>Senior Experiences</h3>
              <p>Learn from the interview experiences of industry seniors.</p>
            </div>
            <div className="carousel-item">
              <i className="fas fa-building"></i>
              <h3>Company-wise Filters</h3>
              <p>Find questions filtered by company and interview round.</p>
            </div>
          </div>
        </section>
        
        <section className="feature-cards">
          <div className="feature-card">
            <h3>Online Tests</h3>
            <p>Practice with our comprehensive online test simulations.</p>
          </div>
          <div className="feature-card">
            <h3>Aptitude Tests</h3>
            <p>Sharpen your aptitude skills with our specialized tests.</p>
          </div>
          <div className="feature-card">
            <h3>Technical Rounds</h3>
            <p>Prepare for technical interviews with our extensive question bank.</p>
          </div>
          <div className="feature-card">
            <h3>HR Rounds</h3>
            <p>Get ready for HR interviews with our curated questions and tips.</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomeComponent;
