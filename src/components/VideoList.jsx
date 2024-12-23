import React from 'react';

function VideoList({ videos }) {
  return (
    <div>
      {videos.map((video) => (
        <div key={video._id}>
          <h3>{video.title}</h3>
          <p>{video.description}</p>
          <p>Tags: {video.tags.join(', ')}</p>
        </div>
      ))}
    </div>
  );
}

export default VideoList;
