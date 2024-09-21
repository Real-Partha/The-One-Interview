// CommunityPage/CommunityOverview.jsx

import React from 'react';

const CommunityOverview = ({ community }) => {
  return (
    <div className="community-overview">
      <h2>Community Overview</h2>
      {community ? (
        <div>
          <h3>{community.name}</h3>
          <p>{community.description}</p>
          {/* Add more community details here */}
        </div>
      ) : (
        <p>Loading community information...</p>
      )}
    </div>
  );
};

export default CommunityOverview;
