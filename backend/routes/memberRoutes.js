/* backend/routes/memberRoutes.js */
const express = require('express');
const router = express.Router();
const { getAllMembers, createMember, updateMember, deleteMember } = require('../controllers/memberController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

// Apply authentication to all member routes
router.use(authenticateToken);

router.get('/', authenticateToken, memberController.getAllMembers);
router.post('/', authorizeRoles('ADMIN', 'PRESIDENT', 'SECRETARY'), createMember);
router.put('/:id', authorizeRoles('ADMIN', 'PRESIDENT', 'SECRETARY'), updateMember);
router.delete('/:id', authorizeRoles('ADMIN', 'PRESIDENT'), deleteMember);

module.exports = router;