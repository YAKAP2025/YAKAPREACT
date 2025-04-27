// src/components/child/BPMDistributionChart.jsx

import React from 'react';
import useReactApexChart from '../../hook/useReactApexChart';
import ReactApexChart from 'react-apexcharts';

const BPMDistributionChart = () => {
  // pull in your base options & series from your hook
  const { radialMultipleBarOptions, radialMultipleBarSeries } = useReactApexChart();

  // override the center labels so it no longer shows "Pediatrics" etc.
  const options = {
    ...radialMultipleBarOptions,
    plotOptions: {
      ...radialMultipleBarOptions.plotOptions,
      radialBar: {
        ...radialMultipleBarOptions.plotOptions.radialBar,
        hollow: {
          // adjust hollow size if you like
          size: '55%',
        },
        dataLabels: {
          name: {
            show: true,
            fontSize: '16px',
            color: '#333',
            offsetY: 10,
            formatter: () => 'BPM'
          },
          value: {
            show: true,
            fontSize: '24px',
            color: '#111',
            offsetY: -10,
            formatter: (val) => (val ? `${val}%` : '')
          }
        }
      }
    }
  };

  return (
    <div className="col-xxl-6">
      <div className="card h-100">
        <div className="card-header border-bottom py-16 px-24">
          <h6 className="fw-bold text-lg mb-0">BPM Events Distribution</h6>
        </div>
        <div className="card-body p-24 d-flex align-items-center gap-16">
          {/* Chart */}
          <div className="flex-grow-1">
            <ReactApexChart
              options={options}
              series={radialMultipleBarSeries}
              type="radialBar"
              height={300}
              width="100%"
            />
          </div>
          {/* Legend / Stats */}
          <ul className="d-flex flex-column gap-12 mb-0">
            <li>
              <span className="text-lg">
                High BPM:{' '}
                <span className="text-danger-600 fw-semibold">40%</span>
              </span>
            </li>
            <li>
              <span className="text-lg">
                Normal BPM:{' '}
                <span className="text-success-600 fw-semibold">50%</span>
              </span>
            </li>
            <li>
              <span className="text-lg">
                Low BPM:{' '}
                <span className="text-info-600 fw-semibold">10%</span>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BPMDistributionChart;