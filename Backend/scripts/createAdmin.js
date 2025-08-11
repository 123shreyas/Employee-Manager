// scripts/createAdmin.js
require('dotenv').config();
const db = require('../services/firestore');
const bcrypt = require('bcryptjs');

(async () => {
  try {
    const email = 'admin@company.com';
    const password = 'Admin@123'; // change after creating
    const lower = email.toLowerCase();

    const q = await db.collection('users').where('email', '==', lower).get();
    if (!q.empty) {
      console.log('Admin already exists');
      process.exit(0);
    }

    const hash = await bcrypt.hash(password, 10);
    const adminUser = {
      name: 'Super Admin',
      email: lower,
      passwordHash: hash,
      role: 'admin',
      createdAt: new Date().toISOString()
    };
    const docRef = await db.collection('users').add(adminUser);
    console.log('Admin created. email:', email, 'password:', password, 'docId:', docRef.id);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
