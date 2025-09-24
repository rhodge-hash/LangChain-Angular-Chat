import express from 'express';
import { generateBlogPost, getBlogPosts } from '../services/blog.service.js';

const router = express.Router();

router.post('/generate-blog-post', async (req, res) => {
  const { topic } = req.body;
  if (!topic) {
    return res.status(400).json({ error: 'Topic is required' });
  }

  try {
    const newPost = await generateBlogPost(topic);
    res.status(200).json(newPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/blog-posts', (req, res) => {
  const posts = getBlogPosts();
  res.status(200).json(posts);
});

export default router;
