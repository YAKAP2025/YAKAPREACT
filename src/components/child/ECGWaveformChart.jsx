// src/components/child/ECGWaveformChart.jsx
import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';

const ECGWaveformChart = () => {
  const [chartData, setChartData] = useState({
    series: [{
      name: 'ECG',
      data: [] // Format: [timestamp, value]
    }],
    options: {
      chart: {
        type: 'area',
        height: 350,
        animations: {
          enabled: true,
          easing: 'linear',
          dynamicAnimation: {
            speed: 1000
          }
        },
        toolbar: { show: false },
        zoom: { enabled: false },
        dataLabels: { enabled: false }
      },
      stroke: {
        curve: 'smooth',
        width: 2
      },
      fill: {
        opacity: 0.3,
      },
      xaxis: {
        type: 'datetime',
        labels: { datetimeUTC: false },
        title: { text: 'Time' }
      },
      yaxis: {
        min: 50,
        max: 250,
        title: { text: 'ECG Value / BPM' }
      },
      tooltip: {
        x: { format: 'HH:mm:ss' }
      }
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Adjust endpoint as needed
        const response = await axios.get('http://localhost:5001/api/getData');
        if (response.data && response.data.length > 0) {
          // Get the latest reading (or simulate a value if needed)
          const newDataPoint = response.data[0];
          const point = [new Date(newDataPoint.timestamp).getTime(), newDataPoint.bpm];
          setChartData(prev => {
            const currentData = prev.series[0].data;
            // Append new point, keep only the latest 20 points to simulate scrolling
            const updatedData = [...currentData, point].slice(-20);
            return {
              ...prev,
              series: [{ name: 'ECG', data: updatedData }]
            };
          });
        }
      } catch (error) {
        console.error('Error fetching ECG data:', error);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="col-xxl-12">
      <div className="card h-100">
        <div className="card-header border-bottom">
          <h6 className="fw-bold text-lg mb-0">Real-Time ECG Waveform (Area Chart)</h6>
        </div>
        <div className="card-body p-24">
          <ReactApexChart options={chartData.options} series={chartData.series} type="area" height={350} />
        </div>
      </div>
    </div>
  );
};

export default ECGWaveformChart;