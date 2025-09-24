import express from 'express';
import { authService } from '../services/auth.service.js';
import { authRateLimiter, loginRateLimiter } from '../middleware/rate-limit.js'; // Import rate limiters

const router = express.Router();

router.post('/register', authRateLimiter, async (req, res) => { // Apply authRateLimiter
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    await authService.registerUser(email, password);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    if (error.message === 'User already exists') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/login', loginRateLimiter, async (req, res) => { // Apply loginRateLimiter
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const { accessToken, refreshToken } = await authService.loginUser(email, password);
    res.status(200).json({ token: accessToken, refreshToken: refreshToken });
  } catch (error) {
    if (error.message === 'Invalid credentials') {
      return res.status(401).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/refresh-token', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token is required' });
    }
    const newAccessToken = await authService.refreshAccessToken(refreshToken);
    res.status(200).json({ token: newAccessToken });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

export default router;