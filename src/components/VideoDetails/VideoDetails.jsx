import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./VideoDetails.css";

const VideoDetails = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/videos/${id}`);
        setVideo(response.data);
      } catch (error) {
        console.error("Error fetching video details", error);
      }
    };

    fetchVideo();
  }, [id]);

  if (!video) return <p>Loading...</p>;

  return (
    <div className="video-details-container">
      <h2>{video.title}</h2>
      <p>{video.description}</p>
      <p><strong>Tags:</strong> {video.tags.join(", ")}</p>
      <iframe
        src={video.videoLink}
        title={video.title}
        frameBorder="0"
        allowFullScreen
      ></iframe>
      <p><strong>Uploaded At:</strong> {new Date(video.createdAt).toLocaleString()}</p>
    </div>
  );
};

export default VideoDetails;
