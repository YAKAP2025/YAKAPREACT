// src/components/BPMSummaryReports.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

const BPMSummaryReports = () => {
  const [readings, setReadings] = useState([]);
  const [stats, setStats] = useState({ count: 0, avg: 0, min: 0, max: 0 });

  // Fetch all readings on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/getData');
        const data = res.data || [];
        setReadings(data);

        // Compute stats
        if (data.length) {
          const bpms = data.map(r => r.bpm);
          const sum = bpms.reduce((a, b) => a + b, 0);
          setStats({
            count: data.length,
            avg: (sum / data.length).toFixed(1),
            min: Math.min(...bpms),
            max: Math.max(...bpms),
          });
        }
      } catch (err) {
        console.error('Error loading BPM data:', err);
      }
    };
    fetchData();
  }, []);

  // Build & download CSV
  const downloadCSV = () => {
    if (!readings.length) return;
    // Header row
    const header = ['deviceId','bpm','timestamp'];
    // Data rows
    const rows = readings.map(r => [
      r.deviceId,
      r.bpm,
      // ensure ISO string
      format(new Date(r.timestamp), "yyyy-MM-dd'T'HH:mm:ssxxx")
    ]);
    const csvContent = [
      header.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');

    // Create a blob & download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    // Filename with timestamp
    a.download = `bpm_summary_${format(new Date(), 'yyyyMMdd_HHmmss')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className='col-xxl-12 col-xl-6'>
      <div className='card h-100'>
        <div className='card-header d-flex align-items-center justify-content-between'>
          <h6 className='mb-0 fw-bold'>BPM Summary Reports</h6>
          <button 
            onClick={downloadCSV}
            className='btn btn-sm btn-success d-flex align-items-center gap-1'
          >
            <i className='ri-download-2-fill'></i>
            Download CSV
          </button>
        </div>
        <div className='card-body'>
          <div className='row text-center mb-4'>
            <div className='col'>
              <div className='fs-5 fw-semibold'>{stats.count}</div>
              <div className='text-secondary'>Total Readings</div>
            </div>
            <div className='col'>
              <div className='fs-5 fw-semibold'>{stats.avg}</div>
              <div className='text-secondary'>Average BPM</div>
            </div>
            <div className='col'>
              <div className='fs-5 fw-semibold'>{stats.min}</div>
              <div className='text-secondary'>Min BPM</div>
            </div>
            <div className='col'>
              <div className='fs-5 fw-semibold'>{stats.max}</div>
              <div className='text-secondary'>Max BPM</div>
            </div>
          </div>
          <div style={{ maxHeight: 240, overflowY: 'auto' }}>
            <table className='table table-striped mb-0'>
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>BPM</th>
                </tr>
              </thead>
              <tbody>
                {readings.map((r, i) => (
                  <tr key={i}>
                    <td>{format(new Date(r.timestamp), 'MMM dd, yyyy HH:mm:ss')}</td>
                    <td>{r.bpm}</td>
                  </tr>
                ))}
                {!readings.length && (
                  <tr>
                    <td colSpan={2} className='text-center text-muted'>
                      No readings available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BPMSummaryReports;