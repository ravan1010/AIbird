import express from "express";
import Score from "../models/Score.js";

const router = express.Router();

// Get top 10 scores
router.get('/', async (req, res) => {
  try {
    const top = await Score.find().sort({ value: -1 }).limit(10);
    res.json(top);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Post a new score
router.post('/', async (req, res) => {
  try {
    const { name, value } = req.body;
    if (!name || typeof value !== 'number') return res.status(400).json({ error: 'Invalid payload' });
    const s = new Score({ name, value });
    await s.save();
    res.status(201).json(s);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
