import express from 'express';
import { processPrompt } from '../services/agent.service.js';

const router = express.Router();

router.post('/process-prompt', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt cannot be empty.' });
  }

  try {
    const response = await processPrompt(prompt);
    res.status(200).json({ response });
  } catch (error) {
    console.error('Error processing prompt:', error);
    res.status(500).json({ error: error.message || 'An error occurred while processing the prompt.' });
  }
});

export default router;
