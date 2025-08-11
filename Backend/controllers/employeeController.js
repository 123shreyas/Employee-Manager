// controllers/employeeController.js
const db = require('../services/firestore');
const bcrypt = require('bcryptjs');
const { generateEmployeeId } = require('../utils/generateEmployeeId');

exports.createEmployee = async (req, res) => {
  try {
    const { name, email, password, department, joining_date } = req.body;
    if (!name || !email || !password || !department || !joining_date) {
      return res.status(400).json({ message: 'name, email, password, department, joining_date required' });
    }

    const lowerEmail = email.toLowerCase();

    // Prevent duplicate email
    const existing = await db.collection('users').where('email', '==', lowerEmail).get();
    if (!existing.empty) return res.status(400).json({ message: 'User with this email already exists' });

    // Generate employeeId (atomic)
    const employeeId = await generateEmployeeId('EMP', 3);

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = {
      name,
      email: lowerEmail,
      passwordHash,
      role: 'employee',
      employeeId,
      department,
      joining_date,
      leave_balance: 20, // default leave balance
      createdAt: new Date().toISOString()
    };

    const docRef = await db.collection('users').add(newUser);

    // Return credentials so admin can deliver them to user
    res.status(201).json({
      id: docRef.id,
      email: lowerEmail,
      employeeId,
      password // Only for initial bootstrap; never return password in production
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllEmployees = async (req, res) => {
  try {
    const snapshot = await db.collection('users').where('role', '==', 'employee').get();
    const employees = snapshot.docs.map(d => ({ id: d.id, ...d.data(), passwordHash: undefined }));
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await db.collection('users').doc(id).get();
    if (!doc.exists) return res.status(404).json({ message: 'Employee not found' });
    const data = doc.data();
    delete data.passwordHash;
    res.json({ id: doc.id, ...data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, department, joining_date, leave_balance } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email.toLowerCase();
    if (department) updateData.department = department;
    if (joining_date) updateData.joining_date = joining_date;
    if (leave_balance !== undefined) updateData.leave_balance = leave_balance;

    await db.collection('users').doc(id).update(updateData);
    res.json({ message: 'Employee updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('users').doc(id).delete();
    res.json({ message: 'Employee removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
