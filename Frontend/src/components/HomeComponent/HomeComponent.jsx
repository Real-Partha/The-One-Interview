import  { useState, useEffect, useRef } from 'react';
import NavBar from '../Navbar/Navbar';
import './HomeComponent.css';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaChartLine, FaHandshake } from 'react-icons/fa';
import { FaQuestionCircle, FaClipboardCheck,FaChevronLeft,FaChevronRight, FaUserGraduate, FaBuilding } from 'react-icons/fa';

const HomeComponent = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

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


  const carouselContent = [
    {
      tagline: "Ace Your Next Interview",
      description: "Get access to expert-curated questions and answers. Start your journey to success today!",
      image: "/img/banner1.png",
      ctaPrimary: "Start Practicing",
      ctaSecondary: "View Plans",
    },
    {
      tagline: "Master Your Skills",
      description: "Learn from industry experts and boost your confidence. Your dream job is within reach!",
      image: "/img/banner2.png",
      ctaPrimary: "Explore Courses",
      ctaSecondary: "Free Trial",
    },
    {
      tagline: "Land Your Dream Job",
      description: "Join thousands of successful candidates who prepared with us. Your future starts here!",
      image: "/img/carousel-3.jpg",
      ctaPrimary: "Sign Up Now",
      ctaSecondary: "Learn More",
    },
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
      company: "Flipkart",
      image: "/img/testimonials/priya.jpg",
      testimonial: "The One Interview's comprehensive question bank and expert-verified answers were instrumental in my success at Flipkart. The platform's focus on real interview experiences helped me understand what to expect and how to prepare effectively. I can't thank them enough for helping me land my dream job as a Senior Software Engineer!"
    },
    {
      name: "Rahul Gupta",
      company: "Swiggy",
      image: "/img/testimonials/rahul.jpg",
      testimonial: "As a product manager aspirant, I found The One Interview's company-specific preparation invaluable. Their insights into Swiggy's interview process and culture were spot-on. The mock interviews and performance analytics helped me identify my weak areas and improve rapidly. I'm now proudly working as a Product Manager at Swiggy, all thanks to this amazing platform!"
    },
    {
      name: "Aisha Patel",
      company: "Ola",
      image: "/img/testimonials/aisha.jpg",
      testimonial: "The career guidance feature of The One Interview was a game-changer for me. The mentorship I received helped me transition from a backend developer to a full-stack role at Ola. The platform's extensive resources and personalized advice made all the difference in my interview preparation and career growth."
    },
    {
      name: "Vikram Singh",
      company: "Paytm",
      image: "/img/testimonials/vikram.jpg",
      testimonial: "I was struggling with system design interviews until I found The One Interview. Their in-depth explanations and real-world examples helped me grasp complex concepts quickly. The interactive coding challenges were particularly helpful. Now, I'm working as a Senior System Designer at Paytm, and I owe much of my success to this platform."
    },
    {
      name: "Neha Reddy",
      company: "Zomato",
      image: "/img/testimonials/neha.jpg",
      testimonial: "The One Interview's focus on behavioral interviews was exactly what I needed. Their extensive collection of real interview experiences from Zomato employees gave me valuable insights into the company culture. The mock interviews boosted my confidence, and I sailed through my actual interview. I'm now a proud member of Zomato's marketing team!"
    },
    {
      name: "Arjun Nair",
      company: "BYJU'S",
      image: "/img/testimonials/arjun.jpg",
      testimonial: "As an edtech enthusiast, I always dreamed of working at BYJU'S. The One Interview's company-specific resources were incredibly detailed and up-to-date. Their tips on showcasing my passion for education technology during the interview were spot-on. Thanks to their guidance, I'm now part of BYJU'S product innovation team!"
    },
    {
      name: "Sneha Desai",
      company: "Razorpay",
      image: "/img/testimonials/sneha.jpg",
      testimonial: "The technical interview preparation on The One Interview is second to none. Their coverage of payment systems and fintech was extensive, which was crucial for my Razorpay interview. The platform's community forum also provided great peer support. I'm now working as a Software Engineer at Razorpay, living my fintech dream!"
    },
    {
      name: "Karthik Menon",
      company: "Freshworks",
      image: "/img/testimonials/karthik.jpg",
      testimonial: "The One Interview's emphasis on soft skills alongside technical preparation was a blessing. Their resources on client interaction and SaaS business models were particularly helpful for my Freshworks interview. The mock interviews improved my communication skills significantly. Now, I'm thriving as a Customer Success Manager at Freshworks!"
    },
    {
      name: "Ananya Choudhury",
      company: "Cred",
      image: "/img/testimonials/ananya.jpg",
      testimonial: "Preparing for a startup like Cred was challenging, but The One Interview made it manageable. Their insights into Cred's unique culture and interview style were spot-on. The platform's tips on showcasing creativity and innovation during interviews were invaluable. I'm now part of Cred's design team, creating delightful user experiences!"
    },
    {
      name: "Rohan Kapoor",
      company: "PhonePe",
      image: "/img/testimonials/rohan.jpg",
      testimonial: "The One Interview's section on fintech and mobile payments was a goldmine for my PhonePe interview preparation. Their practice questions on security and scalability were particularly relevant. The platform's mentorship program connected me with a PhonePe employee, providing insider tips. I'm now working as a Security Engineer at PhonePe, all thanks to this fantastic platform!"
    }
  ];

  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const testimonialRef = useRef(null);


  useEffect(() => {
    if (testimonialRef.current) {
      testimonialRef.current.style.transform = `translateX(-${activeTestimonial * 100}%)`;
    }
  }, [activeTestimonial]);

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % carouselContent.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + carouselContent.length) % carouselContent.length);
  };

  return (
    <div className="homepage">
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
                    <Link to="/questions" className="cta-button primary">{slide.ctaPrimary}</Link>
                    <Link to="/about" className="cta-button secondary">{slide.ctaSecondary}</Link>
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
          <h2>Success Stories</h2>
          <div className="testimonial-carousel">
            <div className="testimonial-track" ref={testimonialRef}>
              {testimonials.map((testimonial, index) => (
                <div key={index} className="testimonial-card">
                  <img src={testimonial.image} alt={testimonial.name} className="testimonial-image" />
                  <h3>{testimonial.name}</h3>
                  <h4>{testimonial.company}</h4>
                  <p>{testimonial.testimonial}</p>
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
