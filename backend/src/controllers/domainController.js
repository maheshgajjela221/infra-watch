const pool = require('../config/db');

const table = 'domains';
const allowedFields = ['domain_name', 'server_id', 'app_name', 'environment', 'dns_provider', 'nginx_config_path', 'ssl_enabled', 'ssl_expiry_date', 'status', 'notes'];

function pickAllowed(body) {
  const picked = {};
  for (const field of allowedFields) {
    if (Object.prototype.hasOwnProperty.call(body, field)) {
      picked[field] = body[field] === '' ? null : body[field];
    }
  }
  return picked;
}

async function list(req, res) {
  const result = await pool.query(`SELECT * FROM ${table} ORDER BY id DESC`);
  return res.json({ success: true, data: result.rows });
}

async function get(req, res) {
  const result = await pool.query(`SELECT * FROM ${table} WHERE id = $1`, [req.params.id]);
  if (!result.rows[0]) {
    return res.status(404).json({ success: false, message: 'Record not found' });
  }
  return res.json({ success: true, data: result.rows[0] });
}

async function create(req, res) {
  const data = pickAllowed(req.body);
  const keys = Object.keys(data);
  if (!keys.length) {
    return res.status(400).json({ success: false, message: 'No valid fields provided' });
  }

  const columns = keys.join(', ');
  const placeholders = keys.map((_, index) => `$${index + 1}`).join(', ');
  const values = keys.map((key) => data[key]);

  const result = await pool.query(
    `INSERT INTO ${table} (${columns}) VALUES (${placeholders}) RETURNING *`,
    values
  );

  return res.status(201).json({ success: true, data: result.rows[0] });
}

async function update(req, res) {
  const data = pickAllowed(req.body);
  const keys = Object.keys(data);
  if (!keys.length) {
    return res.status(400).json({ success: false, message: 'No valid fields provided' });
  }

  const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');
  const values = keys.map((key) => data[key]);
  values.push(req.params.id);

  const result = await pool.query(
    `UPDATE ${table} SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $${values.length} RETURNING *`,
    values
  );

  if (!result.rows[0]) {
    return res.status(404).json({ success: false, message: 'Record not found' });
  }

  return res.json({ success: true, data: result.rows[0] });
}

async function remove(req, res) {
  const result = await pool.query(`DELETE FROM ${table} WHERE id = $1 RETURNING id`, [req.params.id]);
  if (!result.rows[0]) {
    return res.status(404).json({ success: false, message: 'Record not found' });
  }
  return res.json({ success: true, message: 'Record deleted' });
}

module.exports = { list, get, create, update, remove };
