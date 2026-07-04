require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');
const pool = require('./config/db');

const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const serverRoutes = require('./routes/servers');
const domainRoutes = require('./routes/domains');
const cronJobRoutes = require('./routes/cronJobs');
const serviceRoutes = require('./routes/services');
const deploymentRoutes = require('./routes/deployments');
const alertRoutes = require('./routes/alerts');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '2mb' }));

app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ success: true, message: 'InfraWatch API is healthy' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Database not healthy', error: error.message });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/servers', serverRoutes);
app.use('/api/domains', domainRoutes);
app.use('/api/cron-jobs', cronJobRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/deployments', deploymentRoutes);
app.use('/api/alerts', alertRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
});

async function seedAdmin() {
  const email = (process.env.ADMIN_EMAIL || 'admin@example.com').toLowerCase();
  const password = process.env.ADMIN_PASSWORD || 'Admin@12345';
  const name = process.env.ADMIN_NAME || 'Admin';

  const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
  if (existing.rows.length) return;

  const hash = await bcrypt.hash(password, 10);
  await pool.query(
    'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4)',
    [name, email, hash, 'admin']
  );
  console.log(`Default admin created: ${email}`);
}

async function start() {
  try {
    await pool.query('SELECT 1');
    await seedAdmin();
    app.listen(PORT, () => console.log(`InfraWatch backend running on port ${PORT}`));
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

start();
