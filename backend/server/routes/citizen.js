const express = require('express');
const router = express.Router();
const db = require('../db/db');
const bcrypt = require('bcrypt');

// Register a new citizen
router.post('/register', async (req, res) => {
  const { name, dob, vehicle_type, email, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const sql = `INSERT INTO citizens (name, dob, vehicle_type, email, password_hash)
                 VALUES (?, ?, ?, ?, ?)`;
    db.query(sql, [name, dob, vehicle_type, email, hash], (err, result) => {
      if (err) return res.status(400).json({ error: err.message });
      db.query(`INSERT INTO license_stages (citizen_id) VALUES (?)`, [result.insertId]);
      res.json({ success: true, citizen_id: result.insertId });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  db.query(`SELECT * FROM citizens WHERE email = ?`, [email], async (err, rows) => {
    if (err || rows.length === 0)
      return res.status(401).json({ error: 'Invalid email or password' });
    const match = await bcrypt.compare(password, rows[0].password_hash);
    if (!match)
      return res.status(401).json({ error: 'Invalid email or password' });
    req.session.citizen_id = rows[0].id;
    req.session.name = rows[0].name;
    res.json({ success: true, name: rows[0].name, citizen_id: rows[0].id });
  });
});

// Get citizen stage info
router.get('/stage/:id', (req, res) => {
  const sql = `SELECT c.name, c.vehicle_type, ls.*
               FROM citizens c
               JOIN license_stages ls ON c.id = ls.citizen_id
               WHERE c.id = ?`;
  db.query(sql, [req.params.id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows[0]);
  });
});

module.exports = router;