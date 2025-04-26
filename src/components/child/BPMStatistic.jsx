// src/components/BPMStatistics.jsx
import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';

const BPMStatistics = () => {
  const [timeframe, setTimeframe] = useState('Last 24 Hours');
  const [highCount, setHighCount]     = useState(0);
  const [lowCount, setLowCount]       = useState(0);
  const [chartOptions, setChartOptions] = useState({
    chart: {
      type: 'area',
      height: 260,
      toolbar: { show: false },
      animations: {
        enabled: true,
        easing: 'linear',
        dynamicAnimation: { speed: 1000 }
      }
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    fill: {
      opacity: 0.3
    },
    xaxis: {
      type: 'datetime',
      labels: { datetimeUTC: false },
      title: { text: 'Time' }
    },
    yaxis: {
      min: 0,
      title: { text: 'Count' },
      labels: {
        formatter: (val) => Math.round(val)
      }
    },
    tooltip: {
      x: { format: 'MMM dd, yyyy HH:mm' },
      y: {
        formatter: (val) => `${Math.round(val)} BPM`
      }
    },
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'center',
      offsetY: 0
    },
    colors: ['#E53935', '#1E88E5'] // red for High BPMs, blue for Low BPMs
  });

  const [series, setSeries] = useState([
    { name: 'High BPMs', data: [] },
    { name: 'Low BPMs',  data: [] }
  ]);

  useEffect(() => {
    // Fetch data and rebuild both the counts and the time-series
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/getData', {
          params: { timeframe } // if your backend supports filtering by timeframe
        });
        const data = res.data; // assume array of { timestamp, bpm }

        // Calculate high/low counts over the period
        const now = Date.now();
        const cutoff = now - 24 * 60 * 60 * 1000;
        const recent = data.filter(d => new Date(d.timestamp).getTime() >= cutoff);

        const highs = recent.filter(d => d.bpm > 100).length;
        const lows  = recent.filter(d => d.bpm < 60).length;
        setHighCount(highs);
        setLowCount(lows);

        // Build two series of [time, count-per-minute] or raw BPM values (depending on design)
        // Here, we’ll plot the raw bpm values for each point. Split into two series:
        const highPoints = recent
          .filter(d => d.bpm > 100)
          .map(d => [new Date(d.timestamp).getTime(), d.bpm]);
        const lowPoints = recent
          .filter(d => d.bpm < 60)
          .map(d => [new Date(d.timestamp).getTime(), d.bpm]);

        setSeries([
          { name: `High BPMs: ${highs}`, data: highPoints },
          { name: `Low BPMs: ${lows}`,   data: lowPoints }
        ]);
      } catch (err) {
        console.error('Error fetching BPM statistics:', err);
      }
    };

    fetchData();
    const id = setInterval(fetchData, 60 * 1000); // update every minute
    return () => clearInterval(id);
  }, [timeframe]);

  return (
    <div className='col-xxl-12'>
      <div className='card h-100'>
        <div className='card-header d-flex align-items-center justify-content-between'>
          <h6 className='fw-bold text-lg mb-0'>BPM Statistics</h6>
          <select
            className='form-select form-select-sm w-auto'
            value={timeframe}
            onChange={e => setTimeframe(e.target.value)}
          >
            <option>Last 24 Hours</option>
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
          </select>
        </div>
        <div className='card-body p-24'>
          <ul className='d-flex flex-wrap align-items-center justify-content-center my-3 gap-3'>
            <li className='d-flex align-items-center gap-2'>
              <span className='w-12-px h-8-px rounded-pill bg-red-600' />
              <span className='text-sm fw-semibold'>
                High BPMs:
                <span className='fw-bold ms-1'>{highCount}</span>
              </span>
            </li>
            <li className='d-flex align-items-center gap-2'>
              <span className='w-12-px h-8-px rounded-pill bg-blue-600' />
              <span className='text-sm fw-semibold'>
                Low BPMs:
                <span className='fw-bold ms-1'>{lowCount}</span>
              </span>
            </li>
          </ul>

          <ReactApexChart
            options={chartOptions}
            series={series}
            type='area'
            height={260}
            width='100%'
          />
        </div>
      </div>
    </div>
  );
};

export default BPMStatistics;