import express from 'express';
import agentRoutes from './routes/agent';
import blogRoutes from './routes/blog';
import cors from 'cors'; // Import cors

const app = express();

app.use(express.json());
app.use(cors()); // Enable CORS for all routes

app.use('/api', agentRoutes);
app.use('/api', blogRoutes);

// Basic error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

export default app;