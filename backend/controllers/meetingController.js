/* SFCC Altar Servers Attendance System — backend/controllers/meetingController.js */
const Meeting = require('../models/Meeting');

const getMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.getAll();
    res.json({ success: true, data: meetings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createMeeting = async (req, res) => {
  try {
    const { title, date, time, venue, description } = req.body;
    if (!title || !date || !time) {
      return res.status(400).json({ success: false, message: 'Title, Date, and Time are required.' });
    }
    const meeting = await Meeting.create({
      title, date, time, venue, description, created_by: req.user.id
    });
    res.status(201).json({ success: true, data: meeting });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMeetingById = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) return res.status(404).json({ success: false, message: 'Meeting not found.' });
    res.json({ success: true, data: meeting });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getMeetings, createMeeting, getMeetingById };