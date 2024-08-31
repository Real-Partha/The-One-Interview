import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CompanyPage.css";
import { useTheme } from "../../ThemeContext";
import ThreadSkeleton from "../HomeQuestions/threadskeleton";
import Sidebar from "../Left Sidebar/Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBuilding,
  faQuestionCircle,
  faClock,
  faTag,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";

const CompanyPage = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/companies`
      );
      setCompanies(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching companies:", error);
      setIsLoading(false);
    }
  };

  const fetchCompanyQuestions = async (company) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/companies/${company}/questions`
      );
      setQuestions(response.data.questions);
      setSelectedCompany(company);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching company questions:", error);
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`companypage-main-content ${
        isDarkMode ? "dark-mode" : "light-mode"
      }`}
    >
      <Sidebar />
      <section className="companypage-content">
        <div className="companypage-companies-list">
          <h2 className="companypage-title">
            <FontAwesomeIcon icon={faBuilding} /> Companies
          </h2>
          {isLoading
            ? Array(7)
                .fill()
                .map((_, index) => <ThreadSkeleton key={index} />)
            : companies.map((company) => (
                <div
                  key={company.name}
                  className={`companypage-company-card ${
                    selectedCompany === company.name
                      ? "companypage-selected"
                      : ""
                  }`}
                  onClick={() => fetchCompanyQuestions(company.name)}
                >
                  <h3 className="companypage-company-name">{company.name}</h3>
                  <div className="companypage-company-stats">
                    <span className="companypage-question-count">
                      <FontAwesomeIcon icon={faQuestionCircle} />{" "}
                      {company.questionCount} questions
                    </span>
                    <span className="companypage-last-updated">
                      <FontAwesomeIcon icon={faClock} /> Last updated:{" "}
                      {new Date(company.lastUpdated).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
        </div>
        <div className="companypage-questions-list">
          <h2 className="companypage-title">
            {selectedCompany
              ? `Questions for ${selectedCompany}`
              : "Select a Company"}
          </h2>
          {isLoading
            ? Array(5)
                .fill()
                .map((_, index) => <ThreadSkeleton key={index} />)
            : questions.map((question) => (
                <div key={question._id} className="companypage-question-card">
                  <h3 className="companypage-question-title">
                    {question.question}
                  </h3>
                  <p className="companypage-question-preview">
                    {question.answer.substring(0, 100)}...
                  </p>
                  <div className="companypage-question-meta">
                    <span className="companypage-question-category">
                      <FontAwesomeIcon icon={faTag} /> {question.category}
                    </span>
                    <span className="companypage-question-date">
                      <FontAwesomeIcon icon={faCalendarAlt} />{" "}
                      {new Date(question.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
        </div>
      </section>
    </div>
  );
};

export default CompanyPage;
