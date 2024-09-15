// src/components/Communities/CreateCommunity.jsx
import React, { useState } from 'react';
import './CreateCommunity.css';

const CreateCommunity = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    lookingFor: '',
    rules: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Replace with actual API call to create community
    console.log('Community created:', formData);
    onClose();
  };

  return (
    <div className="create-community-modal">
      <h2>Create a Community</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Community Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
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
        <textarea
          name="rules"
          placeholder="Community Rules"
          value={formData.rules}
          onChange={handleChange}
        ></textarea>
        <button type="submit">Create Community</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </form>
    </div>
  );
};

export default CreateCommunity;
