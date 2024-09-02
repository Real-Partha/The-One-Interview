import React, { useState } from 'react';
import NavBar from '../../Navbar/Navbar';
import './PrivacyPolicy.css';
import { useTheme } from '../../../ThemeContext';
import * as FaIcons from 'react-icons/fa';
import privacyData from './Privacy.json';

const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState(null);
  const { isDarkMode } = useTheme();
  const { sections } = privacyData;

  return (
    <div className={`privacy-policy-page ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <NavBar />
      <div className="privacy-policy-container">
        <h1>Privacy Policy</h1>
        <p>Last updated: September 2, 2024</p>
        
        <div className="privacy-sections">
          {sections.map((section, index) => {
            const IconComponent = FaIcons[section.icon];
            return (
              <div
                key={index}
                className={`privacy-section ${activeSection === index ? 'active' : ''}`}
                onClick={() => setActiveSection(activeSection === index ? null : index)}
              >
                <div className="section-header">
                  {IconComponent && <IconComponent />}
                  <h2>{section.title}</h2>
                </div>
                {activeSection === index && (
                  <div className="section-content">
                    <p>{section.content}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
