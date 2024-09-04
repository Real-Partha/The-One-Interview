import React, { useEffect, useRef, useState } from 'react';
import './DevelopersPage.css';

const DevelopersPage = () => {
  const slideRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const developers = [
    { name: "Partha P Paul", image: "/img/joy.png", background: "/img/bgimg1.jpg" },
    { name: "Dedipya Goswami", image: "/img/joy.png", background: "/img/bgimg2.jpg" },
    { name: "Joydeep Ghosh", image: "/img/joy.png", background: "/img/bgimg3.jpg" },
    { name: "Smit Kunpura", image: "/img/joy.png", background: "/img/bgimg4.jpg" },
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
                  <button className="developers-button">See More</button>
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
    </>
  );
};

export default DevelopersPage;
