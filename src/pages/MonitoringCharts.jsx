import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import "./MonitoringCharts.css";

const MonitoringCharts = () => {
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/getData');
        const data = response.data;
        setChartData({
          labels: data.map(d => new Date(d.timestamp).toLocaleTimeString()),
          datasets: [{
            label: 'Heart Rate (BPM)',
            data: data.map(d => d.bpm),
            fill: false,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            tension: 0.2,  // Smoothing effect
          }]
        });
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };
    fetchData();
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="monitoring-charts">
      <h1>Monitoring Charts</h1>
      <Line data={chartData} />
    </div>
  );
};

export default MonitoringCharts;
