// src/components/Communities/JoinCommunity.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faUsers,
  faChevronDown,
  faChevronUp,
  faTimes,
  faSpinner,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";
import "./JoinCommunity.css";

const JoinCommunity = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedCommunity, setExpandedCommunity] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm) {
        fetchCommunities(searchTerm);
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const fetchCommunities = async (term) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/communities/search?query=${term}`
      );
      setSearchResults(response.data);
    } catch (error) {
      console.error("Error fetching communities:", error);
      setError("Failed to fetch communities. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (communityId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/communities/${communityId}/join`,
        {},
        { withCredentials: true }
      );
      setSearchResults((prevResults) =>
        prevResults.map((community) =>
          community._id === communityId
            ? { ...community, isJoined: true }
            : community
        )
      );
    } catch (error) {
      console.error("Error joining community:", error);
      setError("Failed to join the community. Please try again.");
    }
  };

  return (
    <motion.div
      className="joincommunity-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      <motion.h1
        className="joincommunity-title"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        Join a Community
      </motion.h1>
      <motion.div
        className="joincommunity-search"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.2 } }}
      >
        <FontAwesomeIcon
          icon={faSearch}
          className="joincommunity-search-icon"
        />
        <input
          type="text"
          placeholder="Search for communities..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </motion.div>
      {loading && (
        <motion.div
          className="joincommunity-loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <FontAwesomeIcon icon={faSpinner} spin /> Searching communities...
        </motion.div>
      )}
      {error && (
        <motion.div
          className="joincommunity-error"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <FontAwesomeIcon icon={faExclamationCircle} /> {error}
        </motion.div>
      )}
      <AnimatePresence>
        {searchResults.map((community) => (
          <motion.div
            key={community._id}
            className="joincommunity-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            layout
          >
            <div
              className="joincommunity-card-header"
              onClick={() =>
                setExpandedCommunity(
                  expandedCommunity === community._id ? null : community._id
                )
              }
            >
              <h3>{community.name}</h3>
              <FontAwesomeIcon
                icon={
                  expandedCommunity === community._id
                    ? faChevronUp
                    : faChevronDown
                }
              />
            </div>
            <AnimatePresence>
              {expandedCommunity === community._id && (
                <motion.div
                  className="joincommunity-card-details"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <p>{community.description}</p>
                  <span>
                    <FontAwesomeIcon icon={faUsers} />{" "}
                    {community.members.length} members
                  </span>
                  {!community.isJoined ? (
                    <motion.button
                      onClick={() => handleJoin(community._id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Join Community
                    </motion.button>
                  ) : (
                    <span className="joincommunity-joined">Joined</span>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </AnimatePresence>
      {searchResults.length === 0 && searchTerm && !loading && (
        <motion.p
          className="joincommunity-no-results"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          No communities found. Try a different search term.
        </motion.p>
      )}
      <motion.button
        className="joincommunity-close"
        onClick={onClose}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <FontAwesomeIcon icon={faTimes} /> Close
      </motion.button>
    </motion.div>
  );
};

export default JoinCommunity;
