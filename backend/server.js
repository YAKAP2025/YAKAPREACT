const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(bodyParser.json());

// Global in-memory variable to store the latest sensor data
let latestSensorData = null;

// Endpoint to receive sensor data from the device
app.post('/api/submitData', (req, res) => {
  const data = req.body;
  data.timestamp = new Date().toISOString();
  
  // Store the sensor data directly in memory
  latestSensorData = data;
  
  console.log('Received sensor data:', data);
  res.status(200).json({ status: 'success', data });
});

// Endpoint to retrieve the latest sensor data
app.get('/api/getData', (req, res) => {
  if (!latestSensorData) {
    return res.status(404).json({ status: 'error', error: 'No sensor data available' });
  }
  res.status(200).json(latestSensorData);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
