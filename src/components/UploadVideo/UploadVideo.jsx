import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./UploadVideo.css";
import axiosInstance from "../../utils/axiosConfig";

const UploadVideo = () => {
  const [videoLink, setVideoLink] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const navigate = useNavigate();

  
const handleUpload = async (e) => {
  e.preventDefault();
  try {
    const response = await axiosInstance.post("/videos", {
      videoLink,
      title,
      description,
      tags,
    });
    console.log(response.data);
    navigate("/videos");
  } catch (error) {
    console.error("Error uploading video", error);
  }
};


  return (
    <div className="upload-container">
      <h2>Upload Video</h2>
      <form onSubmit={handleUpload}>
        <input
          type="url"
          placeholder="Paste your Google Drive link"
          value={videoLink}
          onChange={(e) => setVideoLink(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        <input
          type="text"
          placeholder="Tags (comma-separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default UploadVideo;
