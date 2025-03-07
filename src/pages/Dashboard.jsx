import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";

const Dashboard = () => {
  const [alerts, setAlerts] = useState([]);
  const [latestBPM, setLatestBPM] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/getData');
        if (response.data.length > 0) {
          setLatestBPM(response.data[0].bpm);
        }
      } catch (error) {
        console.error('Error fetching BPM:', error);
      }
    };
    fetchData();
    const intervalId = setInterval(fetchData, 3000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="kpi-cards">
        <div className="card">Current BPM: {latestBPM || 'N/A'}</div>
        <div className="card">Active Monitoring: 1</div>
        <div className="card">Alerts: {alerts.length}</div>
      </div>
    </div>
  );
};

export default Dashboard;
