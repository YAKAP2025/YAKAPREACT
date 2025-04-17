import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BPMDisplay = () => {
  const [latestBPM, setLatestBPM] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Replace with your actual IP address, not localhost.
        const response = await axios.get('http://192.168.0.197:5001/api/getData');
        // Check if response.data has the bpm property.
        if (response.data && response.data.bpm) {
          setLatestBPM(response.data.bpm);
        }
      } catch (error) {
        console.error('Error fetching BPM:', error);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 3000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className='col-xxl-3 col-xl-4 col-sm-6'>
      <div className='card p-3 shadow-2 radius-8 h-100 bg-gradient-end-1'>
        <div className='card-body p-0'>
          <div className='d-flex flex-wrap align-items-center justify-content-between gap-1 mb-8'>
            <div className='d-flex align-items-center gap-2'>
              <span className='mb-0 w-48-px h-48-px bg-primary-100 text-primary-600 flex-shrink-0 d-flex justify-content-center align-items-center rounded-circle'>
                <i className='ri-heart-pulse-fill' />
              </span>
              <div>
                <h6 className='fw-semibold mb-2'>
                  {latestBPM || 'N/A'}
                </h6>
                <span className='fw-medium text-secondary-light text-sm'>
                  BPM
                </span>
              </div>
            </div>
          </div>
          <p className='text-sm mb-0'>Latest reading from sensor</p>
        </div>
      </div>
    </div>
  );
};

export default BPMDisplay;
