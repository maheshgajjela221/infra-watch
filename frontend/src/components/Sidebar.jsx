import { NavLink } from 'react-router-dom';
import { Activity, Bell, Clock, Globe, LayoutDashboard, Rocket, Server, ShieldCheck } from 'lucide-react';

const items = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/servers', label: 'Servers', icon: Server },
  { to: '/domains', label: 'Domains', icon: Globe },
  { to: '/cron-jobs', label: 'Cron Jobs', icon: Clock },
  { to: '/services', label: 'Services', icon: Activity },
  { to: '/deployments', label: 'Deployments', icon: Rocket },
  { to: '/alerts', label: 'Alerts', icon: Bell },
];

export default function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-72 border-r border-gray-200 bg-white p-5 lg:block">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-white">
          <ShieldCheck size={24} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">InfraWatch controls</h1>
          <p className="text-xs text-gray-500">Server Inventory Dashboard</p>
        </div>
      </div>
      <nav className="space-y-2">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
