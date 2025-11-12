import express from 'express';
import { handleN8nWebhook } from '../services/n8n/webhookHandler.js';

const router = express.Router();

/**
 * POST /api/webhooks/n8n
 * Placeholder for n8n webhook integration (Part 2)
 */
router.post('/n8n', async (req, res) => {
  try {
    const payload = req.body;
    
    // TODO: Part 2 - Process n8n webhook
    const result = await handleN8nWebhook(payload);
    
    res.status(200).json({
      success: true,
      message: 'Webhook received (Part 2: implement processing)',
      data: result
    });
  } catch (error) {
    console.error('n8n webhook error:', error);
    res.status(500).json({ 
      error: 'Webhook processing failed',
      message: error.message
    });
  }
});

export default router;

