const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

router.post('/request', authMiddleware, async (req, res) => {
  const { message, address } = req.body;

  if (!message || !address) {
    return res.status(400).json({ message: 'Message and address are required.' });
  }

  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const mailOptions = {
      from: process.env.EMAIL_USER, 
      to: process.env.EMAIL_RECEIVER, 
      subject: `New Help Request from ${user.name}`,
      text: `
Hi Support Team,

A new help request has been submitted.

User Details:
- Name: ${user.name}
- Email: ${user.email}
- Phone: ${user.phone}
- Registered Address: ${user.address}

Submitted Information:
- Provided Address: ${address}
- Message: ${message}

Please reach out to them if necessary.

Thank you.
      `,
      replyTo: user.email,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: 'Help request sent successfully.' });
  } catch (error) {
    console.error('Error sending help request:', error);
    res.status(500).json({ message: 'Failed to send help request.' });
  }
});

module.exports = router;
