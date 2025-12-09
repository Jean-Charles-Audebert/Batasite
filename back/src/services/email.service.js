const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

// Créer un transporteur email
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || process.env.EMAIL_HOST || 'localhost',
  port: process.env.SMTP_PORT || process.env.EMAIL_PORT || 1025,
  secure: (process.env.SMTP_PORT === '465') || (process.env.EMAIL_SECURE === 'true'),
  auth: (process.env.SMTP_USER || process.env.EMAIL_USER) ? {
    user: process.env.SMTP_USER || process.env.EMAIL_USER,
    pass: process.env.SMTP_PASS || process.env.EMAIL_PASSWORD,
  } : undefined,
});

/**
 * Envoyer un email d'invitation à créer un password
 * @param {string} email - Email du destinataire
 * @param {string} resetToken - Token de réinitialisation
 * @param {string} baseUrl - URL de base de l'application
 */
const sendPasswordInviteEmail = async (email, resetToken, baseUrl) => {
  try {
    const resetLink = `${baseUrl}/set-password?token=${resetToken}`;
    
    const mailOptions = {
      from: process.env.SMTP_FROM_NOREPLY || process.env.EMAIL_FROM || 'noreply@batasite.local',
      to: email,
      subject: 'Bienvenue - Créez votre mot de passe',
      html: `
        <h2>Bienvenue sur Batasite!</h2>
        <p>Un compte administrateur a été créé pour vous.</p>
        <p>Veuillez cliquer sur le lien ci-dessous pour créer votre mot de passe:</p>
        <p><a href="${resetLink}">${resetLink}</a></p>
        <p>Ce lien expire dans 24 heures.</p>
        <p>Si vous n'avez pas demandé la création de ce compte, veuillez ignorer cet email.</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Password invite email sent to ${email}: ${info.messageId}`);
    return true;
  } catch (error) {
    logger.error(`Error sending password invite email to ${email}: ${error.message}`);
    throw error;
  }
};

/**
 * Vérifier la connexion email
 */
const verifyConnection = async () => {
  try {
    await transporter.verify();
    logger.info('Email service connected successfully');
    return true;
  } catch (error) {
    logger.error(`Email service connection failed: ${error.message}`);
    return false;
  }
};

module.exports = {
  sendPasswordInviteEmail,
  verifyConnection,
};
