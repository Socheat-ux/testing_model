const express = require('express');
const app = express();

// Body parser
app.use(express.json());

// Simple health route
app.get('/', (req, res) => {
  res.send('Hello World');
});

module.exports = app;
