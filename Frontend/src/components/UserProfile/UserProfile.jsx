// UserProfile.jsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faInstagram, faGithub } from '@fortawesome/free-brands-svg-icons';
import { faUser, faHeart, faThumbsUp, faThumbsDown, faUserPlus, faQuestion, faMars, faVenus, faGenderless, faCheck } from '@fortawesome/free-solid-svg-icons';
import './UserProfile.css';
import { useNavigate } from 'react-router-dom';
import ScrollToTop from './ScrolltoTop';

const UserProfile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likeAnimation, setLikeAnimation] = useState(false);
  const [followAnimation, setFollowAnimation] = useState(false);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState('posted');
  const { username } = useParams();

  const [userQuestions, setUserQuestions] = useState([]);
  const [topQuestions, setTopQuestions] = useState([]);

  const navigate = useNavigate();


  const handleQuestionClick = (questionId) => {
    navigate(`/question/${questionId}`);
  };


  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/${username}`, {
          withCredentials: true
        });
        setUserProfile(response.data);
        setIsLiked(response.data.isLiked || false);
        setIsFollowing(response.data.isFollowing || false);
        setLoading(false);
      } catch (err) {
        setError(`Error fetching user profile: ${err.message}`);
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [username]);
  

  

  useEffect(() => {
    const fetchUserQuestions = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/${username}/questions`);
        setUserQuestions(response.data);
      } catch (err) {
        console.error('Error fetching user questions:', err);
        setError(`Error fetching user questions: ${err.response?.data?.message || err.message}`);
      }
    };

    const fetchTopQuestions = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/${username}/top-questions`);
        setTopQuestions(response.data);
      } catch (err) {
        console.error('Error fetching top questions:', err);
        setError(`Error fetching top questions: ${err.response?.data?.message || err.message}`);
      }
    };

    fetchUserQuestions();
    fetchTopQuestions();
  }, [username]);


  const debounceLike = useCallback((func) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, 300);
    };
  }, []);

  const handleLike = debounceLike(async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/${username}/like`, {}, {
        withCredentials: true
      });
      setIsLiked(response.data.isLiked);
      setUserProfile(prev => ({
        ...prev,
        profileLikes: response.data.profileLikes
      }));
      setLikeAnimation(true);
      setTimeout(() => setLikeAnimation(false), 1000);
    } catch (error) {
      console.error('Error liking profile:', error);
    }
  });


  const truncateQuestions = (question, maxLength = 120) => {
    // Remove HTML tags
    const plainText = question.replace(/<[^>]*>/g, '');
  
    if (plainText.length <= maxLength) return plainText;
    return plainText.substr(0, maxLength) + '...';
  };
  

  const truncateAnswer = (answer, maxLength = 105) => {
    // Remove HTML tags
    const plainText = answer.replace(/<[^>]*>/g, '');

    if (plainText.length <= maxLength) return plainText;
    return plainText.substr(0, maxLength) + '...';
  };


  const handleFollow = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/${username}/follow`, {}, {
        withCredentials: true
      });
      setIsFollowing(response.data.isFollowing);
      setUserProfile(prev => ({
        ...prev,
        followers: response.data.followers
      }));
      setFollowAnimation(true);
      setTimeout(() => setFollowAnimation(false), 1000);
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
        yoyo: Infinity,
      },
    },
    tap: {
      scale: 0.95,
    },
  };

  const likeButtonVariants = {
    liked: {
      backgroundColor: '#ff6b6b',
      color: 'white',
      transition: {
        duration: 0.3,
      },
    },
    unliked: {
      backgroundColor: '#f0f0f0',
      color: '#ff6b6b',
      transition: {
        duration: 0.3,
      },
    },
  };

  const followButtonVariants = {
    following: {
      backgroundColor: '#4CAF50',
      color: 'white',
      transition: {
        duration: 0.3,
      },
    },
    notFollowing: {
      backgroundColor: '#6c63ff',
      color: 'white',
      transition: {
        duration: 0.3,
      },
    },
  };


  const getGenderIcon = (gender) => {
    if (!gender) return "";
    switch (gender.toLowerCase()) {
      case 'male':
        return faMars;
      case 'female':
        return faVenus;
      default:
        return faGenderless;
    }
  };
  

  if (loading) return <div className="UserProfile-loading">Loading...</div>;
  if (error) return <div className="UserProfile-error">{error}</div>;
  if (!userProfile) return <div className="UserProfile-notFound">User not found</div>;

  return (
    <motion.div
    className="UserProfile-container"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    <motion.div
      className="UserProfile-banner"
      initial={{ height: 0 }}
      animate={{ height: '350px' }}
      transition={{ duration: 0.5 }}
    >
      <img src={userProfile.bannerPicture} alt="Banner" className="UserProfile-bannerImage" />
    </motion.div>
    <div className="UserProfile-content">
      <div className="UserProfile-header">
        <motion.img
          src={userProfile.profilePicture}
          alt="Profile"
          className="UserProfile-profilePicture"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 260, damping: 20 }}
        />
        <motion.div
          className="UserProfile-info"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <div className="UserProfile-nameWrapper">
            <h1 className="UserProfile-name">{userProfile.name}</h1>
            <FontAwesomeIcon icon={getGenderIcon(userProfile.gender)} className="UserProfile-genderIcon" />
          </div>
          <p className="UserProfile-username">@{userProfile.username}</p>
          <p className="UserProfile-bio">{userProfile.bio}</p>
        </motion.div>
        <motion.div className="UserProfile-actions">
      


<motion.button
  className={`UserProfile-likeButton ${isLiked ? 'liked' : ''}`}
  onClick={handleLike}
  variants={buttonVariants}
  whileHover="hover"
  whileTap="tap"
  animate={isLiked ? 'liked' : 'unliked'}
  initial="unliked"
>
  <motion.div
    className="button-content"
    animate={{ rotate: isLiked ? [0, -45, 45, 0] : 0 }}
    transition={{ duration: 0.5 }}
  >
    <FontAwesomeIcon icon={faHeart} />
    <span>{isLiked ? 'Liked' : 'Like'}</span>
  </motion.div>

        <AnimatePresence>
          {likeAnimation && (
            <motion.div
              className="heart-burst"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.5, 0] }}
              exit={{ scale: 0 }}
              transition={{ duration: 0.5 }}
            >
              {Array(18).fill().map((_, i) => (
                <motion.div
                  key={i}
                  className="heart-particle"
                  initial={{ x: 0, y: 0 }}
                  animate={{
                    x: Math.cos(i * Math.PI / 4) * 50,
                    y: Math.sin(i * Math.PI / 4) * 50,
                    opacity: 0,
                  }}
                  transition={{ duration: 0.5 }}
                >
                  ❤️
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
      <motion.button
  className={`UserProfile-followButton ${isFollowing ? 'following' : ''}`}
  onClick={handleFollow}
  variants={buttonVariants}
  whileHover="hover"
  whileTap="tap"
  animate={isFollowing ? 'following' : 'notFollowing'}
  initial="notFollowing"
>
  <motion.div
    className="button-content"
    animate={{ y: isFollowing ? [-30, 0] : 0 }}
    transition={{ duration: 0.3 }}
  >
    <FontAwesomeIcon icon={isFollowing ? faCheck : faUserPlus} />
    <span>{isFollowing ? 'Following' : 'Follow'}</span>
  </motion.div>
        <AnimatePresence>
          {followAnimation && (
            <motion.div
              className="follow-burst"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="follow-circle"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [1, 0.5, 0],
                }}
                transition={{ duration: 0.5 }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </motion.div>
        </div>
        <motion.div
          className="UserProfile-socialLinks"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.5 }}
        >
          {userProfile.linkedin && (
            <a href={userProfile.linkedin} target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faLinkedin} />
            </a>
          )}
          {userProfile.instagram && (
            <a href={userProfile.instagram} target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faInstagram} />
            </a>
          )}
          {userProfile.github && (
            <a href={userProfile.github} target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faGithub} />
            </a>
          )}
        </motion.div>


        <motion.div
          className="UserProfile-stats"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          <div className="UserProfile-stat">
            <FontAwesomeIcon icon={faUser} />
            <span>{userProfile.followers}</span>
            <p>Followers</p>
          </div>
          <div className="UserProfile-stat">
            <FontAwesomeIcon icon={faHeart} />
            <span>{userProfile.profileLikes}</span>
            <p>Profile Likes</p>
          </div>
          <div className="UserProfile-stat">
            <FontAwesomeIcon icon={faThumbsUp} />
            <span>{userProfile.totalPostUpvotes}</span>
            <p>Total Upvotes</p>
          </div>
        </motion.div>
        <motion.div
          className="UserProfile-questionTabs"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.7, duration: 0.5 }}
        >
          <button
            className={activeTab === 'posted' ? 'active' : ''}
            onClick={() => setActiveTab('posted')}
          >
            Questions Posted
          </button>
          <button
            className={activeTab === 'upvoted' ? 'active' : ''}
            onClick={() => setActiveTab('upvoted')}
          >
            Most Upvoted Questions
          </button>
        </motion.div>
        <motion.div
          className="UserProfile-questionList"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.9, duration: 0.5 }}
        >
          {error && <div className="UserProfile-error">{error}</div>}
          {activeTab === 'posted' ? (
            <div>
              <h2><FontAwesomeIcon icon={faQuestion} /> Questions Posted</h2>
              {userQuestions.length > 0 ? (
                <div className="UserProfile-questionGrid">
                  {userQuestions.map((question, index) => (
                    <div
                      key={question._id || index}
                      className="UserProfile-questionCard"
                      onClick={() => handleQuestionClick(question._id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <h3>{question.question}</h3>
                      <p>{truncateAnswer(question.answer)}</p>
                      <div className="UserProfile-questionMeta">
                        <span className="UserProfile-category">Category: {question.category}</span>
                        <span className="UserProfile-level">Level: {question.level}</span>
                      </div>
                      <div className="UserProfile-votes">
                        <span className="UserProfile-upvotes">
                          <FontAwesomeIcon icon={faThumbsUp} /> {question.upvotes}
                        </span>
                        <span className="UserProfile-downvotes">
                          <FontAwesomeIcon icon={faThumbsDown} /> {question.downvotes}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No questions posted yet.</p>
              )}
            </div>
          ) : (
            <div>
              <h2><FontAwesomeIcon icon={faThumbsUp} /> Most Upvoted Questions</h2>
              {topQuestions.length > 0 ? (
                <div className="UserProfile-questionGrid">
                  {topQuestions.map((question, index) => (
                    <div
                      key={question._id || index}
                      className="UserProfile-questionCard"
                      onClick={() => handleQuestionClick(question._id)}
                      style={{ cursor: 'pointer' }}
                    >                 <h3>{truncateQuestions(question.question)}</h3>

                      <p>{truncateAnswer(question.answer)}</p>
                      <div className="UserProfile-questionMeta">
                        <span className="UserProfile-category">Category: {question.category}</span>
                        <span className="UserProfile-level">Level: {question.level}</span>
                      </div>
                      <div className="UserProfile-votes">
                        <span className="UserProfile-upvotes">
                          <FontAwesomeIcon icon={faThumbsUp} /> {question.upvotes}
                        </span>
                        <span className="UserProfile-downvotes">
                          <FontAwesomeIcon icon={faThumbsDown} /> {question.downvotes}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No upvoted questions found.</p>
              )}
            </div>
          )}
        </motion.div>
      </div>
      <ScrollToTop />
    </motion.div>
  );
};

export default UserProfile;
