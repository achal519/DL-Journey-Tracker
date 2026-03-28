const express = require('express');
const router = express.Router();
const db = require('../db/db');
const bcrypt = require('bcrypt');

// =============================
// 🟢 REGISTER
// =============================
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

// =============================
// 🟢 LOGIN
// =============================
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

// =============================
// 🟢 GET STAGE INFO
// =============================
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

// =============================
// 🟢 GET CHECKLIST
// =============================
router.get('/checklist/:id', (req, res) => {
  const sql = `SELECT document_name, is_submitted
               FROM document_checklist
               WHERE citizen_id = ?`;
  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      console.error("Checklist GET error:", err);
      return res.status(500).json([]);
    }
    res.json(result);
  });
});

// =============================
// 🟢 UPDATE CHECKLIST
// =============================
router.post('/checklist/update', (req, res) => {
  console.log("Checklist Update API called:", req.body);
  const { citizen_id, document_name, is_submitted } = req.body;
  const sql = `INSERT INTO document_checklist (citizen_id, document_name, is_submitted)
               VALUES (?, ?, ?)
               ON DUPLICATE KEY UPDATE is_submitted = ?`;
  db.query(sql, [citizen_id, document_name, is_submitted, is_submitted], (err) => {
    if (err) {
      console.error("Checklist UPDATE error:", err);
      return res.status(500).json({ success: false });
    }
    res.json({ success: true });
  });
});

// =============================
// EXPORT
// =============================
module.exports = router;