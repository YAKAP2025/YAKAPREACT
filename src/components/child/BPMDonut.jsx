import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import axios from "axios";

// Define a maximum BPM threshold for the donut representation.
const MAX_BPM = 250;

const BPMDonut = () => {
  const [bpm, setBpm] = useState(0);

  // This state holds the chart configuration
  const [chartData, setChartData] = useState({
    series: [0, MAX_BPM], // The first slice is current BPM, the second slice is "remaining"
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
      // We’ll dynamically update the colors array in useEffect
      colors: ["green", "#E2E2E2"],
      labels: ["Current BPM", "Remaining Range"],
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              total: {
                show: true,
                // This label is displayed in the donut center
                label: "BPM",
                formatter: function (w) {
                  // w.globals.series[0] is the first slice (our BPM)
                  return w.globals.series[0].toFixed(0);
                },
              },
            },
          },
        },
      },
      legend: {
        show: true,
        position: "bottom",
      },
      stroke: {
        width: 1,
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val.toFixed(0) + " BPM";
          },
        },
      },
      // We'll configure the y-axis logic in the slice values, so xaxis not needed for a donut
    },
  });

  // Function to determine the donut color based on BPM
  const getBpmColor = (value) => {
    if (value < 60) return "blue";   // Dangerously low
    if (value > 100) return "red";   // Dangerously high
    return "green";                  // Normal
  };

  useEffect(() => {
    // Fetch the BPM data from your backend
    const fetchBpm = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/getData");
        if (response.data && response.data.length > 0) {
          // Assume the latest reading is the first object
          const newData = response.data[0];
          const currentBpm = newData.bpm;
          setBpm(currentBpm);

          // Our series: [currentBpm, MAX_BPM - currentBpm]
          // The second slice represents the "remaining" portion of the donut
          const updatedSeries = [
            currentBpm,
            Math.max(MAX_BPM - currentBpm, 0), // Ensure it doesn't go negative
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
    // Poll every 3 seconds for new data
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
