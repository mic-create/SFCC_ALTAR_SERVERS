/* SFCC Altar Servers Attendance System — backend/controllers/reportController.js */
const ReportService = require('../services/reportService');

const getOverview = async (req, res) => {
  try {
    const data = await ReportService.getOverviewStats();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMemberProfileReport = async (req, res) => {
  try {
    const data = await ReportService.getMemberProfileReport(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Member profile not found.' });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getOverview, getMemberProfileReport };