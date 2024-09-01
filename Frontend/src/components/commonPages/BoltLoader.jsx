import React, { useEffect, useRef } from 'react';
import './BoltLoader.css';

const BoltLoader = ({
  className = 'boltloader',
  background = 'transparent',
  boltColor = '#f2de10',
  backgroundBlurColor = '#fff9bc',
  size = '64px',
}) => {
  const boltRef = useRef(null);

  useEffect(() => {
    const bolt = boltRef.current;
    let animationFrame;

    const animate = () => {
      bolt.classList.add('animate');
      setTimeout(() => {
        bolt.classList.remove('animate');
        animationFrame = requestAnimationFrame(animate);
      }, 2400);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  const bolterWidth = parseInt(size) * 63 / 64;
  const bolterHeight = parseInt(size) * 93 / 64;

  const styles = {
    '--bolt-width': `${bolterWidth}px`,
    '--bolt-height': `${bolterHeight}px`,
    '--background': background,
    '--bolt-color': boltColor,
    '--background-blur-color': backgroundBlurColor,
  };

  return (
    <div className={`${className} bolt-loader`} ref={boltRef} style={styles}>
      <svg className="white left" viewBox="0 0 170 57">
        <path d="M36.2701759,17.9733192 C-0.981139498,45.4810755 -7.86361824,57.6618438 15.6227397,54.5156241 C50.8522766,49.7962945 201.109341,31.1461782 161.361488,2"></path>
      </svg>
      <svg className="white right" viewBox="0 0 170 57">
        <path d="M36.2701759,17.9733192 C-0.981139498,45.4810755 -7.86361824,57.6618438 15.6227397,54.5156241 C50.8522766,49.7962945 201.109341,31.1461782 161.361488,2"></path>
      </svg>
      <div className="spark">
        <span className="spark-shape"></span>
      </div>
      <svg className="circle" viewBox="0 0 112 44">
        <path d="M96.9355003,2 C109.46067,13.4022454 131.614152,42 56.9906735,42 C-17.6328048,42 1.51790702,13.5493875 13.0513641,2"></path>
      </svg>
      <svg className="line left" viewBox="0 0 70 3">
        <path transform="translate(-2.000000, 0.000000)" d="M2,1.5 L70,1.5"></path>
      </svg>
      <svg className="line right" viewBox="0 0 70 3">
        <path transform="translate(-2.000000, 0.000000)" d="M2,1.5 L70,1.5"></path>
      </svg>
    </div>
  );
};

export default BoltLoader;
