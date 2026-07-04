const styles = {
  active: 'bg-green-100 text-green-700',
  running: 'bg-green-100 text-green-700',
  success: 'bg-green-100 text-green-700',
  healthy: 'bg-green-100 text-green-700',
  open: 'bg-red-100 text-red-700',
  failed: 'bg-red-100 text-red-700',
  inactive: 'bg-gray-100 text-gray-700',
  unknown: 'bg-yellow-100 text-yellow-700',
  warning: 'bg-yellow-100 text-yellow-700',
  prod: 'bg-purple-100 text-purple-700',
  dev: 'bg-blue-100 text-blue-700',
};

export default function StatusBadge({ value }) {
  const text = value || 'unknown';
  const key = String(text).toLowerCase();
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${styles[key] || 'bg-gray-100 text-gray-700'}`}>{text}</span>;
}
