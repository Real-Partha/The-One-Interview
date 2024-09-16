// src/components/Communities/CreateCommunity.jsx
import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faTimes, faUpload } from "@fortawesome/free-solid-svg-icons";
import "./CreateCommunity.css";

const CreateCommunity = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    nickname: "",
    description: "",
    lookingFor: "",
    rules: "",
    profilePhoto: null,
    bannerPhoto: null,
  });
  const [profilePreview, setProfilePreview] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
    }
  };

  return (
    <motion.div
      className="createcommunity-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      <h2 className="createcommunity-title">Create a Community</h2>
      <form onSubmit={handleSubmit} className="createcommunity-form">
        <div className="createcommunity-input-group">
          <input
            type="text"
            name="name"
            placeholder="Community Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="createcommunity-input-group">
          <input
            type="text"
            name="nickname"
            placeholder="Unique Nickname"
            value={formData.nickname}
            onChange={handleChange}
            required
          />
        </div>
        <div className="createcommunity-input-group">
          <textarea
            name="description"
            placeholder="Community Description"
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div className="createcommunity-input-group">
          <input
            type="text"
            name="lookingFor"
            placeholder="Looking for (comma-separated)"
            value={formData.lookingFor}
            onChange={handleChange}
          />
        </div>
        <div className="createcommunity-input-group">
          <textarea
            name="rules"
            placeholder="Community Rules"
            value={formData.rules}
            onChange={handleChange}
          ></textarea>
        </div>
        <div className="createcommunity-file-inputs">
          <div className="createcommunity-file-input">
            <label htmlFor="profilePhoto">
              <FontAwesomeIcon icon={faImage} /> Profile Photo
            </label>
            <input
              type="file"
              id="profilePhoto"
              name="profilePhoto"
              onChange={(e) => handleFileChange(e, "profilePhoto")}
              accept="image/*"
            />
            <AnimatePresence>
              {profilePreview && (
                <motion.div
                  className="createcommunity-image-preview"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <img src={profilePreview} alt="Profile Preview" />
                  <button
                    type="button"
                    onClick={() => removeImage("profilePhoto")}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="createcommunity-file-input">
            <label htmlFor="bannerPhoto">
              <FontAwesomeIcon icon={faImage} /> Banner Photo
            </label>
            <input
              type="file"
              id="bannerPhoto"
              name="bannerPhoto"
              onChange={(e) => handleFileChange(e, "bannerPhoto")}
              accept="image/*"
            />
            <AnimatePresence>
              {bannerPreview && (
                <motion.div
                  className="createcommunity-image-preview"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <img src={bannerPreview} alt="Banner Preview" />
                  <button
                    type="button"
                    onClick={() => removeImage("bannerPhoto")}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <div className="createcommunity-actions">
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FontAwesomeIcon icon={faUpload} /> Create Community
          </motion.button>
          <motion.button
            type="button"
            onClick={onClose}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Cancel
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default CreateCommunity;
