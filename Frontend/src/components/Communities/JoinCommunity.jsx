// src/components/Communities/JoinCommunity.jsx
import React, { useState, useEffect } from 'react';
import './JoinCommunity.css';

const JoinCommunity = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm) {
        // Replace with actual API call
        fetchCommunities(searchTerm);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const fetchCommunities = async (term) => {
    // Replace with actual API call
    const results = [/* Fetch communities matching the search term */];
    setSearchResults(results);
  };

  return (
    <div className="join-community-modal">
      <h2>Join a Community</h2>
      <input
        type="text"
        placeholder="Search for communities..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <ul className="community-search-results">
        {searchResults.map(community => (
          <li key={community.id}>{community.name}</li>
        ))}
      </ul>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default JoinCommunity;
