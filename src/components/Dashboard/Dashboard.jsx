import React from "react";
import { Link, Routes, Route } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Anantadi</h1>
        <nav>
          <Link to="/upload">Upload Video</Link>
          <Link to="/videos">Uploaded Videos</Link>
        </nav>
      </header>

    </div>
  );
};

export default Dashboard;
