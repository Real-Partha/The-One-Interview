// CommunityPage/CommunityPosts.jsx

import React from 'react';

const CommunityPosts = ({ community }) => {
  return (
    <div className="community-posts">
      <h2>Community Posts</h2>
      {community ? (
        <div>
          <p>Posts for {community.name} will be displayed here.</p>
          {/* Add post listing logic here */}
        </div>
      ) : (
        <p>Loading community posts...</p>
      )}
    </div>
  );
};

export default CommunityPosts;
