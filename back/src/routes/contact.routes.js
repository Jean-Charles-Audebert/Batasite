const express = require('express');
const router = express.Router();
const { sendContactEmail } = require('../services/email.service');
const logger = require('../utils/logger');

/**
 * POST /contact/send
 * Envoyer un message de contact
 */
router.post('/send', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        error: 'Missing required fields: name, email, message',
      });
    }

    // Validation email simple
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Invalid email format',
      });
    }

    // Validation longueur
    if (name.length < 2 || name.length > 100) {
      return res.status(400).json({
        error: 'Name must be between 2 and 100 characters',
      });
    }

    if (message.length < 10 || message.length > 2000) {
      return res.status(400).json({
        error: 'Message must be between 10 and 2000 characters',
      });
    }

    // Envoyer l'email
    await sendContactEmail(name, email, message);

    logger.info(`Contact email received from ${name} (${email})`);

    res.status(200).json({
      success: true,
      message: 'Your message has been sent successfully',
    });
  } catch (error) {
    logger.error(`Error in contact endpoint: ${error.message}`);
    res.status(500).json({
      error: 'Failed to send message. Please try again later.',
    });
  }
});

module.exports = router;
