const express = require('express');
const fortiFi = require('fortifi');  // Import the fortiFi middleware

const app = express();

// Middleware for parsing JSON
app.use(express.json());

// Apply the financial guardrail middleware
app.post('/ask', fortiFi, (req, res) => {
  res.send("Your question is being processed.");
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});