import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useTheme } from '../../ThemeContext';
import { Link } from 'react-router-dom';
import './AboutUs.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuoteLeft } from '@fortawesome/free-solid-svg-icons';

const AboutUs = () => {
  const { isDarkMode } = useTheme();

  // Ref, controls, and inView for each section
  const [visionRef, visionInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const visionControls = useAnimation();

  const [featuresRef, featuresInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const featuresControls = useAnimation();

  const [missionRef, missionInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const missionControls = useAnimation();

  useEffect(() => {
    if (visionInView) visionControls.start('visible');
    if (featuresInView) featuresControls.start('visible');
    if (missionInView) missionControls.start('visible');
  }, [visionInView, featuresInView, missionInView, visionControls, featuresControls, missionControls]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <div className={`about-us-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <section className="about-us-hero">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          The One University
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          Empowering students by providing comprehensive, centralized campus placement resources designed to enhance their career readiness
        </motion.p>
      </section>

      <motion.section
        className="about-us-vision"
        ref={visionRef}
        initial="hidden"
        animate={visionControls}
        variants={sectionVariants}
      >
        <h2>Our Vision</h2>
        <div className="about-us-vision-grid">
          {[
            { title: "Centralized Resources", description: "Providing a one-stop platform for all campus placement needs" },
            { title: "Equal Opportunities", description: "Ensuring every student has access to comprehensive preparation materials" },
            { title: "Industry Alignment", description: "Bridging the gap between academic learning and industry requirements" },
            { title: "Community Building", description: "Fostering a network of well-prepared and confident job seekers" }
          ].map((item, index) => (
            <motion.div
              key={index}
              className="about-us-vision-item"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section
        className="about-us-cta"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2>Ready to ace your interview?</h2>
        <p>
          <FontAwesomeIcon icon={faQuoteLeft} />&nbsp;
          The only interview question you need to prepare for is the one you haven't thought of yet.
        </p>
        <Link to="/questions" className="about-us-cta-button">
          Explore Questions
        </Link>
      </motion.section>

      <motion.section
        className="about-us-mission"
        ref={missionRef}
        initial="hidden"
        animate={missionControls}
        variants={sectionVariants}
      >
        <h2>Our Mission</h2>
        <div className="about-us-mission-content">
          <p>One University is committed to revolutionizing campus placements by providing a centralized platform for interview preparation. We aim to enhance students' readiness, boost their confidence, and ultimately increase their chances of securing their dream jobs. By fostering a collaborative environment where knowledge is shared and experiences are learned from, we're building a stronger, more prepared workforce of tomorrow.</p>
          <div className="about-us-mission-stats">
            {[
              { number: "1000+", text: "Questions Answered" },
              { number: "500+", text: "Senior Experiences" },
              { number: "50+", text: "Companies Covered" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="about-us-stat-item"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <h3>{stat.number}</h3>
                <p>{stat.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default AboutUs;
