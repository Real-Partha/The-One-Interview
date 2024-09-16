// src/components/Communities/CreateCommunity.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faImage,
  faTimes,
  faLock,
  faGlobe,
} from "@fortawesome/free-solid-svg-icons";
import { Tooltip } from "react-tooltip";
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

  useEffect(() => {
    const { name, nickname, description } = formData;
    setIsFormValid(
      name.trim() !== "" && nickname.trim() !== "" && description.trim() !== ""
    );
  }, [formData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
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
            <input
              type="text"
              name="nickname"
              placeholder="Unique Nickname"
              value={formData.nickname}
              onChange={handleChange}
              required
              className="community-nickname"
            />
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
              <input
                type="checkbox"
                name="isPrivate"
                checked={formData.isPrivate}
                onChange={handleChange}
              />
              Private Community
            </label>
            <FontAwesomeIcon icon={formData.isPrivate ? faLock : faGlobe} />
          </div>
        </div>
      </div>
      <motion.button
        className="createcommunity-submit"
        type="submit"
        onClick={handleSubmit}
        disabled={!isFormValid || isSubmitting}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        data-tooltip-id="submit-tooltip"
        data-tooltip-content={
          !isFormValid
            ? "Please complete all required fields before creating the community"
            : ""
        }
      >
        {isSubmitting ? "Creating Community..." : "Create Community"}
      </motion.button>
      <Tooltip
        id="submit-tooltip"
        place="top"
        effect="solid"
        className="custom-tooltip"
      />
    </motion.div>
  );
};

export default CreateCommunity;
