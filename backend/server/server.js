const express = require('express');
const cors = require('cors');
const session = require('express-session');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'dl_journey_secret_key',
  resave: false,
  saveUninitialized: false
}));

// ── IMPORTANT: landing.html as default page ──────────
// This MUST be before express.static so localhost:3000 opens landing page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/landing.html'));
});

// Serve all frontend files statically
app.use(express.static(path.join(__dirname, '../../frontend')));

// ── API Routes ────────────────────────────────────────
const citizenRoutes = require('./routes/citizen');
const licenseRoutes = require('./routes/license');
const alertRoutes   = require('./routes/alerts');
const cppRoutes     = require('./routes/cpp');

app.use('/api/citizen', citizenRoutes);
app.use('/api/license', licenseRoutes);
app.use('/api/alerts',  alertRoutes);
app.use('/api/cpp',     cppRoutes);

// ── Start Server ──────────────────────────────────────
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`\n✅ Server running at http://localhost:${PORT}`);
  console.log(`🚀 Open your app at http://localhost:${PORT}`);
  console.log(`📄 Landing page: http://localhost:${PORT}/landing.html\n`);
});

// DB connection log (triggered from db.js on connect)
const db = require('./db/db');