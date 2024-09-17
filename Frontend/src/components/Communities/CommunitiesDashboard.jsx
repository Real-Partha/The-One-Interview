import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faStar,
  faPlus,
  faSearch,
  faUserPlus,
  faChartLine,
} from "@fortawesome/free-solid-svg-icons";
import "./CommunitiesDashboard.css";
import JoinCommunity from "./JoinCommunity";
import CreateCommunity from "./CreateCommunity";

const CommunitiesDashboard = () => {
  const [userCommunities, setUserCommunities] = useState([]);
  const [topCommunities, setTopCommunities] = useState([]);
  const [showJoinCommunity, setShowJoinCommunity] = useState(false);
  const [showCreateCommunity, setShowCreateCommunity] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchCommunities = async () => {
    try {
      const [userCommunitiesRes, topCommunitiesRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/communities/user`, {
          withCredentials: true,
        }),
        axios.get(`${import.meta.env.VITE_API_URL}/communities/top`),
      ]);
      setUserCommunities(userCommunitiesRes.data);
      setTopCommunities(topCommunitiesRes.data);
    } catch (error) {
      console.error("Error fetching communities:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunities();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5, staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  if (showJoinCommunity) {
    return (
      <JoinCommunity
        onClose={() => {
          setShowJoinCommunity(false);
          fetchCommunities();
        }}
      />
    );
  }

  if (showCreateCommunity) {
    return (
      <CreateCommunity
        onClose={() => {
          setShowCreateCommunity(false);
          fetchCommunities();
        }}
      />
    );
  }
  return (
    <motion.div
      className="communities-dashboard"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1
        className="communities-dashboard-title"
        variants={itemVariants}
      >
        Communities Dashboard
      </motion.h1>
      <motion.div
        className="communities-dashboard-actions"
        variants={itemVariants}
      >
        <motion.button
          className="communities-dashboard-button communities-dashboard-join"
          onClick={() => setShowJoinCommunity(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FontAwesomeIcon icon={faUserPlus} /> Join a Community
        </motion.button>
        <motion.button
          className="communities-dashboard-button communities-dashboard-create"
          onClick={() => setShowCreateCommunity(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FontAwesomeIcon icon={faPlus} /> Create a Community
        </motion.button>
      </motion.div>
      <motion.div
        className="communities-dashboard-content"
        variants={containerVariants}
      >
        <motion.div
          className="communities-dashboard-section your-communities"
          variants={itemVariants}
        >
          <h2>
            <FontAwesomeIcon icon={faUsers} /> Your Communities
          </h2>
          {loading ? (
            <p className="communities-dashboard-loading">
              Loading your communities...
            </p>
          ) : userCommunities.length > 0 ? (
            <AnimatePresence>
              {userCommunities.map((community) => (
                <motion.div
                  key={community._id}
                  className="communities-dashboard-card"
                  whileHover={{ scale: 1.03 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link to={`/communities/${community._id}`}>
                    <h3>{community.name}</h3>
                    <p>{community.description}</p>
                    <span>
                      <FontAwesomeIcon icon={faUsers} />{" "}
                      {community.members.length} members
                    </span>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          ) : (
            <p className="communities-dashboard-empty">
              You are not yet part of any community. Join one now!
            </p>
          )}
        </motion.div>
        <motion.div
          className="communities-dashboard-section top-communities"
          variants={itemVariants}
        >
          <h2>
            <FontAwesomeIcon icon={faChartLine} /> Top Communities
          </h2>
          {loading ? (
            <p className="communities-dashboard-loading">
              Loading top communities...
            </p>
          ) : topCommunities.length > 0 ? (
            <AnimatePresence>
              {topCommunities.map((community) => (
                <motion.div
                  key={community._id}
                  className="communities-dashboard-card"
                  whileHover={{ scale: 1.03 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link to={`/communities/${community._id}`}>
                    <h3>{community.name}</h3>
                    <p>{community.description}</p>
                    <span>
                      <FontAwesomeIcon icon={faUsers} />{" "}
                      {community.members.length} members
                    </span>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          ) : (
            <p className="communities-dashboard-empty">
              No communities exist yet. Be the first to create one!
            </p>
          )}
        </motion.div>
      </motion.div>
      {showJoinCommunity && (
        <JoinCommunity onClose={() => setShowJoinCommunity(false)} />
      )}
      {showCreateCommunity && (
        <CreateCommunity onClose={() => setShowCreateCommunity(false)} />
      )}
    </motion.div>
  );
};

export default CommunitiesDashboard;
