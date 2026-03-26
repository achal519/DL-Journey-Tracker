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

// Serve your existing frontend HTML files
app.use(express.static(path.join(__dirname, '../../frontend')));

// Routes
const citizenRoutes = require('./routes/citizen');
const licenseRoutes = require('./routes/license');
const alertRoutes  = require('./routes/alerts');
const cppRoutes    = require('./routes/cpp');

app.use('/api/citizen', citizenRoutes);
app.use('/api/license', licenseRoutes);
app.use('/api/alerts',  alertRoutes);
app.use('/api/cpp',     cppRoutes);

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Open your app at http://localhost:${PORT}/index.html`);
});