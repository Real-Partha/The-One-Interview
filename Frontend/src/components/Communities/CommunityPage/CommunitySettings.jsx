// CommunityPage/CommunitySettings.jsx

import React from 'react';

const CommunitySettings = ({ community }) => {
  return (
    <div className="community-settings">
      <h2>Community Settings</h2>
      {community ? (
        <div>
          <p>Settings for {community.name} will be displayed here.</p>
          {/* Add settings form and logic here */}
        </div>
      ) : (
        <p>Loading community settings...</p>
      )}
    </div>
  );
};

export default CommunitySettings;
