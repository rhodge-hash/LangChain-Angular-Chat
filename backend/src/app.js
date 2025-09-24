import express from 'express';
import agentRoutes from './routes/agent.js';
import blogRoutes from './routes/blog.js';
import advancedAgentRoutes from './routes/advanced-agent.js';
import authRoutes from './routes/auth.routes.js';
import cors from 'cors';
import { authenticateToken } from './middleware/auth.js'; // Import authenticateToken

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api', authenticateToken, agentRoutes); // Apply authenticateToken
app.use('/api', authenticateToken, blogRoutes); // Apply authenticateToken
app.use('/api', authenticateToken, advancedAgentRoutes); // Apply authenticateToken
app.use('/api/auth', authRoutes);

// Basic error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

export default app;
