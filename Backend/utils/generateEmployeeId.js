// utils/generateEmployeeId.js
const db = require('../services/firestore');

const COUNTER_DOC = db.doc('meta/counters');

async function generateEmployeeId(prefix = 'EMP', pad = 3) {
  // Transaction to increment counter atomically
  const result = await db.runTransaction(async (tx) => {
    const snap = await tx.get(COUNTER_DOC);
    let last = 0;
    if (!snap.exists) {
      // Initialize counter doc
      tx.set(COUNTER_DOC, { lastEmployeeNumber: 1 }, { merge: true });
      last = 1;
    } else {
      const data = snap.data();
      last = (data.lastEmployeeNumber || 0) + 1;
      tx.update(COUNTER_DOC, { lastEmployeeNumber: last });
    }
    return last;
  });

  const num = String(result).padStart(pad, '0');
  return `${prefix}${num}`; // e.g., EMP001
}

module.exports = { generateEmployeeId };
