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

router.use(authenticateToken);

router.get('/', getMembers);
router.post('/', authorizeRoles('ADMIN', 'PRESIDENT', 'SECRETARY'), createMember);
router.put('/:id', authorizeRoles('ADMIN', 'PRESIDENT', 'SECRETARY'), updateMember);
router.patch('/:id/status', authorizeRoles('ADMIN', 'PRESIDENT'), toggleMemberStatus);

router.get('/csv-template', getCSVTemplate);
router.post('/preview-csv', authorizeRoles('ADMIN', 'PRESIDENT', 'SECRETARY'), previewCSVImport);
router.post('/confirm-csv', authorizeRoles('ADMIN', 'PRESIDENT', 'SECRETARY'), confirmCSVImport);

module.exports = router;