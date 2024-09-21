// CommunityPage/CommunityAnnouncements.jsx

import React from 'react';

const CommunityAnnouncements = ({ community }) => {
  return (
    <div className="community-announcements">
      <h2>Community Announcements</h2>
      {community ? (
        <div>
          <p>Announcements for {community.name} will be displayed here.</p>
          {/* Add announcement listing logic here */}
        </div>
      ) : (
        <p>Loading community announcements...</p>
      )}
    </div>
  );
};

export default CommunityAnnouncements;
