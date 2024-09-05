import React, { useEffect, useRef, useState } from 'react';
import './DevelopersPage.css';
import { FaLinkedin, FaGithub, FaInstagram, FaSnapchat } from 'react-icons/fa';

const DevelopersPage = () => {
  const slideRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const developers = [
    { 
      name: "Partha P Paul", 
      image: "/img/partha.jpg", 
      background: "/img/bgpartha.jpg",
      linkedin: "https://www.linkedin.com/in/partha-pratim-paul/",
      github: "https://github.com/Real-Partha",
      instagram: "https://www.instagram.com/_.parthaa._/",
      snapchat: "https://snapchat.com/add/partha_p_paul"
    },
    { 
      name: "Dedipya Goswami", 
      image: "/img/Dedipya1x1.jpg", 
      background: "/img/bgdedi.jpg",
      linkedin: "https://www.linkedin.com/in/dedipya-goswami001/",
      github: "https://github.com/dedipya001",
      instagram: "https://www.instagram.com/dedipya.goswami/",
      snapchat: "https://snapchat.com/add/partha_p_paul"
    },
    { 
      name: "Joydeep Ghosh", 
      image: "/img/joy2.jpg", 
      background: "/img/bgimg3.jpg",
      linkedin: "https://www.linkedin.com/in/joydeep-ghosh-969b6923a/",
      github: "https://github.com/joydeep2003",
      instagram: "https://www.instagram.com/__.__joy__deep__.__/",
      snapchat: "https://www.snapchat.com/add/joyy_deep?share_id=W-_inFgetjI&locale=en-US"
    },
    { 
      name: "Smit Kunapara", 
      image: "/img/smit.jpg", 
      background: "/img/bgimg4.jpg",
      linkedin: "https://linkedin.com/in/partha-p-paul",
      github: "https://github.com/partha-p-paul",
      instagram: "https://instagram.com/partha_p_paul",
      snapchat: "https://snapchat.com/add/partha_p_paul"
    },
  ];

  useEffect(() => {
    const handleNext = () => {
      const items = slideRef.current.querySelectorAll('.developers-item');
      slideRef.current.appendChild(items[0]);
    };

    const handlePrev = () => {
      const items = slideRef.current.querySelectorAll('.developers-item');
      slideRef.current.prepend(items[items.length - 1]);
    };

    const nextButton = document.querySelector('.developers-next');
    const prevButton = document.querySelector('.developers-prev');

    if (nextButton && prevButton) {
      nextButton.addEventListener('click', handleNext);
      prevButton.addEventListener('click', handlePrev);

      return () => {
        nextButton.removeEventListener('click', handleNext);
        prevButton.removeEventListener('click', handlePrev);
      };
    }
  }, []);

  const handleMobileNext = () => {
    setCurrentSlide((prev) => (prev + 1) % developers.length);
  };

  const handleMobilePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + developers.length) % developers.length);
  };

  const SocialIcons = ({ developer }) => (
    <div className="developers-social-icons">
      <a href={developer.linkedin} target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
      <a href={developer.github} target="_blank" rel="noopener noreferrer"><FaGithub /></a>
      <a href={developer.instagram} target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
      <a href={developer.snapchat} target="_blank" rel="noopener noreferrer"><FaSnapchat /></a>
    </div>
  );

  return (
    <>
      <div className="developers-laptop">
        <div className="developers-container">
          <div className="developers-slide" ref={slideRef}>
            {developers.map((developer, index) => (
              <div key={index} className="developers-item" style={{ backgroundImage: `url(${developer.background})` }}>
                <div className="developers-small-content">
                  <div className="developers-profile-image" style={{ backgroundImage: `url(${developer.image})` }}></div>
                  <div className="developers-small-name">
                    <span className="first-name">{developer.name.split(' ')[0]}</span>
                    <span className="last-name">{developer.name.split(' ').slice(1).join(' ')}</span>
                  </div>
                </div>
                <div className="developers-content">
                  <div className="developers-profile-image" style={{ backgroundImage: `url(${developer.image})` }}></div>
                  <div className="developers-name">{developer.name}</div>
                  <div className="developers-des">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ab, eum!</div>
                  <SocialIcons developer={developer} />
                </div>
              </div>
            ))}
          </div>
          <div className="developers-button-container">
            <button className="developers-prev"><i className="fa-solid fa-arrow-left"></i></button>
            <button className="developers-next"><i className="fa-solid fa-arrow-right"></i></button>
          </div>
        </div>
      </div>
      <div className="developers-mobile">
        <div className="developers-mobile-carousel">
          {developers.map((developer, index) => (
            <div
              key={index}
              className={`developers-mobile-item ${index === currentSlide ? 'active' : ''}`}
              style={{ backgroundImage: `url(${developer.background})` }}
            >
              <div className="developers-mobile-content">
                <div className="developers-profile-image" style={{ backgroundImage: `url(${developer.image})` }}></div>
                <div className="developers-name">{developer.name}</div>
                <div className="developers-des">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ab, eum!</div>
                <SocialIcons developer={developer} />
              </div>
            </div>
          ))}
        </div>
        <div className="developers-mobile-button-container">
          <button className="developers-mobile-prev" onClick={handleMobilePrev}><i className="fa-solid fa-arrow-left"></i></button>
          <button className="developers-mobile-next" onClick={handleMobileNext}><i className="fa-solid fa-arrow-right"></i></button>
        </div>
      </div>
    </>
  );
};

export default DevelopersPage;
