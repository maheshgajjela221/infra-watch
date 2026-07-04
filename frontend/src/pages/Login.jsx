import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import api from '../services/api.js';

export default function Login() {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('Admin@12345');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.data.user));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50 p-4">
      <form onSubmit={submit} className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-indigo-600 text-white">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">InfraWatch controls</h1>
          <p className="mt-2 text-sm text-gray-500">Login to manage server inventory</p>
        </div>
        {error && <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm font-medium text-red-700">{error}</div>}
        <div className="space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-gray-700">Email</span>
            <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-gray-700">Password</span>
            <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
          <button className="btn-primary w-full" type="submit">Login</button>
        </div>
      </form>
    </div>
  );
}
