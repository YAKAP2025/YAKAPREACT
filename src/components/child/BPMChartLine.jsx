import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';

const BPMChartLine = () => {
  const [latestBPM, setLatestBPM] = useState(null);
  const [chartData, setChartData] = useState({
    series: [{
      name: 'BPM',
      data: [] // Each point in format: [timestamp, bpm]
    }],
    options: {
      chart: {
        type: 'line',
        height: 350,
        animations: {
          enabled: true,
          easing: 'linear',
          dynamicAnimation: {
            speed: 1000,
          },
        },
        toolbar: { show: false },
        zoom: { enabled: false },
        dataLabels: { enabled: false },
      },
      stroke: {
        curve: 'smooth',
        width: 2,
      },
      colors: ['green'], // Default color is green (normal BPM)
      xaxis: {
        type: 'datetime',
        labels: { datetimeUTC: false },
        title: { text: 'Time' },
      },
      yaxis: {
        min: 50,
        max: 250,
        title: { text: 'BPM' },
      },
      tooltip: {
        x: { format: 'HH:mm:ss' },
      },
    }
  });

  // Helper function to determine the line color based on BPM reading
  const getLineColor = (bpm) => {
    if (bpm < 60) return 'blue';
    if (bpm > 100) return 'red';
    return 'green';
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Adjust the URL to match your backend IP/port
        const response = await axios.get('http://192.168.0.197:5001/api/getData');
        // Since our backend returns an object, check for bpm property:
        if (response.data && response.data.bpm) {
          const newDataPoint = response.data;
          const bpmValue = newDataPoint.bpm;
          setLatestBPM(bpmValue);
          // Create a new point: [timestamp (ms), bpm]
          const point = [new Date(newDataPoint.timestamp).getTime(), bpmValue];

          // Update the chartData: append new point and keep only the last 20 values.
          setChartData(prevData => {
            const currentData = prevData.series[0].data;
            const updatedData = [...currentData, point].slice(-20);

            return {
              ...prevData,
              series: [{ name: 'BPM', data: updatedData }],
              options: {
                ...prevData.options,
                colors: [getLineColor(bpmValue)]
              },
            };
          });
        }
      } catch (error) {
        console.error('Error fetching BPM chart data:', error);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 1000); // Poll every 1 second
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="col-xxl-12">
      <div className="card h-100">
        <div className="card-header border-bottom">
          <h6 className="fw-bold text-lg mb-0">Real-Time BPM (Line Chart)</h6>
          <p className="text-sm text-secondary-light">
            Current BPM: {latestBPM || 'N/A'}
          </p>
        </div>
        <div className="card-body p-24">
          <ReactApexChart
            options={chartData.options}
            series={chartData.series}
            type="line"
            height={350}
          />
        </div>
      </div>
    </div>
  );
};

export default BPMChartLine;
