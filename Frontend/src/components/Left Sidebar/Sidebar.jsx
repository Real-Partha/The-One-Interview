import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <aside className="sidebar">
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

        <div className="Left-Side-bar-cards">
          <div className="questions_section">
            <div className="card">
              <i className="fa-solid fa-layer-group" />
              <div className="card-details">
                <h4>Interview Blogs</h4>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <button className="join-class">Join a new Community</button>
    </aside>
  );
};

export default Sidebar;
