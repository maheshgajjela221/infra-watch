import { Navigate, Route, Routes } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Servers from './pages/Servers.jsx';
import Domains from './pages/Domains.jsx';
import CronJobs from './pages/CronJobs.jsx';
import Services from './pages/Services.jsx';
import Deployments from './pages/Deployments.jsx';
import Alerts from './pages/Alerts.jsx';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="servers" element={<Servers />} />
        <Route path="domains" element={<Domains />} />
        <Route path="cron-jobs" element={<CronJobs />} />
        <Route path="services" element={<Services />} />
        <Route path="deployments" element={<Deployments />} />
        <Route path="alerts" element={<Alerts />} />
      </Route>
    </Routes>
  );
}
