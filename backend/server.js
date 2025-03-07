const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
var admin = require("firebase-admin");

var serviceAccount = require("./yakap-project-firebase-adminsdk-fbsvc-51348aae9c.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const app = express();  
const port = process.env.PORT || 5001;

app.use(cors());
app.use(bodyParser.json());

app.post('/api/submitData', async (req, res) => {
  const data = req.body;
  data.timestamp = new Date().toISOString();
  try {
    await db.collection('sensorData').add(data);
    console.log('Received data:', data);
    res.status(200).json({ status: 'success', data });
  } catch (error) {
    console.error('Error writing to Firestore:', error);
    res.status(500).json({ status: 'error', error: error.message });
  }
});

app.get('/api/getData', async (req, res) => {
  try {
    const snapshot = await db.collection('sensorData')
      .orderBy('timestamp', 'desc')
      .limit(20)
      .get();
    const sensorData = snapshot.docs.map(doc => doc.data());
    res.status(200).json(sensorData);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ status: 'error', error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
