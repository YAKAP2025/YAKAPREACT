// src/components/BPMMetricsOverview.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { parseISO } from 'date-fns';

const BPMMetricsOverview = () => {
  const [metrics, setMetrics] = useState({
    total: 0,
    high: 0,
    normal: 0,
    low: 0,
    // optional: how many of each in the last hour:
    deltaHigh: 0,
    deltaNormal: 0,
    deltaLow: 0,
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/getData');
        const data = res.data || [];

        // categorize
        let total = data.length;
        let high = 0, normal = 0, low = 0;
        let deltaHigh = 0, deltaNormal = 0, deltaLow = 0;
        const oneHourAgo = new Date(Date.now() - 1000 * 60 * 60);

        data.forEach(r => {
          const bpm = r.bpm;
          const ts = parseISO(r.timestamp);
          const isRecent = ts > oneHourAgo;

          if (bpm > 100) {
            high++;
            if (isRecent) deltaHigh++;
          } else if (bpm < 60) {
            low++;
            if (isRecent) deltaLow++;
          } else {
            normal++;
            if (isRecent) deltaNormal++;
          }
        });

        setMetrics({ total, high, normal, low, deltaHigh, deltaNormal, deltaLow });
      } catch (err) {
        console.error('Error loading BPM metrics:', err);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 60_000); // refresh each minute
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/** Total Readings **/}
      <div className="col-xxl-3 col-xl-4 col-sm-6">
        <div className="card p-3 shadow-2 radius-8 h-100 bg-gradient-end-1">
          <div className="card-body p-0">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="d-flex align-items-center gap-2">
                <span className="bg-primary-50 text-primary-600 w-48 h-48 d-flex justify-content-center align-items-center rounded-circle">
                  <i className="ri-honour-line fs-4"></i>
                </span>
                <div>
                  <h6 className="fw-semibold mb-1">{metrics.total}</h6>
                  <small className="text-secondary-light">Total Readings</small>
                </div>
              </div>
            </div>
            <p className="text-sm mb-0">
              <span className="text-primary-600">Updated</span> just now
            </p>
          </div>
        </div>
      </div>

      {/** High BPM **/}
      <div className="col-xxl-3 col-xl-4 col-sm-6">
        <div className="card p-3 shadow-2 radius-8 h-100 bg-gradient-end-2">
          <div className="card-body p-0">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="d-flex align-items-center gap-2">
                <span className="bg-danger-50 text-danger-600 w-48 h-48 d-flex justify-content-center align-items-center rounded-circle">
                  <i className="ri-heart-pulse-fill fs-4"></i>
                </span>
                <div>
                  <h6 className="fw-semibold mb-1">{metrics.high}</h6>
                  <small className="text-secondary-light">High-BPM Events</small>
                </div>
              </div>
            </div>
            <p className="text-sm mb-0">
              <span className="text-danger-600">+{metrics.deltaHigh}</span> last hour
            </p>
          </div>
        </div>
      </div>

      {/** Normal BPM **/}
      <div className="col-xxl-3 col-xl-4 col-sm-6">
        <div className="card p-3 shadow-2 radius-8 h-100 bg-gradient-end-3">
          <div className="card-body p-0">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="d-flex align-items-center gap-2">
                <span className="bg-success-50 text-success-600 w-48 h-48 d-flex justify-content-center align-items-center rounded-circle">
                  <i className="ri-medal-fill fs-4"></i>
                </span>
                <div>
                  <h6 className="fw-semibold mb-1">{metrics.normal}</h6>
                  <small className="text-secondary-light">Normal-BPM Events</small>
                </div>
              </div>
            </div>
            <p className="text-sm mb-0">
              <span className="text-success-600">+{metrics.deltaNormal}</span> last hour
            </p>
          </div>
        </div>
      </div>

      {/** Low BPM **/}
      <div className="col-xxl-3 col-xl-4 col-sm-6">
        <div className="card p-3 shadow-2 radius-8 h-100 bg-gradient-end-4">
          <div className="card-body p-0">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="d-flex align-items-center gap-2">
                <span className="bg-info-50 text-info-600 w-48 h-48 d-flex justify-content-center align-items-center rounded-circle">
                  <i className="ri-arrow-down-line fs-4"></i>
                </span>
                <div>
                  <h6 className="fw-semibold mb-1">{metrics.low}</h6>
                  <small className="text-secondary-light">Low-BPM Events</small>
                </div>
              </div>
            </div>
            <p className="text-sm mb-0">
              <span className="text-info-600">+{metrics.deltaLow}</span> last hour
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default BPMMetricsOverview;
