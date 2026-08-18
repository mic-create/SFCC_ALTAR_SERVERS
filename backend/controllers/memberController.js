/* SFCC Altar Servers Attendance System — backend/controllers/memberController.js */
const Member = require('../models/Member');
const { parseAndValidateCSV } = require('../services/csvImportService');

const getMembers = async (req, res) => {
  try {
    const { search, status, page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;
    const data = await Member.getAll({ search, status, limit: parseInt(limit), offset: parseInt(offset) });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createMember = async (req, res) => {
  try {
    const { member_id, full_name, class_level, status } = req.body;
    if (!member_id || !full_name || !class_level) {
      return res.status(400).json({ success: false, message: 'Member ID, Full Name, and Class Level are required.' });
    }

    const existing = await Member.findByMemberId(member_id);
    if (existing) {
      return res.status(400).json({ success: false, message: 'Member ID already exists.' });
    }

    const member = await Member.create({ member_id, full_name, class_level, status });
    res.status(201).json({ success: true, data: member });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateMember = async (req, res) => {
  try {
    const { id } = req.params;
    const member = await Member.update(id, req.body);
    res.json({ success: true, data: member });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const toggleMemberStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!['ACTIVE', 'INACTIVE'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value.' });
    }
    const member = await Member.toggleStatus(id, status);
    res.json({ success: true, data: member });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const previewCSVImport = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No CSV file uploaded.' });
    }
    const results = await parseAndValidateCSV(req.file.path);
    res.json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const confirmCSVImport = async (req, res) => {
  try {
    const { records } = req.body;
    if (!Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ success: false, message: 'No valid records provided for import.' });
    }

    const imported = [];
    for (const record of records) {
      const created = await Member.create(record);
      imported.push(created);
    }

    res.json({ success: true, count: imported.length, message: `Successfully imported ${imported.length} members.` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getCSVTemplate = (req, res) => {
  const csvContent = 'member_id,full_name,class_level,status\nAS001,John Doe,SS3,ACTIVE\nAS002,Peter Smith,JSS2,ACTIVE';
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="altar_servers_template.csv"');
  res.status(200).send(csvContent);
};

module.exports = {
  getMembers,
  createMember,
  updateMember,
  toggleMemberStatus,
  previewCSVImport,
  confirmCSVImport,
  getCSVTemplate
};