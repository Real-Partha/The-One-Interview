import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './CompanyPage.css';
import { useTheme } from '../../ThemeContext';
import ThreadSkeleton from '../HomeQuestions/threadskeleton';
import Sidebar from '../Left Sidebar/Sidebar';

const CompanyPage = () => {
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/companies`);
      setCompanies(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching companies:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className={`company-questions-main-content ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
        <Sidebar />
      <section className="company-threads">
        {isLoading
          ? Array(7)
              .fill()
              .map((_, index) => <ThreadSkeleton key={index} />)
          : companies.map((company) => (
              <Link
                to={`/company/${company._id}`}
                key={company._id}
                className="company-card-link"
              >
                <div className="company-card">
                  <h3 className="company-name">{company.name}</h3>
                  <div className="company-info">
                    <p className="company-role">Role: {company.role}</p>
                    <p className="question-bank-years">
                      Question Bank: {company.questionBankYears} years
                    </p>
                  </div>
                  <div className="company-stats">
                    <span className="question-count">
                      <i className="fas fa-question-circle"></i> {company.questionCount} questions
                    </span>
                    <span className="last-updated">
                      <i className="fas fa-clock"></i> Last updated: {new Date(company.lastUpdated).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
      </section>
    </div>
  );
};

export default CompanyPage;
