// controllers/authController.js
const db = require('../services/firestore');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';

// Login (used by admins and employees)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const q = await db.collection('users').where('email', '==', email.toLowerCase()).get();
    if (q.empty) return res.status(400).json({ message: 'Invalid credentials' });

    const doc = q.docs[0];
    const user = { id: doc.id, ...doc.data() };

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });

    const payload = {
      uid: user.id,
      email: user.email,
      role: user.role,
      employeeId: user.employeeId || null
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.json({
      token,
      role: user.role,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        employeeId: user.employeeId || null,
        name: user.name || null
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
