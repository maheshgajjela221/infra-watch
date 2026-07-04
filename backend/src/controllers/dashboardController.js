const pool = require('../config/db');

async function scalar(query, params = []) {
  const result = await pool.query(query, params);
  return Number(result.rows[0].count || 0);
}

async function summary(req, res) {
  const [
    totalServers,
    prodServers,
    devServers,
    totalDomains,
    cronJobs,
    failedCrons,
    activeAlerts,
    highDiskServers,
  ] = await Promise.all([
    scalar('SELECT COUNT(*) FROM servers'),
    scalar("SELECT COUNT(*) FROM servers WHERE environment = 'prod'"),
    scalar("SELECT COUNT(*) FROM servers WHERE environment = 'dev'"),
    scalar('SELECT COUNT(*) FROM domains'),
    scalar('SELECT COUNT(*) FROM cron_jobs'),
    scalar("SELECT COUNT(*) FROM cron_jobs WHERE last_status = 'failed'"),
    scalar("SELECT COUNT(*) FROM alerts WHERE status = 'open'"),
    scalar('SELECT COUNT(*) FROM servers WHERE COALESCE(disk_used_percent, 0) >= 80'),
  ]);

  const storage = await pool.query(`
    SELECT name, public_ip, COALESCE(disk_used_percent, 0) AS disk_used_percent
    FROM servers
    ORDER BY disk_used_percent DESC NULLS LAST
    LIMIT 8
  `);

  const recentAlerts = await pool.query(`
    SELECT a.*, s.name AS server_name
    FROM alerts a
    LEFT JOIN servers s ON s.id = a.server_id
    ORDER BY a.created_at DESC
    LIMIT 8
  `);

  return res.json({
    success: true,
    data: {
      cards: {
        totalServers,
        prodServers,
        devServers,
        totalDomains,
        cronJobs,
        failedCrons,
        activeAlerts,
        highDiskServers,
      },
      storage: storage.rows,
      recentAlerts: recentAlerts.rows,
    },
  });
}

module.exports = { summary };
