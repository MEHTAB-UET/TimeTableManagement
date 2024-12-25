// Dashboard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Dashboard</h1>
      <button
        onClick={() => navigate("/add-professor")}
        style={{ margin: "10px", padding: "10px" }}
      >
        Add Professor
      </button>
      <button
        onClick={() => navigate("/assign-lecture")}
        style={{ margin: "10px", padding: "10px" }}
      >
        Assign Lecture
      </button>
      <button
        onClick={() => navigate("/see-all-lectures")}
        style={{ margin: "10px", padding: "10px" }}
      >
        See All Lectures
      </button>
    </div>
  );
};

export default Dashboard;
