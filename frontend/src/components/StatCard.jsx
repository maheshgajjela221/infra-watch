export default function StatCard({ title, value, helper }) {
  return (
    <div className="card p-5">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <h3 className="mt-3 text-3xl font-bold text-gray-900">{value ?? 0}</h3>
      {helper && <p className="mt-2 text-xs text-gray-500">{helper}</p>}
    </div>
  );
}
