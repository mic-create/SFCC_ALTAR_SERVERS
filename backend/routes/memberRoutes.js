/* SFCC Altar Servers Attendance System — backend/routes/memberRoutes.js */
const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');
const {
  getMembers,
  createMember,
  updateMember,
  toggleMemberStatus,
  previewCSVImport,
  confirmCSVImport,
  getCSVTemplate
} = require('../controllers/memberController');

router.use(authenticateToken);

router.get('/', getMembers);
router.post('/', authorizeRoles('ADMIN', 'PRESIDENT', 'SECRETARY'), createMember);
router.put('/:id', authorizeRoles('ADMIN', 'PRESIDENT', 'SECRETARY'), updateMember);
router.patch('/:id/status', authorizeRoles('ADMIN', 'PRESIDENT'), toggleMemberStatus);

router.get('/template', getCSVTemplate);
router.post('/import-preview', authorizeRoles('ADMIN', 'PRESIDENT', 'SECRETARY'), upload.single('file'), previewCSVImport);
router.post('/import-confirm', authorizeRoles('ADMIN', 'PRESIDENT', 'SECRETARY'), confirmCSVImport);

module.exports = router;