import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./CompanyPage.css";
import { useTheme } from "../../ThemeContext";
import ThreadSkeleton from "../HomeQuestions/threadskeleton";
import Sidebar from "../Left Sidebar/Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Helmet } from "react-helmet";
import {
  faBuilding,
  faQuestionCircle,
  faClock,
  faTag,
  faCalendarAlt,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import DOMPurify from "dompurify";
import MainLoader from "../commonPages/MainLoader";

const CompanyPage = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [closingQuestion, setClosingQuestion] = useState(null);
  const { isDarkMode } = useTheme();
  const questionRefs = useRef({});
  const [isMainLoading, setIsMainLoading] = useState(true);
  const [filterText, setFilterText] = useState("");
  const [filteredCompanies, setFilteredCompanies] = useState([]);

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    filterCompanies();
  }, [filterText, companies]);

  const fetchCompanies = async () => {
    setIsMainLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/companies`
      );
      const companiesData = response.data.filter(
        (company) => company.name !== null
      );
      setCompanies(companiesData);
      setIsLoading(false);
      setIsMainLoading(false);
    } catch (error) {
      console.error("Error fetching companies:", error);
      setIsLoading(false);
      setIsMainLoading(false);
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
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Error fetching company questions:", error);
      setIsLoading(false);
    }
  };

  const handleShowAllCompanies = () => {
    setSelectedCompany(null);
    setQuestions([]);
    setExpandedQuestion(null);
  };

  const handleQuestionClick = (questionId) => {
    if (expandedQuestion === questionId) {
      setClosingQuestion(questionId);
      setTimeout(() => {
        setExpandedQuestion(null);
        setClosingQuestion(null);
      }, 500); // Match this with the CSS animation duration
    } else {
      setExpandedQuestion(questionId);
      setTimeout(() => {
        if (questionRefs.current[questionId]) {
          questionRefs.current[questionId].scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 10);
    }
  };

  const filterCompanies = () => {
    const filtered = companies.filter((company) =>
      company.name.toLowerCase().includes(filterText.toLowerCase())
    );
    setFilteredCompanies(filtered);
  };

  const handleFilterChange = (e) => {
    setFilterText(e.target.value);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  if (isMainLoading)
    return (
      <div>
        <MainLoader />
      </div>
    );

  return (
    <div
      className={`companypage-main-content ${
        isDarkMode ? "dark-mode" : "light-mode"
      }`}
    >

<Helmet>
        <title>Campus Recruiting Company Questions - The One Interview</title>
        <meta name="description" content="Explore our comprehensive database of interview questions and expert answers. Prepare for your next job interview with real experiences from top companies.You will find questions of companies posted here that mostly hire from Campus Recruitments including Paypal , JP Morgan and Chase, Flipkart, Amazon and Juspay" />
        <link rel="canonical" href="https://the-one-interview.vercel.app/" />
      </Helmet>
      <Sidebar />
      <section className="companypage-content">
        {selectedCompany ? (
          <div className="companypage-questions-list">
            <h2 className="companypage-title">
              <button
                className="companypage-back-button"
                onClick={handleShowAllCompanies}
              >
                <FontAwesomeIcon icon={faChevronLeft} /> All Companies
              </button>
              Questions for {selectedCompany}
            </h2>
            {isLoading
              ? Array(5)
                  .fill()
                  .map((_, index) => <ThreadSkeleton key={index} />)
              : questions.map((question) => (
                  <div
                    key={question._id}
                    className="companypage-question-card"
                    ref={(el) => (questionRefs.current[question._id] = el)}
                  >
                    <h3
                      className="companypage-question-title"
                      onClick={() => handleQuestionClick(question._id)}
                    >
                      {question.question}
                    </h3>
                    <div className="companypage-question-meta">
                      <span className="companypage-question-category">
                        <FontAwesomeIcon icon={faTag} /> {question.category}
                      </span>
                      <span className="companypage-question-date">
                        <FontAwesomeIcon icon={faCalendarAlt} />{" "}
                        {formatDate(question.created_at)}
                      </span>
                    </div>
                    {expandedQuestion === question._id && (
                      <div
                        className={`companypage-question-answer ${
                          closingQuestion === question._id
                            ? "fade-out"
                            : "fade-in"
                        }`}
                      >
                        <h4>Preview Answer:</h4>
                        <div
                          className="quill-content"
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(question.answer),
                          }}
                        />
                        <a
                          href={`/question/${question._id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="companypage-detailed-button"
                        >
                          Go to Detailed Question Page
                        </a>
                      </div>
                    )}
                  </div>
                ))}
          </div>
        ) : (
          <div className="companypage-companies-list">
            <h2 className="companypage-title">
              <FontAwesomeIcon icon={faBuilding} />{" "}
              <span className="companypage-title-company">Companies</span>
            </h2>
            <div className="companypage-filter-container">
              <div className="companypage-filter-title">Search for Compnaies:</div>
              <input
                type="text"
                className="companypage-filter-input"
                placeholder="Filter companies..."
                value={filterText}
                onChange={handleFilterChange}
              />
            </div>
            {isLoading ? (
              Array(7)
                .fill()
                .map((_, index) => <ThreadSkeleton key={index} />)
            ) : filteredCompanies.length > 0 ? (
              filteredCompanies.map((company) => (
                <div
                  key={company.name}
                  className="companypage-company-card"
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
                      {formatDate(company.lastUpdated)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="companypage-no-results">
                <FontAwesomeIcon icon={faQuestionCircle} size="2x" />
                <p>No companies found matching "{filterText}"</p>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default CompanyPage;
