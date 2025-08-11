// routes/leaveRoutes.js
const express = require('express');
const { applyLeave, updateLeaveStatus, getLeavesForAdmin, getLeavesForEmployee } = require('../controllers/leaveController');
const { verifyToken, authorizeRoles } = require('../middleware/auth');
const router = express.Router();

// Employees apply for leave (employees are restricted to their own employeeId)
router.post('/', verifyToken, authorizeRoles(['employee','admin']), applyLeave);

// Admin approves/rejects
router.put('/:id', verifyToken, authorizeRoles('admin'), updateLeaveStatus);

// Admin views all leaves
router.get('/', verifyToken, authorizeRoles('admin'), getLeavesForAdmin);

// Employee views own leaves
router.get('/me', verifyToken, authorizeRoles('employee'), getLeavesForEmployee);

module.exports = router;
