import { useEffect, useMemo, useState } from 'react';
import api from '../services/api.js';
import DataTable from './DataTable.jsx';

export default function EntityPage({ title, endpoint, columns, fields }) {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState({});
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  async function load() {
    setLoading(true);
    try {
      const res = await api.get(endpoint);
      setRows(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const filteredRows = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return rows;
    return rows.filter((row) => JSON.stringify(row).toLowerCase().includes(q));
  }, [rows, search]);

  function startCreate() {
    setEditing(null);
    setForm({});
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }

  function startEdit(row) {
    setEditing(row);
    setForm(row);
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }

  async function save(e) {
    e.preventDefault();
    setError('');
    try {
      if (editing) await api.put(`${endpoint}/${editing.id}`, form);
      else await api.post(endpoint, form);
      setEditing(null);
      setForm({});
      await load();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  }

  async function remove(row) {
    if (!confirm(`Delete record #${row.id}?`)) return;
    await api.delete(`${endpoint}/${row.id}`);
    await load();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-sm text-gray-500">Manage {title.toLowerCase()} records.</p>
        </div>
        <button onClick={startCreate} className="btn-primary">Add New</button>
      </div>

      <div className="card p-4">
        <input className="input" placeholder="Search records..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {error && <div className="rounded-xl bg-red-50 p-3 text-sm font-medium text-red-700">{error}</div>}
      {loading ? <div className="card p-6 text-gray-500">Loading...</div> : <DataTable columns={columns} rows={filteredRows} onEdit={startEdit} onDelete={remove} />}

      <form onSubmit={save} className="card p-5">
        <h2 className="mb-4 text-lg font-bold text-gray-900">{editing ? 'Edit Record' : 'Add Record'}</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {fields.map((field) => (
            <label key={field.name} className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">{field.label}</span>
              {field.type === 'textarea' ? (
                <textarea className="input min-h-24" value={form[field.name] || ''} onChange={(e) => setForm({ ...form, [field.name]: e.target.value })} />
              ) : field.type === 'select' ? (
                <select className="input" value={form[field.name] || ''} onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}>
                  <option value="">Select</option>
                  {field.options.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              ) : (
                <input className="input" type={field.type || 'text'} value={form[field.name] || ''} onChange={(e) => setForm({ ...form, [field.name]: e.target.value })} />
              )}
            </label>
          ))}
        </div>
        <div className="mt-5 flex gap-3">
          <button className="btn-primary" type="submit">{editing ? 'Update' : 'Create'}</button>
          <button className="btn-secondary" type="button" onClick={() => { setEditing(null); setForm({}); }}>Clear</button>
        </div>
      </form>
    </div>
  );
}
