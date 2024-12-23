import React, { useState } from 'react';
import axios from 'axios';

function VideoUpload() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');

  const handleUpload = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.post(
        'https://video-management-app.onrender.com/api/videos/upload',
        { title, description, tags: tags.split(',') },
        { headers: { Authorization: token } }
      );
      alert('Video uploaded!');
    } catch (error) {
      alert('Upload failed');
    }
  };

  return (
    <div>
      <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <input type="text" placeholder="Tags (comma-separated)" value={tags} onChange={(e) => setTags(e.target.value)} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}

export default VideoUpload;
