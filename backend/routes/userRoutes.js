const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const userController = require('../controllers/authController');

router.get('/profile', authMiddleware, userController.getUserProfile);

module.exports = router;
