/* backend/routes/memberRoutes.js */
const express = require('express');
const router = express.Router();
const { 
  getMembers, 
  createMember, 
  updateMember, 
  toggleMemberStatus,
  previewCSVImport,
  confirmCSVImport,
  getCSVTemplate 
} = require('../controllers/memberController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

// Apply authentication to all member routes
router.use(authenticateToken);

// Member management routes
router.get('/', getMembers);
router.post('/', authorizeRoles('ADMIN', 'PRESIDENT', 'SECRETARY'), createMember);
router.put('/:id', authorizeRoles('ADMIN', 'PRESIDENT', 'SECRETARY'), updateMember);
router.patch('/:id/status', authorizeRoles('ADMIN', 'PRESIDENT'), toggleMemberStatus);

// CSV import routes
router.get('/csv-template', getCSVTemplate);
router.post('/preview-csv', authorizeRoles('ADMIN', 'PRESIDENT', 'SECRETARY'), previewCSVImport);
router.post('/confirm-csv', authorizeRoles('ADMIN', 'PRESIDENT', 'SECRETARY'), confirmCSVImport);

module.exports = router;