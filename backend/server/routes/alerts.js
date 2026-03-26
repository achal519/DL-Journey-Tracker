const express = require('express');
const router = express.Router();
const db = require('../db/db');

// Get all alerts for a citizen
router.get('/:citizen_id', (req, res) => {
  db.query(
    `SELECT * FROM alerts WHERE citizen_id = ? ORDER BY alert_date DESC`,
    [req.params.citizen_id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

// Create an alert
router.post('/create', (req, res) => {
  const { citizen_id, alert_type, alert_date, message } = req.body;
  db.query(
    `INSERT INTO alerts (citizen_id, alert_type, alert_date, message) VALUES (?,?,?,?)`,
    [citizen_id, alert_type, alert_date, message],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

module.exports = router;