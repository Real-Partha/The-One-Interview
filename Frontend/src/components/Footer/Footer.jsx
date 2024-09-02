import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../ThemeContext';
import './Footer.css';

const Footer = () => {
  const [emailInput, setEmailInput] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { isDarkMode } = useTheme();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (emailInput) {
      setIsSubmitted(true);
      setEmailInput('');
      setTimeout(() => setIsSubmitted(false), 3000);
    }
  };

  return (
    <footer className={`footer ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <div className="footer-content">
        <div className="footer-section One-info">
          <h3>The One Interview</h3>
          <p>Empowering job seekers with expert interview preparation and career guidance since 2024.</p>
          <div className="social-icons">
            <motion.a href="#" whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}><i className="fab fa-linkedin"></i></motion.a>
            <motion.a href="#" whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}><i className="fab fa-twitter"></i></motion.a>
            <motion.a href="#" whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}><i className="fab fa-facebook"></i></motion.a>
            <motion.a href="#" whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}><i className="fab fa-instagram"></i></motion.a>
          </div>
        </div>
        <div className="footer-section links">
          <h4>Company</h4>
          <ul>
            <li><Link to="/about-us">About Us</Link></li>
            <li><Link to="/team">Our Team</Link></li>
            <li><Link to="/careers">Careers</Link></li>
            <li><Link to="/press">Press</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
          </ul>
        </div>
        <div className="footer-section links">
          <h4>Resources</h4>
          <ul>
            <li><Link to="/blog">Blog</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
            <li><Link to="/testimonials">Testimonials</Link></li>
            <li><Link to="/partners">Partners</Link></li>
          </ul>
        </div>
        <div className="footer-section newsletter">
          <h4>Stay Updated</h4>
          <form onSubmit={handleSubmit}>
            <input 
              type="email" 
              placeholder="Your email address" 
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              required
            />
            <motion.button 
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Subscribe
            </motion.button>
          </form>
          <AnimatePresence>
            {isSubmitted && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="success-message"
              >
                Thanks for subscribing!
              </motion.p>
            )}
          </AnimatePresence>
          <p className="privacy-notice">By subscribing, you agree to our Privacy Policy and consent to receive updates from us.</p>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="legal-links">
          <Link to="/terms">Terms of Service</Link>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/cookies">Cookie Policy</Link>
          <Link to="/accessibility">Accessibility</Link>
        </div>
        <p>&copy; 2024 The One Interview. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
