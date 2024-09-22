import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLink, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '../../ThemeContext';
import './ProfilePreview.css';

const ProfilePreview = ({ user, onClose }) => {
  const { isDarkMode } = useTheme();

  return (
    <AnimatePresence>
      <motion.div
        className={`ProfilePreview-overlay ${isDarkMode ? 'dark' : 'light'}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="ProfilePreview"
          initial={{ opacity: 0, scale: 0.5, y: -50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: -50 }}
          transition={{ type: 'spring', damping: 15 }}
          onClick={(e) => e.stopPropagation()}
        >
          <motion.button
            className="ProfilePreview-close"
            onClick={onClose}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            <FontAwesomeIcon icon={faTimes} />
          </motion.button>
          <motion.div
            className="ProfilePreview-imageWrapper"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 20 }}
          >
            <img
              src={user.profilePicture || '/img/default_avatar.png'}
              alt={user.username}
              className="ProfilePreview-pic"
            />
          </motion.div>
          <motion.h2
            className="ProfilePreview-username"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <FontAwesomeIcon icon={faUser} /> {user.username}
          </motion.h2>
          <motion.p
            className="ProfilePreview-bio"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <FontAwesomeIcon icon={faEnvelope} /> {user.bio}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Link to={`/users/${user.username}`} className="ProfilePreview-link">
              <FontAwesomeIcon icon={faLink} /> View Full Profile
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProfilePreview;
