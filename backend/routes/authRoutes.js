/* backend/routes/authRoutes.js */
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Route line 8 check: Ensure both middleware and controller exist!
router.post('/login', authController.login);
router.get('/me', authenticateToken, authController.getMe); 

module.exports = router;