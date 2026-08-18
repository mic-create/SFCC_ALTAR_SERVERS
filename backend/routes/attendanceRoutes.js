/* SFCC Altar Servers Attendance System — backend/routes/attendanceRoutes.js */
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const { getMeetingAttendance, submitAttendance } = require('../controllers/attendanceController');

router.use(authenticateToken);

router.get('/meeting/:meetingId', getMeetingAttendance);
router.post('/meeting/:meetingId', submitAttendance);

module.exports = router;