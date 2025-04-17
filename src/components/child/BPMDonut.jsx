import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import axios from "axios";

// Maximum value for the BPM range (donut chart total)
const MAX_BPM = 250;

const BPMDonut = () => {
  const [bpm, setBpm] = useState(0);

  const [chartData, setChartData] = useState({
    series: [0, MAX_BPM], // First slice: current BPM; second slice: the remaining range
    options: {
      chart: {
        type: "donut",
        height: 350,
        animations: {
          enabled: true,
          easing: "linear",
          dynamicAnimation: { speed: 1000 },
        },
        toolbar: { show: false },
      },
      colors: ["green", "#E2E2E2"], // Dynamic color updated based on BPM
      labels: ["Current BPM", "Remaining Range"],
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              total: {
                show: true,
                label: "BPM",
                formatter: function (w) {
                  // w.globals.series[0] holds our current BPM value
                  return w.globals.series[0].toFixed(0);
                },
              },
            },
          },
        },
      },
      legend: { show: true, position: "bottom" },
      stroke: { width: 1 },
      tooltip: {
        y: {
          formatter: (val) => val.toFixed(0) + " BPM",
        },
      },
    },
  });

  // Function to determine the line color based on the BPM value
  const getBpmColor = (value) => {
    if (value < 60) return "blue";   // Dangerously low BPM → blue
    if (value > 100) return "red";   // Dangerously high BPM → red
    return "green";                  // Normal BPM → green
  };

  useEffect(() => {
    const fetchBpm = async () => {
      try {
        // Use your server's IP address (not localhost on a physical ESP32)
        const response = await axios.get("http://192.168.0.197:5001/api/getData");
        // Check if the response data contains a bpm property
        if (response.data && response.data.bpm) {
          const currentBpm = response.data.bpm;
          setBpm(currentBpm);

          // Update the series: first slice is current BPM, the second is MAX_BPM minus current BPM
          const updatedSeries = [
            currentBpm,
            Math.max(MAX_BPM - currentBpm, 0)
          ];

          setChartData((prev) => ({
            ...prev,
            series: updatedSeries,
            options: {
              ...prev.options,
              colors: [getBpmColor(currentBpm), "#E2E2E2"],
            },
          }));
        }
      } catch (error) {
        console.error("Error fetching BPM data:", error);
      }
    };

    fetchBpm();
    // Fetch new BPM data every 3 seconds
    const intervalId = setInterval(fetchBpm, 3000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="col-xxl-12 col-xl-6">
      <div className="card h-100 radius-8">
        <div className="card-header border-bottom d-flex align-items-center justify-content-between">
          <h6 className="fw-bold text-lg mb-0">Heart Rate (Donut)</h6>
          <span className="text-sm text-secondary-light">Current: {bpm} BPM</span>
        </div>
        <div className="card-body p-24">
          <ReactApexChart
            options={chartData.options}
            series={chartData.series}
            type="donut"
            height={260}
          />
        </div>
      </div>
    </div>
  );
};

export default BPMDonut;