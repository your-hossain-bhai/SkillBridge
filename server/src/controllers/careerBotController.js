/**
 * CareerBot Controller
 */
import { getCareerBotResponse } from '../services/ai/careerBot.js';
import User from '../models/User.js';

/**
 * Chat with CareerBot
 * POST /api/careerbot/chat
 */
export const chatWithCareerBot = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Get user profile for context
    const user = await User.findById(req.user._id).select('-passwordHash');

    const response = await getCareerBotResponse(message, user);

    res.json({
      success: true,
      response
    });
  } catch (error) {
    console.error('CareerBot chat error:', error);
    res.status(500).json({ error: 'Failed to get response from CareerBot' });
  }
};

