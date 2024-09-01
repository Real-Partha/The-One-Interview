import { Link } from "react-router-dom";
import "./Sidebar.css";

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
    </aside>
  );
};

export default Sidebar;
