import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./VideoList.css";
import axiosInstance from "../../utils/axiosConfig";

const VideoList = () => {
  const [videos, setVideos] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axiosInstance.get("/videos");
        setVideos(response.data);
      } catch (error) {
        console.error("Error fetching videos", error);
      }
    };
    fetchVideos();
  }, []);
  

  const filteredVideos = videos.filter((video) => {
    if (filter === "All") return true;
    // Add filtering logic based on video metadata (e.g., tags or categories)
    return video.tags.includes(filter);
  });

  const searchedVideos = filteredVideos.filter((video) =>
    video.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="video-list-container">
      <h2>Uploaded Videos</h2>
      <div className="video-list-controls">
        <input
          type="text"
          placeholder="Search videos"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="All">All</option>
          <option value="Hype">Hype</option>
          <option value="Reach">Reach</option>
          <option value="Trend">Trend</option>
        </select>
      </div>

      <div className="video-grid">
        {searchedVideos.map((video) => (
          <Link key={video._id} to={`/videos/${video._id}`} className="video-card">
            <h3>{video.title}</h3>
            <p>{video.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default VideoList;
