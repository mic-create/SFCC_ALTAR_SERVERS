/* SFCC Altar Servers Attendance System — backend/routes/meetingRoutes.js */
const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');
const { getMeetings, createMeeting, getMeetingById } = require('../controllers/meetingController');

router.use(authenticateToken);

router.get('/', getMeetings);
router.get('/:id', getMeetingById);
router.post('/', authorizeRoles('ADMIN', 'PRESIDENT', 'VICE_PRESIDENT', 'SECRETARY'), createMeeting);

module.exports = router;