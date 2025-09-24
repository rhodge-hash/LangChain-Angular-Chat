import express from 'express';
import agentRoutes from './routes/agent.js';
import blogRoutes from './routes/blog.js';
import advancedAgentRoutes from './routes/advanced-agent.js';
import cors from 'cors'; // Import cors

const app = express();

app.use(express.json());
app.use(cors()); // Enable CORS for all routes

app.use('/api', agentRoutes);
app.use('/api', blogRoutes);
app.use('/api', advancedAgentRoutes);

// Basic error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

export default app;
