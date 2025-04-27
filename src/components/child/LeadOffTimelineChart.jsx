// src/components/child/LeadOffTimelineChart.jsx
import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';

const LeadOffTimelineChart = () => {
  const [series, setSeries] = useState([
    { name: 'Lead-Off Events', data: [] }
  ]);
  const [options, setOptions] = useState({
    chart: {
      type: 'area',
      height: 250,
      toolbar: { show: false },
      zoom: { enabled: false },
      animations: {
        enabled: true,
        easing: 'linear',
        dynamicAnimation: { speed: 1000 }
      }
    },
    stroke: { curve: 'smooth', width: 2 },
    fill: { opacity: 0.2, colors: ['#e74c3c'] },
    xaxis: {
      type: 'datetime',
      labels: { datetimeUTC: false },
      title: { text: 'Time (last 24 h)' }
    },
    yaxis: {
      min: 0,
      max: 1,
      tickAmount: 1,
      labels: {
        formatter: () => '' // hide the numeric axis, since each event is a marker
      },
      title: { text: 'Event' }
    },
    markers: {
      size: 6,
      colors: ['#e74c3c'],
      strokeColors: '#fff',
      strokeWidth: 2,
      hover: { sizeOffset: 2 }
    },
    tooltip: {
      x: { format: 'MMM dd, HH:mm' },
      y: { formatter: () => 'Lead-Off' }
    }
  });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const resp = await axios.get('http://localhost:5001/api/leadOffEvents');
        // Map into [timestampMillis, 1]
        const data = resp.data.map(evt => [
          new Date(evt.timestamp).getTime(),
          1
        ]);
        setSeries([{ name: 'Lead-Off Events', data }]);
      } catch (err) {
        console.error('Error fetching lead-off events:', err);
      }
    };
    fetchEvents();
    const id = setInterval(fetchEvents, 60_000); // refresh every minute
    return () => clearInterval(id);
  }, []);

  return (
    <div className="col-xxl-12">
      <div className="card h-100">
        <div className="card-header border-bottom">
          <h6 className="fw-bold text-lg mb-0">Lead-Off Events Timeline</h6>
        </div>
        <div className="card-body p-24">
          {series[0].data.length > 0 ? (
            <ReactApexChart
              options={options}
              series={series}
              type="area"
              height={250}
            />
          ) : (
            <p className="text-center text-secondary-light">
              No lead-off events in the last 24 hours.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadOffTimelineChart;