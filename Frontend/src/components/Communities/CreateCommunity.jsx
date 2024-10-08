// src/components/Communities/CreateCommunity.jsx
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCheckCircle,
  faTimesCircle,
  faSpinner,
  faImage,
  faTimes,
  faLock,
  faGlobe,
} from "@fortawesome/free-solid-svg-icons";
import { Tooltip } from "react-tooltip";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import "./CreateCommunity.css";

const CreateCommunity = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    nickname: "",
    description: "",
    lookingFor: "",
    isPrivate: false,
    profilePhoto: null,
    bannerPhoto: null,
  });
  const [profilePreview, setProfilePreview] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nicknameAvailable, setNicknameAvailable] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isNicknameTooLong, setIsNicknameTooLong] = useState(false);

  useEffect(() => {
    const { name, nickname, description, lookingFor } = formData;
    setIsFormValid(
      name.trim() !== "" && !isNicknameTooLong && nickname.trim() !== "" && description.trim() !== "" && lookingFor.trim() !== ""
    );
  }, [formData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });

    if (name === "nickname") {
      if (value.length > 30) {
        setIsNicknameTooLong(true);
        setNicknameAvailable(null);
      } else {
        setIsNicknameTooLong(false);
        checkNicknameAvailability(value);
      }
    }
  };

  // Debounce utility function
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    setFormData({ ...formData, [type]: file });

    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === "profilePhoto") {
        setProfilePreview(reader.result);
      } else {
        setBannerPreview(reader.result);
      }
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (type) => {
    setFormData({ ...formData, [type]: null });
    if (type === "profilePhoto") {
      setProfilePreview(null);
    } else {
      setBannerPreview(null);
    }
  };

  const checkNicknameAvailability = useCallback(
    debounce(async (nickname) => {
      if (nickname.trim() === "" || nickname.length > 30) {
        setNicknameAvailable(null);
        return;
      }
      try {
        setIsChecking(true);
        setNicknameAvailable(null);
        const response = await axios.get(
          `${
            import.meta.env.VITE_API_URL
          }/communities/check-nickname/${nickname}`
        );
        setNicknameAvailable(response.data.available);
      } catch (error) {
        console.error("Error checking nickname availability:", error);
        setNicknameAvailable(false);
      } finally {
        setIsChecking(false);
      }
    }, 500),
    []
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsSubmitting(true);
    try {
      const formDataToSend = new FormData();
      for (const key in formData) {
        formDataToSend.append(key, formData[key]);
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/communities`,
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      console.log("Community created:", response.data);
      onClose();
    } catch (error) {
      console.error("Error creating community:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      className="createcommunity-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      <div className="createcommunity-card">
        <div className="createcommunity-banner">
          {bannerPreview ? (
            <img src={bannerPreview} alt="Banner Preview" />
          ) : (
            <div className="createcommunity-banner-placeholder">
              <FontAwesomeIcon icon={faImage} />
              <span>Add Banner Image</span>
            </div>
          )}
          <input
            type="file"
            id="bannerPhoto"
            name="bannerPhoto"
            onChange={(e) => handleFileChange(e, "bannerPhoto")}
            accept="image/*"
          />
          {bannerPreview && (
            <button
              className="remove-image"
              onClick={() => removeImage("bannerPhoto")}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          )}
        </div>
        <div className="createcommunity-profile-section">
          <div className="createcommunity-profile-photo">
            {profilePreview ? (
              <img src={profilePreview} alt="Profile Preview" />
            ) : (
              <div className="createcommunity-profile-placeholder">
                <FontAwesomeIcon icon={faImage} />
              </div>
            )}
            <input
              type="file"
              id="profilePhoto"
              name="profilePhoto"
              onChange={(e) => handleFileChange(e, "profilePhoto")}
              accept="image/*"
            />
            {profilePreview && (
              <button
                className="remove-image"
                onClick={() => removeImage("profilePhoto")}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            )}
          </div>
          <div className="createcommunity-header">
            <input
              type="text"
              name="name"
              placeholder="Community Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="community-name"
            />
            <div className="createcommunity-nickname-input">
              <input
                type="text"
                name="nickname"
                placeholder="Unique Nickname"
                value={formData.nickname}
                onChange={handleChange}
                required
                className="community-nickname"
              />
              {formData.nickname && (
                <span
                  className={`createcommunity-nickname-availability ${
                    isNicknameTooLong
                      ? "too-long"
                      : nicknameAvailable === null
                      ? ""
                      : nicknameAvailable
                      ? "available"
                      : "unavailable"
                  }`}
                  data-tooltip-id="nickname-tooltip"
                  data-tooltip-content={
                    isNicknameTooLong
                      ? "Nickname cannot be more than 30 characters"
                      : nicknameAvailable
                      ? "Nickname is all yours!"
                      : "Sorry, nickname is already taken"
                  }
                >
                  <FontAwesomeIcon
                    icon={
                      isNicknameTooLong
                        ? faExclamationCircle
                        : isChecking
                        ? faSpinner
                        : nicknameAvailable === null
                        ? faSpinner
                        : nicknameAvailable
                        ? faCheckCircle
                        : faTimesCircle
                    }
                    spin={isChecking}
                  />
                </span>
              )}
              <Tooltip id="nickname-tooltip" place="top" effect="solid" />
            </div>
          </div>
        </div>
        <div className="createcommunity-content">
          <textarea
            name="description"
            placeholder="Community Description"
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>
          <input
            type="text"
            name="lookingFor"
            placeholder="Looking for (comma-separated)"
            value={formData.lookingFor}
            onChange={handleChange}
          />
          <div className="createcommunity-privacy">
            <label>
              <FontAwesomeIcon icon={formData.isPrivate ? faLock : faGlobe} />
              <input
                type="checkbox"
                name="isPrivate"
                checked={formData.isPrivate}
                onChange={handleChange}
              />
              Private Community
            </label>
          </div>
        </div>
        <motion.button
          className="createcommunity-submit"
          type="submit"
          onClick={handleSubmit}
          disabled={!isFormValid || isSubmitting || !nicknameAvailable}
          whileTap={{ scale: 0.95 }}
          data-tooltip-id="submit-tooltip"
          data-tooltip-content={
            !isFormValid
              ? "Please complete all required fields before creating the community"
              : ""
          }
        >
          {isSubmitting ? (
            <>
              <i className="fas fa-spinner fa-spin"></i> Creating Community...
            </>
          ) : (
            "Create Community"
          )}
        </motion.button>
        <Tooltip
          id="submit-tooltip"
          place="top"
          effect="solid"
          className="custom-tooltip"
        />
      </div>
      <motion.button
        className="createcommunity-back-to-dashboard"
        onClick={onClose}
        disabled={isSubmitting}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <FontAwesomeIcon icon={faArrowLeft} /> Back to Dashboard
      </motion.button>
    </motion.div>
  );
};

export default CreateCommunity;
