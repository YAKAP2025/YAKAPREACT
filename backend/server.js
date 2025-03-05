const admin = require('firebase-admin');
const serviceAccount = require('./yakap-project-firebase-adminsdk-fbsvc-a0269a0ccf.json'); // Ensure this path is correct

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // databaseURL: "https://your-firebase-project.firebaseio.com" // Replace with your Firebase project URL
});

const db = admin.firestore();
