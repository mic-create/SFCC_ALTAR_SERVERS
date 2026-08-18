/* SFCC Altar Servers Attendance System — backend/controllers/attendanceController.js */
const Attendance = require('../models/Attendance');
const Member = require('../models/Member');

const getMeetingAttendance = async (req, res) => {
  try {
    const { meetingId } = req.params;
    const existingAttendance = await Attendance.getByMeetingId(meetingId);
    
    // Always fetch active members to construct full list
    const membersResult = await Member.getAll({ status: 'ACTIVE', limit: 1000, offset: 0 });
    const activeMembers = membersResult.members;

    const attendanceMap = new Map();
    existingAttendance.forEach(att => attendanceMap.set(att.member_id, att.status));

    const combinedList = activeMembers.map(member => ({
      member_id: member.id,
      code: member.member_id,
      full_name: member.full_name,
      class_level: member.class_level,
      status: attendanceMap.get(member.id) || 'ABSENT' // Default to ABSENT until saved
    }));

    res.json({ success: true, data: combinedList });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const submitAttendance = async (req, res) => {
  try {
    const { meetingId } = req.params;
    const { records } = req.body; // Array of { member_id, status }

    if (!Array.isArray(records)) {
      return res.status(400).json({ success: false, message: 'Records array is required.' });
    }

    await Attendance.saveBatch(meetingId, records, req.user.id);
    res.json({ success: true, message: 'Attendance recorded successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getMeetingAttendance, submitAttendance };