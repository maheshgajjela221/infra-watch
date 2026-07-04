import { useEffect, useState } from 'react';
import api from '../services/api.js';
import StatCard from '../components/StatCard.jsx';
import StatusBadge from '../components/StatusBadge.jsx';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/dashboard')
      .then((res) => setData(res.data.data))
      .catch((err) => setError(err.response?.data?.message || err.message));
  }, []);

  const cards = data?.cards || {};

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">Overview of servers, domains, cron jobs, services, deployments, and alerts.</p>
      </div>

      {error && <div className="rounded-xl bg-red-50 p-3 text-sm font-medium text-red-700">{error}</div>}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Servers" value={cards.totalServers} />
        <StatCard title="Production Servers" value={cards.prodServers} />
        <StatCard title="Dev Servers" value={cards.devServers} />
        <StatCard title="Domains" value={cards.totalDomains} />
        <StatCard title="Cron Jobs" value={cards.cronJobs} />
        <StatCard title="Failed Crons" value={cards.failedCrons} />
        <StatCard title="High Disk Usage" value={cards.highDiskServers} helper="Disk usage >= 80%" />
        <StatCard title="Active Alerts" value={cards.activeAlerts} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="card p-5">
          <h2 className="mb-4 text-lg font-bold text-gray-900">Storage Usage</h2>
          <div className="space-y-4">
            {(data?.storage || []).map((server) => (
              <div key={server.name}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="font-semibold text-gray-700">{server.name}</span>
                  <span className="text-gray-500">{server.disk_used_percent}%</span>
                </div>
                <div className="h-3 rounded-full bg-gray-100">
                  <div className="h-3 rounded-full bg-indigo-600" style={{ width: `${Math.min(Number(server.disk_used_percent || 0), 100)}%` }} />
                </div>
              </div>
            ))}
            {!data?.storage?.length && <p className="text-sm text-gray-500">No storage data yet.</p>}
          </div>
        </div>

        <div className="card p-5">
          <h2 className="mb-4 text-lg font-bold text-gray-900">Recent Alerts</h2>
          <div className="space-y-3">
            {(data?.recentAlerts || []).map((alert) => (
              <div key={alert.id} className="rounded-2xl border border-gray-100 p-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold text-gray-900">{alert.title}</h3>
                  <StatusBadge value={alert.severity} />
                </div>
                <p className="mt-1 text-sm text-gray-500">{alert.message}</p>
                <p className="mt-2 text-xs text-gray-400">{alert.server_name || 'No server linked'}</p>
              </div>
            ))}
            {!data?.recentAlerts?.length && <p className="text-sm text-gray-500">No alerts yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
