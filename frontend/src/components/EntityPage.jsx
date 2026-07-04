import { useEffect, useMemo, useState } from 'react';
import api from '../services/api.js';
import DataTable from './DataTable.jsx';

function valueOrDash(value) {
  if (value === null || value === undefined || value === '') return '-';
  return value;
}

function numberValue(value) {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
}

function ProgressBar({ label, value, suffix = '%' }) {
  const percent = Math.max(0, Math.min(100, numberValue(value)));

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-600">{label}</p>
        <p className="text-xl font-bold text-gray-900">
          {percent.toFixed(0)}
          {suffix}
        </p>
      </div>

      <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className={`h-full rounded-full ${
            percent >= 85
              ? 'bg-red-500'
              : percent >= 70
              ? 'bg-amber-500'
              : 'bg-indigo-600'
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>

      <p className="mt-3 text-xs text-gray-500">
        {percent >= 85
          ? 'High usage. Please check server storage.'
          : percent >= 70
          ? 'Warning level usage.'
          : 'Healthy usage.'}
      </p>
    </div>
  );
}

function InfoCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <p className="mt-3 break-words text-base font-bold text-gray-900">
        {valueOrDash(value)}
      </p>
    </div>
  );
}

function MetricCard({ label, value, helper }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-gradient-to-br from-white to-gray-50 p-5 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <p className="mt-3 text-2xl font-black text-gray-900">
        {valueOrDash(value)}
      </p>
      {helper && <p className="mt-1 text-xs text-gray-500">{helper}</p>}
    </div>
  );
}

function ServerDetails({ server }) {
  const diskPercent = numberValue(server.disk_used_percent);
  const status = server.status || 'unknown';
  const environment = server.environment || 'unknown';

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-violet-600 to-blue-600 p-6 text-white shadow-lg">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-indigo-100">
              Server Profile
            </p>
            <h2 className="mt-2 text-3xl font-black">
              {valueOrDash(server.name)} Server
            </h2>
            <p className="mt-2 text-sm text-indigo-100">
              {valueOrDash(server.provider)} • {valueOrDash(server.region)} •{' '}
              {valueOrDash(server.public_ip)}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <span className="rounded-full bg-white/20 px-4 py-2 text-sm font-bold backdrop-blur">
              ENV: {environment}
            </span>
            <span className="rounded-full bg-white/20 px-4 py-2 text-sm font-bold backdrop-blur">
              STATUS: {status}
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-4">
        <MetricCard
          label="Public IP"
          value={server.public_ip}
          helper="Main reachable server IP"
        />
        <MetricCard
          label="Private IP"
          value={server.private_ip}
          helper="Internal network IP"
        />
        <MetricCard
          label="RAM"
          value={server.ram_total_gb ? `${server.ram_total_gb} GB` : '-'}
          helper="Total memory"
        />
        <MetricCard
          label="Disk Total"
          value={server.disk_total_gb ? `${server.disk_total_gb} GB` : '-'}
          helper="Total storage"
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ProgressBar label="Disk Usage" value={diskPercent} />
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
            Storage Summary
          </p>

          <div className="mt-5 space-y-4">
            <div className="flex justify-between border-b border-gray-100 pb-3">
              <span className="text-sm text-gray-500">Used</span>
              <span className="font-bold text-gray-900">
                {server.disk_used_gb ? `${server.disk_used_gb} GB` : '-'}
              </span>
            </div>

            <div className="flex justify-between border-b border-gray-100 pb-3">
              <span className="text-sm text-gray-500">Free</span>
              <span className="font-bold text-gray-900">
                {server.disk_free_gb ? `${server.disk_free_gb} GB` : '-'}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Usage</span>
              <span className="font-bold text-gray-900">
                {server.disk_used_percent
                  ? `${server.disk_used_percent}%`
                  : '-'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <InfoCard label="CPU Info" value={server.cpu_info} />
        <InfoCard label="OS" value={server.os_name} />
        <InfoCard label="SSH User" value={server.ssh_user} />
        <InfoCard label="Project Path" value={server.project_path} />
        <InfoCard label="Provider" value={server.provider} />
        <InfoCard label="Region" value={server.region} />
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
          Notes
        </p>
        <p className="mt-3 whitespace-pre-wrap text-sm font-medium text-gray-800">
          {valueOrDash(server.notes)}
        </p>
      </div>
    </div>
  );
}

function GenericDetails({ title, fields, selected }) {
  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
          Details
        </p>
        <h2 className="mt-1 text-2xl font-black text-gray-900">
          {title} Record
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {fields.map((field) => (
          <InfoCard
            key={field.name}
            label={field.label}
            value={selected[field.name]}
          />
        ))}
      </div>
    </div>
  );
}

export default function EntityPage({ title, endpoint, columns, fields }) {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState({});
  const [selected, setSelected] = useState(null);
  const [serverOptions, setServerOptions] = useState([]);
  const [editing, setEditing] = useState(null);
  const [mode, setMode] = useState('list');
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

 useEffect(() => {
  const hasServerField = fields.some((field) => field.name === 'server_id');

  if (!hasServerField) return;

  async function loadServers() {
    try {
      const res = await api.get('/servers');
      setServerOptions(res.data.data || []);
    } catch (err) {
      console.error('Failed to load servers', err);
    }
  }

  loadServers();
}, [fields]);
  

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
    const finalValue = type === 'number' && value !== '' ? Number(value) : value;
    setForm({ ...form, [name]: finalValue });
  }

  function renderInput(field) {
    if (field.name === 'server_id') {
  return (
    <select
      className="input"
      value={form[field.name] || ''}
      onChange={(e) => updateField(field.name, e.target.value, 'number')}
    >
      <option value="">Select Server</option>
      {serverOptions.map((server) => (
        <option key={server.id} value={server.id}>
          {server.name} - {server.public_ip || server.private_ip || 'No IP'}
        </option>
      ))}
    </select>
  );
}



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
              {mode === 'edit'
                ? `Edit ${title} Record`
                : `Add New ${title} Record`}
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
                {field.name === 'server_id' ? 'Server' : field.label}
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

    if (title.toLowerCase() === 'servers') {
      return <ServerDetails server={selected} />;
    }

    return <GenericDetails title={title} fields={fields} selected={selected} />;
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
          <h1 className="text-2xl font-bold text-gray-900">
            {mode === 'detail' && selected?.name
              ? `${selected.name} Server`
              : title}
          </h1>
          <p className="text-sm text-gray-500">
            {mode === 'list'
              ? `Manage ${title.toLowerCase()} records.`
              : mode === 'detail'
              ? `Beautiful overview of selected ${title.toLowerCase()} record.`
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

      {mode === 'list' && ListScreen()}
      {(mode === 'create' || mode === 'edit') && FormScreen()}
      {mode === 'detail' && DetailScreen()}
    </div>
  );
}

