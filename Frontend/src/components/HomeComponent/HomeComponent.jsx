import { useState, useEffect } from 'react';
import NavBar from '../Navbar/Navbar';
import './HomeComponent.css';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { FaQuestionCircle, FaClipboardCheck, FaUserGraduate, FaBuilding, FaLightbulb, FaChartLine, FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const HomeComponent = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [activeFeature, setActiveFeature] = useState(null);
  const [currentInsight, setCurrentInsight] = useState(0);

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const carouselImages = [
    '/img/banner1.png',
    '/img/banner2.png',
    '/img/carousel-3.jpg',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % carouselImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  const features = [
    { 
      title: "All Questions Answered", 
      description: "Access a comprehensive database of interview questions and answers",
      icon: <FaQuestionCircle />,
      color: "#FF6B6B"
    },
    { 
      title: "Quality Interview Questions", 
      description: "Curated questions to help you prepare for any interview scenario",
      icon: <FaClipboardCheck />,
      color: "#4ECDC4"
    },
    { 
      title: "Interview Experiences", 
      description: "Learn from the experiences of successful candidates",
      icon: <FaUserGraduate />,
      color: "#45B7D1"
    },
    { 
      title: "Company-wise Filters", 
      description: "Tailored questions for various companies and exam rounds",
      icon: <FaBuilding />,
      color: "#F7B731"
    },
  ];

  const interviewInsights = [
    {
      company: "Google",
      logo: "/img/google-logo.png",
      experience: "Challenging but rewarding process focusing on problem-solving skills.",
      topQuestion: "Design a system that can handle millions of concurrent users.",
      icon: <FaLightbulb />
    },
    {
      company: "Facebook",
      logo: "/img/facebook-logo.png",
      experience: "Emphasis on cultural fit and ability to work in a fast-paced environment.",
      topQuestion: "How would you improve Facebook's news feed algorithm?",
      icon: <FaChartLine />
    },
    {
      company: "Amazon",
      logo: "/img/amazon-logo.png",
      experience: "Strong focus on leadership principles and behavioral questions.",
      topQuestion: "Describe a time when you had to make a difficult decision.",
      icon: <FaUserGraduate />
    },
  ];

  const nextInsight = () => {
    setCurrentInsight((prev) => (prev + 1) % interviewInsights.length);
  };

  const prevInsight = () => {
    setCurrentInsight((prev) => (prev - 1 + interviewInsights.length) % interviewInsights.length);
  };

  return (
    <div className="homepage">
      <NavBar />
      <main>
        <section className="hero">
          <motion.div
            className="carousel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {carouselImages.map((image, index) => (
              <motion.div
                key={index}
                className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: index === currentSlide ? 1 : 0 }}
                transition={{ duration: 0.5 }}
              >
                <img src={image} alt={`Carousel ${index + 1}`} />
                <div className="carousel-content">
                  <h1>Welcome to The One Interview</h1>
                  <p>Your ultimate platform for interview preparation</p>
                  <Link to="/questions">
                    <motion.button
                      className="cta-button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Get Started
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <motion.section
          className="features"
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <motion.h2 variants={itemVariants}>Our Features</motion.h2>
          <div className="feature-grid">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="feature-card"
                variants={itemVariants}
                whileHover={{ scale: 1.05, boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)" }}
                onClick={() => setActiveFeature(feature)}
              >
                <div className="feature-icon" style={{ color: feature.color }}>{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </motion.div>
            ))}
          </div>
          <AnimatePresence>
            {activeFeature && (
              <motion.div
                className="feature-modal"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <h3>{activeFeature.title}</h3>
                <p>{activeFeature.description}</p>
                <button onClick={() => setActiveFeature(null)}>Close</button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        <motion.section
          className="interview-insights"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <h2>Interview Insights from Top Companies</h2>
          <div className="insights-carousel">
            <button className="carousel-button prev" onClick={prevInsight}>
              <FaArrowLeft />
            </button>
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentInsight}
                className="insight-card"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <img src={interviewInsights[currentInsight].logo} alt={`${interviewInsights[currentInsight].company} logo`} className="company-logo" />
                <h3>{interviewInsights[currentInsight].company}</h3>
                <div className="insight-content">
                  <div className="insight-item">
                    <FaUserGraduate className="insight-icon" />
                    <p>{interviewInsights[currentInsight].experience}</p>
                  </div>
                  <div className="insight-item">
                    <FaQuestionCircle className="insight-icon" />
                    <p>{interviewInsights[currentInsight].topQuestion}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
            <button className="carousel-button next" onClick={nextInsight}>
              <FaArrowRight />
            </button>
          </div>
        </motion.section>

        <motion.section
          className="additional-cta"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <h2>Ready to Ace Your Interview?</h2>
          <p>Join thousands of successful candidates who prepared with The One Interview</p>
          <Link to="/signup">
            <motion.button
              className="cta-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Sign Up Now
            </motion.button>
          </Link>
        </motion.section>
      </main>
    </div>
  );
};

export default HomeComponent;
