// src/components/child/LeadOffTimelineChart.jsx

import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';

const LeadOffTimelineChart = () => {
  // Series holds [timestamp, 1] for each lead-off event
  const [series, setSeries] = useState([
    { name: 'Lead-Off Events', data: [] }
  ]);

  // Chart configuration
  const options = {
    chart: {
      id: 'leadOff-timeline',
      type: 'area',
      animations: {
        enabled: true,
        easing: 'linear',
        dynamicAnimation: { speed: 1000 }
      },
      toolbar: { show: false },
      zoom: { enabled: false }
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    markers: {
      size: 4
    },
    xaxis: {
      type: 'datetime',
      labels: { datetimeUTC: false },
      title: { text: 'Time (Last 24 hrs)' }
    },
    yaxis: {
      min: 0,
      max: 1,
      tickAmount: 1,
      labels: {
        formatter: () => ''  // we only care about the dots
      }
    },
    tooltip: {
      x: { format: 'MMM dd, HH:mm:ss' },
      y: { show: false }
    }
  };

  useEffect(() => {
    const fetchLeadOffEvents = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/leadOffEvents');
        // map to [timestamp-ms, 1] so each event shows as a dot at y=1
        const data = res.data.map((evt) => [
          new Date(evt.timestamp).getTime(),
          1
        ]);
        setSeries([{ name: 'Lead-Off Events', data }]);
      } catch (err) {
        console.error('Error fetching lead-off events:', err);
      }
    };

    fetchLeadOffEvents();
    const interval = setInterval(fetchLeadOffEvents, 60 * 60 * 1000); // refresh hourly

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="col-xxl-12">
      <div className="card h-100">
        <div className="card-header border-bottom">
          <h6 className="fw-bold text-lg mb-0">Lead-Off Timeline (Last 24 hrs)</h6>
        </div>
        <div className="card-body p-24">
          <ReactApexChart
            options={options}
            series={series}
            type="area"
            height={300}
          />
        </div>
      </div>
    </div>
  );
};

export default LeadOffTimelineChart;