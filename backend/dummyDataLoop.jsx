const axios = require('axios');

async function sendDummyData() {
  // Generate a random BPM between 75 and 200
  const randomBPM = Math.floor(Math.random() * (200 - 75 + 1)) + 75;
  try {
    const response = await axios.post('http://localhost:5001/api/submitData', {
      deviceId: 'DUMMY_DEVICE',
      bpm: randomBPM
    });
    console.log(`Sent BPM: ${randomBPM} | Response:`, response.data);
  } catch (error) {
    console.error("Error sending dummy data:", error.message);
  }
}

// Run the function every 1 second (1000 milliseconds)
setInterval(sendDummyData, 1000);
