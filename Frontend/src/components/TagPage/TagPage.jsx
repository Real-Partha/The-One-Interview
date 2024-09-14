// src/components/TagPage/TagPage.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../../ThemeContext";
import MainLoader from "../commonPages/MainLoader";
import "./TagPage.css";

const TagPage = () => {
  const [tags, setTags] = useState([]);
  const [filteredTags, setFilteredTags] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState(null);
  const [questions, setQuestions] = useState([]);
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchTags();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tag = params.get("tag");
    if (tag) {
      setSelectedTag(tag);
      fetchQuestionsByTag(tag);
    } else {
      setSelectedTag(null);
      setQuestions([]);
    }
  }, [location]);

  const fetchTags = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/tags`);
      const sortedTags = response.data.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      setTags(sortedTags);
      setFilteredTags(sortedTags);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching tags:", error);
      setLoading(false);
    }
  };

  const fetchQuestionsByTag = async (tag) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/tags/questions/${tag}`
      );
      setQuestions(response.data);
    } catch (error) {
      console.error("Error fetching questions by tag:", error);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = tags.filter((tag) =>
      tag.name.toLowerCase().includes(term)
    );
    setFilteredTags(filtered);
  };

  const handleTagClick = (tag) => {
    navigate(`/tags?tag=${tag}`);
  };

  const handleViewAllTags = () => {
    navigate("/tags");
  };

  const groupTagsByFirstLetter = (tags) => {
    return tags.reduce((acc, tag) => {
      const firstLetter = tag.name[0].toUpperCase();
      if (!acc[firstLetter]) {
        acc[firstLetter] = [];
      }
      acc[firstLetter].push(tag);
      return acc;
    }, {});
  };

  if (loading) {
    return <MainLoader />;
  }

  const groupedTags = groupTagsByFirstLetter(filteredTags);

  return (
    <div className={`tagpage ${isDarkMode ? "dark-mode" : ""}`}>
      <h1 className="tagpage-title">Tags</h1>
      {!selectedTag && (
        <input
          type="text"
          placeholder="Search tags..."
          value={searchTerm}
          onChange={handleSearch}
          className="tagpage-search"
        />
      )}
      {selectedTag ? (
        <div className="tagpage-questions">
          <h2>Questions tagged with "#{selectedTag}"</h2>
          <button onClick={handleViewAllTags} className="tagpage-view-all">
            View All Tags
          </button>
          {questions.map((question) => (
            <Link
              to={`/question/${question._id}`}
              key={question._id}
              className="tagpage-question-card"
            >
              <h3>{question.question}</h3>
              <p>
                Upvotes: {question.upvotes} | Answers: {question.commentscount}
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="tagpage-tags-container">
          {Object.entries(groupedTags).map(([letter, tags]) => (
            <div key={letter} className="tagpage-letter-group">
              <h2 className="tagpage-letter">{letter}</h2>
              <div className="tagpage-tags">
                {tags.map((tag) => (
                  <div
                    key={tag._id}
                    className="tagpage-tag"
                    onClick={() => handleTagClick(tag.name)}
                  >
                    <span className="tagpage-tag-name">#{tag.name}</span>
                    <span className="tagpage-tag-count">{tag.count}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {filteredTags.length === 0 && (
            <p className="tagpage-no-tags">No tags found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default TagPage;
