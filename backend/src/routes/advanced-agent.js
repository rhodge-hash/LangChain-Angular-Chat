import express from 'express';
import { processAdvancedPrompt } from '../services/advanced-agent.service.js';

const router = express.Router();

router.post('/advanced-agent-chat', async (req, res) => {
  const { prompt, sessionId } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt cannot be empty.' });
  }
  if (!sessionId) {
    return res.status(400).json({ error: 'Session ID is required.' });
  }

  try {
    const result = await processAdvancedPrompt(prompt, sessionId);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error processing advanced prompt:', error);
    res.status(500).json({ error: error.message || 'An error occurred while processing the advanced prompt.' });
  }
});

export default router;
