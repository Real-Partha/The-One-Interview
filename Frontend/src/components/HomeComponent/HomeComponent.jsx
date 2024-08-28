
import { useState, useEffect } from 'react';
import NavBar from '../Navbar/Navbar';
import './HomeComponent.css';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';

const HomeComponent = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [darkMode, setDarkMode] = useState(false);

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
    { title: "All Questions Answered", description: "Access a comprehensive database of interview questions and answers" },
    { title: "Quality Interview Questions", description: "Curated questions to help you prepare for any interview scenario" },
    { title: "Interview Experiences from Seniors", description: "Learn from the experiences of successful candidates" },
    { title: "Company-wise Filtered Questions", description: "Tailored questions and answers for various companies and exam rounds" },
  ];


  const companies = [
    { name: 'Google', logo: '/img/google-logo.png' },
    { name: 'Amazon', logo: '/img/amazon-logo.png' },
    { name: 'Microsoft', logo: '/img/microsoft-logo.png' },
    { name: 'Apple', logo: '/img/apple-logo.png' },
    { name: 'Facebook', logo: '/img/facebook-logo.png' },
  ];


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
          <div className="feature-timeline">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className={`feature-item ${index % 2 === 0 ? 'left' : 'right'}`}
                variants={itemVariants}
              >
                <div className="feature-content">
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          className="company-carousel"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <h2>Featured Companies</h2>
          <div className="company-list">
            {companies.map((company, index) => (
              <motion.div
                key={index}
                className="company-item"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <img src={company.logo} alt={`${company.name} logo`} />
              </motion.div>
            ))}
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

      <footer>
        <div className="footer-content">
          <div className="footer-section">
            <h3>About Us</h3>
            <p>The One Interview is your ultimate platform for interview preparation.</p>
          </div>
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/questions">Questions</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Connect With Us</h3>
            <ul>
              <li><a href="#">Facebook</a></li>
              <li><a href="#">Twitter</a></li>
              <li><a href="#">LinkedIn</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 The One Interview. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
};

export default HomeComponent;