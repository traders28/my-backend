// server.js (Node.js Backend with Express)
const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Firebase setup
const serviceAccount = require('./serviceAccountKey.json'); // Replace with your Firebase service key
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://your-project-id.firebaseio.com',
});

const db = admin.firestore();

// API routes
app.get('/api/data', async (req, res) => {
  try {
    const snapshot = await db.collection('data').get();
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/data', async (req, res) => {
  try {
    const newData = req.body;
    const docRef = await db.collection('data').add(newData);
    res.status(201).json({ id: docRef.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete data
app.delete('/api/data/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('data').doc(id).delete();
    res.status(200).send('Document successfully deleted!');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update data
app.put('/api/data/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    await db.collection('data').doc(id).update(updatedData);
    res.status(200).send('Document successfully updated!');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
