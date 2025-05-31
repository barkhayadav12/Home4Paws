const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const Pet = require('../models/Pet');
const User = require('../models/User');  

const authMiddleware = require('../middleware/authMiddleware');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure:true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

router.post('/adopt/:petId', authMiddleware, async (req, res) => {
  try {
    const adopterId = req.user.id;   
    const petId = req.params.petId;

    const pet = await Pet.findById(petId).populate('owner');
    if (!pet) return res.status(404).json({ message: 'Pet not found' });
    const adopter = await User.findById(adopterId);
    if (!adopter) return res.status(404).json({ message: 'Adopter user not found' });

    if (!pet.owner || !pet.owner.email) {
      return res.status(400).json({ message: 'Pet owner email not found' });
    }
    const mailOptions = {
      from: process.env.EMAIL_USER,               
      to: pet.owner.email,                        
      subject: `Adoption Request for ${pet.name}`,
      text: `
Hello ${pet.owner.name},

You have received an adoption request for your pet named "${pet.name}".

Adopter's details:
Name: ${adopter.name}
Email: ${adopter.email}

Please reply to this email to get in touch with the adopter.

Thank you,
Pet Adoption Platform
      `,
      replyTo: adopter.email,   
    };
    await transporter.sendMail(mailOptions);

    res.json({ message: 'Adoption request sent successfully to the owner.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error sending email' });
  }
});

module.exports = router;
