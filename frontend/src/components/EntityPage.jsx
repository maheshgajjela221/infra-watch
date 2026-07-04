import { useEffect, useMemo, useState } from 'react';
import api from '../services/api.js';
import DataTable from './DataTable.jsx';

export default function EntityPage({ title, endpoint, columns, fields }) {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState({});
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(null);
  const [mode, setMode] = useState('list'); // list | create | edit | detail
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  async function load() {
    setLoading(true);
    setError('');

    try {
      const res = await api.get(endpoint);
      setRows(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [endpoint]);

  const filteredRows = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return rows;

    return rows.filter((row) =>
      JSON.stringify(row).toLowerCase().includes(q)
    );
  }, [rows, search]);

  function startCreate() {
    setError('');
    setSuccess('');
    setEditing(null);
    setSelected(null);
    setForm({});
    setMode('create');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function startEdit(row) {
    setError('');
    setSuccess('');
    setEditing(row);
    setSelected(null);
    setForm(row);
    setMode('edit');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function startView(row) {
    setError('');
    setSuccess('');
    setSelected(row);
    setEditing(null);
    setForm({});
    setMode('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function backToList() {
    setError('');
    setEditing(null);
    setSelected(null);
    setForm({});
    setMode('list');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function save(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editing) {
        await api.put(`${endpoint}/${editing.id}`, form);
        setSuccess(`${title} record updated successfully.`);
      } else {
        await api.post(endpoint, form);
        setSuccess(`${title} record created successfully.`);
      }

      setEditing(null);
      setSelected(null);
      setForm({});
      setMode('list');
      await load();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  }

  async function remove(row) {
    if (!confirm(`Delete this ${title.toLowerCase()} record?`)) return;

    try {
      await api.delete(`${endpoint}/${row.id}`);
      setSuccess(`${title} record deleted successfully.`);
      setMode('list');
      await load();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  }

  function updateField(name, value, type) {
    let finalValue = value;

    if (type === 'number') {
      finalValue = value === '' ? '' : Number(value);
    }

    setForm({ ...form, [name]: finalValue });
  }

  function renderInput(field) {
    if (field.type === 'textarea') {
      return (
        <textarea
          className="input min-h-24"
          value={form[field.name] || ''}
          onChange={(e) => updateField(field.name, e.target.value, field.type)}
        />
      );
    }

    if (field.type === 'select') {
      return (
        <select
          className="input"
          value={form[field.name] || ''}
          onChange={(e) => updateField(field.name, e.target.value, field.type)}
        >
          <option value="">Select</option>
          {field.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    }

    return (
      <input
        className="input"
        type={field.type || 'text'}
        value={form[field.name] || ''}
        onChange={(e) => updateField(field.name, e.target.value, field.type)}
      />
    );
  }

  function FormScreen() {
    return (
      <form onSubmit={save} className="card p-6">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {mode === 'edit' ? `Edit ${title} Record` : `Add New ${title} Record`}
            </h2>
            <p className="text-sm text-gray-500">
              Fill details and save. After saving, you will return to the list.
            </p>
          </div>

          <button type="button" onClick={backToList} className="btn-secondary">
            Back to List
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {fields.map((field) => (
            <label key={field.name} className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                {field.label}
              </span>
              {renderInput(field)}
            </label>
          ))}
        </div>

        <div className="mt-6 flex gap-3">
          <button className="btn-primary" type="submit">
            {mode === 'edit' ? 'Update Record' : 'Create Record'}
          </button>

          <button
            className="btn-secondary"
            type="button"
            onClick={() => setForm(editing || {})}
          >
            Reset
          </button>
        </div>
      </form>
    );
  }

  function DetailScreen() {
    if (!selected) return null;

    return (
      <div className="card p-6">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {title} Details
            </h2>
            <p className="text-sm text-gray-500">
              Full details of selected record.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => startEdit(selected)}
              className="btn-primary"
            >
              Edit
            </button>

            <button type="button" onClick={backToList} className="btn-secondary">
              Back to List
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {fields.map((field) => (
            <div
              key={field.name}
              className="rounded-xl border border-gray-100 bg-gray-50 p-4"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                {field.label}
              </p>
              <p className="mt-2 break-words text-sm font-semibold text-gray-900">
                {selected[field.name] || '-'}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function ListScreen() {
    return (
      <div className="space-y-6">
        <div className="card p-4">
          <input
            className="input"
            placeholder={`Search ${title.toLowerCase()}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="card p-6 text-gray-500">Loading...</div>
        ) : (
          <DataTable
            columns={columns}
            rows={filteredRows}
            onView={startView}
            onEdit={startEdit}
            onDelete={remove}
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-sm text-gray-500">
            {mode === 'list'
              ? `Manage ${title.toLowerCase()} records.`
              : mode === 'detail'
              ? `View selected ${title.toLowerCase()} record.`
              : `Create or update ${title.toLowerCase()} record.`}
          </p>
        </div>

        {mode === 'list' ? (
          <button onClick={startCreate} className="btn-primary">
            Add New
          </button>
        ) : (
          <button onClick={backToList} className="btn-secondary">
            Back
          </button>
        )}
      </div>

      {success && (
        <div className="rounded-xl bg-green-50 p-3 text-sm font-medium text-green-700">
          {success}
        </div>
      )}

      {error && mode === 'list' && (
        <div className="rounded-xl bg-red-50 p-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {mode === 'list' && <ListScreen />}
      {(mode === 'create' || mode === 'edit') && <FormScreen />}
      {mode === 'detail' && <DetailScreen />}
    </div>
  );
}
