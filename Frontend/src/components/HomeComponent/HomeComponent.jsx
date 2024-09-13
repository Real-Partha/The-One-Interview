import  { useState, useEffect, useRef } from 'react';
import NavBar from '../Navbar/Navbar';
import './HomeComponent.css';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaChartLine, FaHandshake } from 'react-icons/fa';
import { FaQuestionCircle, FaClipboardCheck,FaChevronLeft,FaChevronRight, FaUserGraduate, FaBuilding } from 'react-icons/fa';
import { Helmet } from 'react-helmet';

const HomeComponent = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % carouselContent.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);


  const carouselContent = [
    {
      tagline: "Ace Your Next Interview",
      description: "Get access to expert-curated questions and answers. Start your journey to success today!",
      image: "/carousel/car1.jpeg",
      ctaPrimary: "Start Practicing",
      link: "/questions"
    },
    {
      tagline: "Master Your Skills",
      description: "Learn from industry experts and boost your confidence. Your dream job is within reach!",
      image: "/carousel/car2.jpeg",
      ctaPrimary: "Explore Companies",
      link: "/company-questions"
    },
    {
      tagline: "Land Your Dream Job",
      description: "Join thousands of successful candidates who prepared with us. Your future starts here!",
      image: "/carousel/car3.jpeg",
      ctaPrimary: "Start Exploring",
      link: "/questions"
    },
    {
      tagline: "Got Questions? We've Got Answers!",
      description: "Find solutions to your queries in our comprehensive FAQ section. Get the clarity you need!",
      image: "/carousel/car4.jpeg",
      ctaPrimary: "Visit FAQ",
      link: "/faq"
    },
    {
      tagline: "Meet the Minds Behind Your Success",
      description: "Discover our passionate team of experts dedicated to helping you achieve your career goals.",
      image: "/carousel/car5.jpeg",
      ctaPrimary: "Meet Our Team",
      link: "/developers"
    },
    {
      tagline: "Learn from Real Experiences",
      description: "Dive into our collection of interview blogs and gain insights from those who've been there.",
      image: "/carousel/car6.jpeg",
      ctaPrimary: "Read Interview Blogs",
      link: "interview-blogs"
    },
    {
      tagline: "Your Feedback Shapes Our Future",
      description: "Help us improve and tailor our platform to your needs. Your opinion matters!",
      image: "/carousel/car7.jpeg",
      ctaPrimary: "Give Feedback",
      link: "/feedback"
    }
  ];


  const features = [
    { 
      title: "Comprehensive Question Bank", 
      description: "Access thousands of curated interview questions covering various topics and difficulty levels. Our extensive database is regularly updated to reflect the latest industry trends.",
      icon: <FaQuestionCircle />,
      color: "#FF6B6B"
    },
    { 
      title: "Expert-Verified Answers", 
      description: "Get detailed, expert-verified answers to every question. Our team of industry professionals ensures that you receive accurate and up-to-date information to boost your confidence.",
      icon: <FaClipboardCheck />,
      color: "#4ECDC4"
    },
    { 
      title: "Real Interview Experiences", 
      description: "Learn from the firsthand experiences of successful candidates. Our platform features a collection of authentic interview stories, tips, and insights from various companies and positions.",
      icon: <FaUserGraduate />,
      color: "#45B7D1"
    },
    { 
      title: "Company-Specific Preparation", 
      description: "Tailor your preparation with our company-specific filters. Get access to questions, interview processes, and culture insights for top companies in your industry.",
      icon: <FaBuilding />,
      color: "#F7B731"
    },
    {
      title: "Performance Analytics",
      description: "Track your progress with detailed performance analytics. Identify your strengths and weaknesses to focus your preparation efforts effectively.",
      icon: <FaChartLine />,
      color: "#FF9FF3"
    },
    {
      title: "Career Guidance",
      description: "Get personalized career advice from industry experts. Our mentorship program connects you with professionals who can guide you towards your dream job.",
      icon: <FaHandshake />,
      color: "#5CD85A"
    },
  ];


  const testimonials = [
    {
      name: "Priya Sharma",
      company: "Google",
      logo: "/img/google.png",
      testimonial: "During my time at the university, there wasn't a well-organized platform for interview preparation. After securing my position at Google, I realized the importance of guidance. That's why I'm committed to helping my juniors navigate the same process. I want to share my experiences and insights, so they are better prepared to face the challenges ahead."
    },
    {
      name: "Rahul Gupta",
      company: "Microsoft",
      logo: "/img/company-logos/microsoft.png",
      testimonial: "When I was preparing for campus placements, I had to piece together resources and advice from various places. Now, as a part of One University, I'm excited to help create a more structured path for those following in my footsteps. My journey to Microsoft wasn't easy, but with the right support, I believe our juniors can achieve even more."
    },
    {
      name: "Aisha Patel",
      company: "Amazon",
      logo: "/img/company-logos/amazon.png",
      testimonial: "Back in my day, we didn't have a platform like One University to streamline our preparation. Now that I'm with Amazon, I want to give back to the community by mentoring and guiding students through the same interview process I faced. It's all about making sure they don't make the same mistakes and are fully prepared to succeed."
    },
    {
      name: "Vikram Singh",
      company: "Adobe",
      logo: "/img/company-logos/adobe.png",
      testimonial: "I remember the struggle of preparing for interviews with limited resources. Joining Adobe was a dream come true, and now I want to ensure that my juniors have a smoother journey. Through One University, I’m eager to share practical tips and provide the support system I wish I had."
    },
    {
      name: "Neha Reddy",
      company: "Uber",
      logo: "/img/company-logos/uber.png",
      testimonial: "The lack of a dedicated platform made my preparation for Uber's interviews challenging. Now, as part of One University, I'm excited to contribute to a community where students can find all the guidance they need. I want to help them develop the skills and confidence required to excel in their placements."
    },
    // Add more testimonials as needed
  ];
  
  
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const testimonialRef = useRef(null);

  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % carouselContent.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + carouselContent.length) % carouselContent.length);
  };



  return (
    <div className="homepage">
      <Helmet>
        <title>The One Interview - Ace Your Next Job Interview</title>
        <meta name="description" content="Prepare for your next job interview with expert-curated questions and answers. Access a comprehensive question bank and real interview experiences from top companies." />
        <link rel="canonical" href="https://the-one-interview.vercel.app/" />
      </Helmet>
      <NavBar />
      <main>
      <section className="hero">
          <div className="hero-carousel">
            {carouselContent.map((slide, index) => (
              <motion.div
                key={index}
                className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: index === currentSlide ? 1 : 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="hero-image">
                  <img src={slide.image} alt={slide.tagline} />
                </div>
                <div className="hero-content">
                  <h1>{slide.tagline}</h1>
                  <p>{slide.description}</p>
                  <div className="cta-buttons">
                    <Link to={slide.link} className="cta-button primary">{slide.ctaPrimary}</Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <button className="carousel-control prev" onClick={prevSlide}>
            <FaChevronLeft />
          </button>
          <button className="carousel-control next" onClick={nextSlide}>
            <FaChevronRight />
          </button>
        </section>

        <section className="features">
          <h2>Why Us? We’ve Been There, Done That</h2>
          <div className="feature-grid">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="feature-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="feature-icon" style={{ color: feature.color }}>{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>


        <section className="testimonials">
  <h2>Take help from the Experienced Ones</h2>
  <div className="testimonial-carousel">
    <div className="testimonial-track" ref={testimonialRef}         style={{ transform: `translateX(-${currentSlide * 100}%)` }}
    >
      {testimonials.map((testimonial, index) => (
        <div key={index} className="testimonial-card">
          <div className="testimonial-background" style={{ backgroundImage: `url(${testimonial.logo})` }}></div>
          <div className="testimonial-content">
            <h3>{testimonial.name}</h3>
            <h4>{testimonial.company}</h4>
            <p>{testimonial.testimonial}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
    <div className="testimonial-indicators">
      {testimonials.map((_, index) => (
        <button
          key={index}
          className={`indicator ${index === activeTestimonial ? 'active' : ''}`}
          onClick={() => setActiveTestimonial(index)}
        />
      ))}
    </div>
  </section>

  <section className="cta-section">
          <h2>Ready to Ace Your Interview?</h2>
          <p>Join thousands of successful candidates who prepared with The One Interview</p>
          <Link to="/signup" className="cta-button primary">Sign Up Now</Link>
        </section>

      </main>
    </div>
  );
};

export default HomeComponent;
