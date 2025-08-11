// routes/employeeRoutes.js
const express = require('express');
const { createEmployee, getAllEmployees, getEmployee, deleteEmployee, updateEmployee } = require('../controllers/employeeController');
const { verifyToken, authorizeRoles } = require('../middleware/auth');
const router = express.Router();

// Admin-only
router.post('/', verifyToken, authorizeRoles('admin'), createEmployee);
router.get('/', verifyToken, authorizeRoles('admin'), getAllEmployees);
router.get('/:id', verifyToken, authorizeRoles('admin'), getEmployee);
router.put('/:id', verifyToken, authorizeRoles('admin'), updateEmployee);
router.delete('/:id', verifyToken, authorizeRoles('admin'), deleteEmployee);

module.exports = router;
