import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Auth from './components/Auth';
import LoginForm from './components/Login/EmployeeLogin';
import RegisterForm from './components/Register/Register';
import Dashboard from './components/Dashboard/Dashboard';
import UploadVideo from './components/UploadVideo/UploadVideo';
import VideoList from './components/VideoList/VideoList';
import VideoDetails from './components/VideoDetails/VideoDetails';

function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/dash" element={<Dashboard />} />
      <Route path="/upload" element={<UploadVideo />} />
      <Route path="/videos" element={<VideoList />} />
          <Route path="/videos/:id" element={<VideoDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
