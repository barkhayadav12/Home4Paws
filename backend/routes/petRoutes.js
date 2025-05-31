const express = require('express');
const router = express.Router();
const petController = require('../controllers/petController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

router.post('/add', authMiddleware,  upload.single('image'),petController.createPet);
router.get('/all', authMiddleware, petController.getPets);
router.delete('/:id', authMiddleware, petController.deletePet);

module.exports = router;
