const express = require('express');
const agentRoutes = require('./routes/agent');

const app = express();

app.use(express.json());

app.use('/api', agentRoutes);

// Basic error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

module.exports = app;
