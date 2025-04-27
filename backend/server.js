// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(bodyParser.json());

// Global in-memory variables
let latestSensorData = null;
const sensorHistory = [];  // store every submission

// Endpoint to receive sensor data from the device
app.post('/api/submitData', (req, res) => {
  const data = req.body;
  data.timestamp = new Date().toISOString();

  // Store the sensor data
  latestSensorData = data;
  sensorHistory.push(data);

  console.log('Received sensor data:', data);
  res.status(200).json({ status: 'success', data });
});

// Endpoint to retrieve the latest sensor data
app.get('/api/getData', (req, res) => {
  if (!latestSensorData) {
    return res
      .status(404)
      .json({ status: 'error', error: 'No sensor data available' });
  }
  res.status(200).json(latestSensorData);
});

// NEW — Endpoint to retrieve *all* sensor readings
app.get('/api/getAllData', (req, res) => {
  res.status(200).json(sensorHistory);
});

// Endpoint to retrieve lead-off detection events in the last 24 hours
app.get('/api/leadOffEvents', (req, res) => {
  try {
    const sinceTimestamp = Date.now() - 24 * 60 * 60 * 1000; // 24 hrs ago
    const events = sensorHistory
      .filter(entry =>
        entry.leadOff === true &&
        new Date(entry.timestamp).getTime() >= sinceTimestamp
      )
      .map(entry => ({ timestamp: entry.timestamp }));

    res.status(200).json(events);
  } catch (err) {
    console.error('Error retrieving lead-off events:', err);
    res.status(500).json({ status: 'error', error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});