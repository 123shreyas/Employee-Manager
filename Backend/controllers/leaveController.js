// controllers/leaveController.js
const db = require('../services/firestore');
const dayjs = require('dayjs');

exports.applyLeave = async (req, res) => {
  try {
    // req.user is populated by auth middleware
    const { employeeId: jwtEmployeeId, role } = req.user;
    let { employeeId, start_date, end_date, reason } = req.body;

    // employees can only apply for their own account
    if (role === 'employee') {
      employeeId = jwtEmployeeId;
    }

    if (!employeeId || !start_date || !end_date) {
      return res.status(400).json({ message: 'employeeId, start_date, end_date required' });
    }

    const empQ = await db.collection('users').where('employeeId', '==', employeeId).get();
    if (empQ.empty) return res.status(404).json({ message: 'Employee not found' });
    const empDoc = empQ.docs[0];
    const emp = empDoc.data();

    const start = dayjs(start_date);
    const end = dayjs(end_date);
    if (!start.isValid() || !end.isValid() || end.isBefore(start)) {
      return res.status(400).json({ message: 'Invalid date range' });
    }

    // Check joining date
    if (start.isBefore(dayjs(emp.joining_date))) {
      return res.status(400).json({ message: 'Leave cannot be before joining date' });
    }

    const days = end.diff(start, 'day') + 1;
    if (days > emp.leave_balance) return res.status(400).json({ message: 'Not enough leave balance' });

    // overlapping check (approved or pending)
    const leavesSnap = await db.collection('leave_requests')
      .where('employeeId', '==', employeeId)
      .where('status', 'in', ['pending', 'approved'])
      .get();

    for (const d of leavesSnap.docs) {
      const L = d.data();
      const s = dayjs(L.start_date);
      const e = dayjs(L.end_date);
      // ranges overlap?
      if (!(end.isBefore(s) || start.isAfter(e))) {
        return res.status(400).json({ message: 'Overlapping leave exists' });
      }
    }

    const leave = {
      employeeId,
      start_date,
      end_date,
      reason: reason || '',
      days,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    const leaveRef = await db.collection('leave_requests').add(leave);
    res.status(201).json({ id: leaveRef.id, ...leave });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateLeaveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!['approved', 'rejected'].includes(status)) return res.status(400).json({ message: 'Invalid status' });

    const leaveRef = db.collection('leave_requests').doc(id);
    const leaveSnap = await leaveRef.get();
    if (!leaveSnap.exists) return res.status(404).json({ message: 'Leave request not found' });

    const leave = leaveSnap.data();
    if (leave.status !== 'pending') return res.status(400).json({ message: 'Leave already processed' });

    if (status === 'approved') {
      // Deduct leave balance atomically
      const usersQ = await db.collection('users').where('employeeId', '==', leave.employeeId).get();
      if (usersQ.empty) return res.status(404).json({ message: 'Employee not found' });
      const userRef = usersQ.docs[0].ref;
      await db.runTransaction(async (tx) => {
        const userSnap = await tx.get(userRef);
        const user = userSnap.data();
        const newBalance = (user.leave_balance || 0) - leave.days;
        if (newBalance < 0) throw new Error('Insufficient balance at approval time');
        tx.update(userRef, { leave_balance: newBalance });
        tx.update(leaveRef, { status, approvedAt: new Date().toISOString() });
      });
    } else {
      await leaveRef.update({ status, processedAt: new Date().toISOString() });
    }

    res.json({ message: `Leave ${status}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getLeavesForAdmin = async (req, res) => {
  try {
    const snapshot = await db.collection('leave_requests').orderBy('createdAt', 'desc').get();
    const leaves = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getLeavesForEmployee = async (req, res) => {
  try {
    const { employeeId } = req.user;
    const snapshot = await db.collection('leave_requests').where('employeeId', '==', employeeId).orderBy('createdAt', 'desc').get();
    const leaves = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
