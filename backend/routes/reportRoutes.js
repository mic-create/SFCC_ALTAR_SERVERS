/* SFCC Altar Servers Attendance System — backend/routes/reportRoutes.js */
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const { getOverview, getMemberProfileReport } = require('../controllers/reportController');

router.use(authenticateToken);

router.get('/overview', getOverview);
router.get('/member/:id', getMemberProfileReport);

module.exports = router;