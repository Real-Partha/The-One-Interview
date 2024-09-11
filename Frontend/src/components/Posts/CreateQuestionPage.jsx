import { useState, useRef, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./CreateQuestionPage.css";
import { useTheme } from "../../ThemeContext";
import axios from "axios";
import PayloadSizeExceededPopup from "./PayloadSizeExceededPopup";
import useNotification from "../Notifications";
import {
  FaExclamationTriangle,
  FaQuestionCircle,
  FaTag,
  FaSpinner,
} from "react-icons/fa";

const FormTooltip = ({ isVisible, formData }) => {
  if (!isVisible) return null;

  return (
    <div className="CreateQuestionPage-form-tooltip">
      <h3>Please complete the following:</h3>
      <ul>
        {formData.question.trim() === "" && (
          <li>
            <FaQuestionCircle className="CreateQuestionPage-tooltip-icon" />
            <span>Enter a question</span>
          </li>
        )}
        {formData.answer.replace(/<[^>]*>/g, "").trim() === "" && (
          <li>
            <FaExclamationTriangle className="CreateQuestionPage-tooltip-icon" />
            <span>Provide an answer</span>
          </li>
        )}
        {formData.tags.length < 2 && (
          <li>
            <FaTag className="CreateQuestionPage-tooltip-icon" />
            <span>{`Add at least ${2 - formData.tags.length} more ${
              2 - formData.tags.length === 1 ? "tag" : "tags"
            }`}</span>
          </li>
        )}
      </ul>
    </div>
  );
};

const CreateQuestionPage = ({ onClose, loginPopup }) => {
  const [formData, setFormData] = useState({
    companyName: "",
    category: "General",
    level: "Beginner",
    question: "",
    answer: "",
    tags: [],
  });

  const [tagInput, setTagInput] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { isDarkMode } = useTheme();
  const successMessageRef = useRef(null);
  const [showPayloadSizePopup, setShowPayloadSizePopup] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { ErrorNotification, SuccessNotification } = useNotification();

  const checkFormValidity = () => {
    const isValid =
      formData.question.trim() !== "" &&
      formData.answer.replace(/<[^>]*>/g, "").trim() !== "" && // This line checks for non-empty content in Quill
      formData.tags.length >= 2;
    setIsFormValid(isValid);
  };

  const capitalizeWords = (str) => {
    return str.replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const handleChange = (value, field) => {
    if (field === "companyName") {
      value = capitalizeWords(value);
    }
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTagInputChange = (e) => {
    const value = e.target.value;
    if (value.endsWith(" ")) {
      addTag(value.trim());
    } else {
      setTagInput(value);
    }
  };

  const addTag = (tag) => {
    if (tag) {
      const formattedTag = tag.startsWith("#") ? tag : `#${tag}`;
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, formattedTag],
      }));
      setTagInput("");
    }
  };

  const handleTagRemove = (index) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag(tagInput);
    } else if (
      e.key === "Backspace" &&
      tagInput === "" &&
      formData.tags.length > 0
    ) {
      e.preventDefault();
      const newTags = [...formData.tags];
      const removedTag = newTags.pop();
      setFormData((prev) => ({
        ...prev,
        tags: newTags,
      }));
      setTagInput(removedTag.slice(1));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      // Check payload size
      const payloadSize = new Blob([JSON.stringify(formData)]).size;
      if (payloadSize > 5 * 1024 * 1024) {
        // 5 MB in bytes
        setShowPayloadSizePopup(true);
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/question`,
        formData,
        { withCredentials: true }
      );
      setIsSubmitted(true);
      // Clear form data
      setFormData({
        companyName: "",
        category: "",
        level: "beginner",
        question: "",
        answer: "",
        tags: [],
      });

      setTimeout(scrollToSuccessMessage, 100);
    } catch (error) {
      ErrorNotification(error.response.data.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToSuccessMessage = () => {
    if (successMessageRef.current) {
      const yOffset = -130; // Adjust this value to control how much above the message to scroll
      const y =
        successMessageRef.current.getBoundingClientRect().top +
        window.pageYOffset +
        yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const handleDone = () => {
    setIsSubmitted(false);
    setTagInput("");
    onClose();
  };

  useEffect(() => {
    checkFormValidity();
  }, [formData]);

  if (isSubmitted) {
    return (
      <div
        ref={successMessageRef}
        className={`CreateQuestionPage-submission-success ${
          isDarkMode ? "CreateQuestionPage-dark" : ""
        }`}
      >
        <div className="CreateQuestionPage-success-content">
          <i className="fas fa-check-circle CreateQuestionPage-success-icon"></i>
          <h2 className="CreateQuestionPage-success-title">
            Question Submitted Successfully!
          </h2>
          <p className="CreateQuestionPage-success-message">
            Your question has been sent for approval. Thank you for your
            contribution!
          </p>
          <button onClick={handleDone} className="CreateQuestionPage-btn-done">
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    !loginPopup && (
      <div
        className={`CreateQuestionPage ${
          isDarkMode ? "CreateQuestionPage-dark" : ""
        }`}
      >
        {showPayloadSizePopup && (
          <PayloadSizeExceededPopup
            onClose={() => setShowPayloadSizePopup(false)}
          />
        )}
        <form className="CreateQuestionPage-form" onSubmit={handleSubmit}>
          <div className="CreateQuestionPage-form-group">
            <label htmlFor="companyName">Company Name:</label>
            <input
              type="text"
              id="companyName"
              className="CreateQuestionPage-form-control"
              value={formData.companyName}
              onChange={(e) => handleChange(e.target.value, "companyName")}
            />
          </div>
          <div className="CreateQuestionPage-form-group">
            <label htmlFor="category">
              In which Round can the Question be Expected?{" "}
            </label>
            <select
              id="category"
              className="CreateQuestionPage-form-control CreateQuestionPage-special-form-control"
              value={formData.category}
              onChange={(e) => handleChange(e.target.value, "category")}
            >
              <option value="General">General</option>
              <option value="Technical Round">Technical Round</option>
              <option value="HR Round">HR Round</option>
              <option value="Aptitude">Aptitude</option>
              <option value="Online Coding Round">Online Coding Round</option>
            </select>
          </div>
          <div className="CreateQuestionPage-form-group">
            <label htmlFor="level">Level:</label>
            <select
              id="level"
              className="CreateQuestionPage-form-control CreateQuestionPage-special-form-control"
              value={formData.level}
              onChange={(e) => handleChange(e.target.value, "level")}
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
          <div className="CreateQuestionPage-form-group">
            <label htmlFor="question">What was the Question asked?</label>
            <input
              type="text"
              id="question"
              className="CreateQuestionPage-form-control"
              value={formData.question}
              onChange={(e) => handleChange(e.target.value, "question")}
            />
          </div>
          <div className="CreateQuestionPage-form-group">
            <label htmlFor="answer">What should be the Perfect Answer? </label>
            <ReactQuill
              theme="snow"
              value={formData.answer}
              onChange={(value) => handleChange(value, "answer")}
              modules={CreateQuestionPage.modules}
              formats={CreateQuestionPage.formats}
              className={isDarkMode ? "CreateQuestionPage-dark-quill" : ""}
            />
          </div>
          <div className="CreateQuestionPage-form-group">
            <label>Tags:</label>
            <div className="CreateQuestionPage-tags-input-container">
              {formData.tags.map((tag, index) => (
                <div key={index} className="CreateQuestionPage-tag-item">
                  {tag}
                  <span
                    className="CreateQuestionPage-tag-remove"
                    onClick={() => handleTagRemove(index)}
                  >
                    x
                  </span>
                </div>
              ))}
              <input
                type="text"
                className="CreateQuestionPage-tag-input"
                value={tagInput}
                onChange={handleTagInputChange}
                onKeyDown={handleTagInputKeyDown}
                placeholder="Add tags that describe the post"
              />
            </div>
          </div>
          <div className="CreateQuestionPage-form-group CreateQuestionPage-submit-group">
            <button
              type="submit"
              className={`CreateQuestionPage-btn-submit ${
                !isFormValid || isSubmitting
                  ? "CreateQuestionPage-disabled"
                  : ""
              }`}
              disabled={!isFormValid || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="CreateQuestionPage-spinner" />
                  Saving...
                </>
              ) : (
                "Submit"
              )}
            </button>
            <FormTooltip
              isVisible={!isFormValid && !isSubmitting}
              formData={formData}
            />
          </div>
        </form>
      </div>
    )
  );
};

CreateQuestionPage.modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image", "code-block"],
  ],
  clipboard: {
    matchVisual: false,
  },
};

CreateQuestionPage.formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "code-block",
];

export default CreateQuestionPage;
