import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';

// Component imports
import Navbar from './components/Navbar';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import VideoList from './components/videos/VideoList';
import VideoUpload from './components/videos/VideoUpload';
import VideoPlayer from './components/videos/VideoPlayer';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  return (
    <div className="App">
      <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
      <Routes>
        <Route 
          path="/" 
          element={isAuthenticated ? <VideoList /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/login" 
          element={<Login setIsAuthenticated={setIsAuthenticated} setUser={setUser} />} 
        />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/upload" 
          element={isAuthenticated ? <VideoUpload /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/video/:id" 
          element={isAuthenticated ? <VideoPlayer /> : <Navigate to="/login" />} 
        />
      </Routes>
    </div>
  );
}

export default App;
