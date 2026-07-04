import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar.jsx';
import Navbar from '../components/Navbar.jsx';

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <main className="lg:pl-72">
        <Navbar />
        <div className="p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
