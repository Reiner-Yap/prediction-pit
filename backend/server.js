const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

// Enable CORS for your React app
app.use(cors({
  origin: 'http://localhost:3000', // Your React app runs here
}));

// Parse JSON bodies
app.use(express.json());

// Create a simple API endpoint
app.get('/api/message', (req, res) => {
  res.json({ message: 'Hello from backend!' });
});

// Another endpoint that accepts POST data
app.post('/api/data', (req, res) => {
  console.log('Received:', req.body);
  res.json({ 
    success: true, 
    received: req.body,
    message: 'Data received successfully!' 
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});