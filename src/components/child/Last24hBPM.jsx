// src/components/child/Last24hBPM.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

const Last24hBPM = () => {
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReadings = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/getData');
        const all = res.data || [];
        const cutoff = Date.now() - 24 * 60 * 60 * 1000;
        // filter to last 24 hours
        const last24 = all.filter(r => {
          const t = new Date(r.timestamp).getTime();
          return t >= cutoff;
        });
        setReadings(last24);
      } catch (err) {
        console.error('Error loading BPM readings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReadings();
    // optionally re-fetch every minute:
    const id = setInterval(fetchReadings, 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="col-xxl-12 col-xl-6">
      <div className="card">
        <div className="card-header d-flex align-items-center justify-content-between">
          <h6 className="mb-0 fw-bold text-lg">Last 24 hrs BPM</h6>
          <Link to="#" className="text-primary-600 hover-text-primary d-flex align-items-center gap-1">
            View All
            <iconify-icon icon="solar:alt-arrow-right-linear" className="icon" />
          </Link>
        </div>
        <div className="card-body p-24">
          {loading ? (
            <p className="text-secondary-light">Loading…</p>
          ) : readings.length === 0 ? (
            <p className="text-secondary-light">No readings in the last 24 hours.</p>
          ) : (
            <ul className="list-unstyled">
              {readings.map((r, idx) => {
                const dt = new Date(r.timestamp);
                return (
                  <li key={idx} className="d-flex align-items-center justify-content-between py-12 border-bottom">
                    <div className="d-flex flex-column">
                      <span className="fw-semibold text-md">BPM: {r.bpm}</span>
                      <span className="text-sm text-secondary-light">
                        {format(dt, 'PPpp')}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Last24hBPM;