/* SFCC Altar Servers Attendance System — backend/services/csvImportService.js */
const fs = require('fs');
const csv = require('csv-parser');
const Member = require('../models/Member');

const parseAndValidateCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const validRecords = [];
    const duplicateRecords = [];
    const invalidRecords = [];
    const seenIds = new Set();

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        const member_id = row.member_id ? row.member_id.trim() : '';
        const full_name = row.full_name ? row.full_name.trim() : '';
        const class_level = row.class_level ? row.class_level.trim() : '';
        let status = row.status ? row.status.trim().toUpperCase() : 'ACTIVE';

        if (!['ACTIVE', 'INACTIVE'].includes(status)) {
          status = 'ACTIVE';
        }

        if (!member_id || !full_name || !class_level) {
          invalidRecords.push({ row, reason: 'Missing required fields (member_id, full_name, class_level).' });
          return;
        }

        if (seenIds.has(member_id)) {
          duplicateRecords.push({ row, reason: 'Duplicate Member ID within uploaded file.' });
          return;
        }

        seenIds.add(member_id);
        validRecords.push({ member_id, full_name, class_level, status });
      })
      .on('end', async () => {
        // DB Duplication check
        const finalValid = [];
        for (const record of validRecords) {
          const existing = await Member.findByMemberId(record.member_id);
          if (existing) {
            duplicateRecords.push({ row: record, reason: 'Member ID already exists in system database.' });
          } else {
            finalValid.push(record);
          }
        }

        fs.unlinkSync(filePath); // Clean temporary upload
        resolve({
          validRecords: finalValid,
          duplicateRecords,
          invalidRecords
        });
      })
      .on('error', (err) => {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        reject(err);
      });
  });
};

module.exports = { parseAndValidateCSV };