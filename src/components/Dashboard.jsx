import React, { useEffect, useState } from 'react';
import VideoList from './VideoList';
import VideoUpload from './VideoUpload';
import axios from 'axios';

function Dashboard() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('http://localhost:5000/api/videos', {
        headers: { Authorization: token },
      });
      setVideos(data);
    };
    fetchVideos();
  }, []);

  return (
    <div>
      <VideoUpload />
      <VideoList videos={videos} />
    </div>
  );
}

export default Dashboard;