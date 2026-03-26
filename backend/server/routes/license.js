const express = require('express');
const router = express.Router();
const db = require('../db/db');

// Update stage
router.post('/update-stage', (req, res) => {
  const { citizen_id, stage, date } = req.body;
  const fieldMap = {
    'll_issued':  'll_issue_date',
    'dl_applied': 'dl_applied_date',
    'dl_issued':  'dl_issued_date'
  };
  const field = fieldMap[stage];
  if (!field) return res.status(400).json({ error: 'Invalid stage' });

  const sql = `UPDATE license_stages SET ${field} = ?, current_stage = ? WHERE citizen_id = ?`;
  db.query(sql, [date, stage, citizen_id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// Get deadline info
router.get('/deadline/:id', (req, res) => {
  db.query(
    `SELECT ll_issue_date FROM license_stages WHERE citizen_id = ?`,
    [req.params.id],
    (err, rows) => {
      if (err || rows.length === 0)
        return res.status(404).json({ error: 'Not found' });

      const llDate = new Date(rows[0].ll_issue_date);
      const deadline = new Date(llDate);
      deadline.setDate(deadline.getDate() + 30);
      const today = new Date();
      const daysLeft = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));

      res.json({ ll_issue_date: llDate, deadline, days_left: daysLeft });
    }
  );
});

module.exports = router;