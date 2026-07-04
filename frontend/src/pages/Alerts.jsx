import EntityPage from '../components/EntityPage.jsx';
import StatusBadge from '../components/StatusBadge.jsx';

export default function Alerts() {
  return (
    <EntityPage
      title="Alerts"
      endpoint="/alerts"
      columns={[
        { key: 'title', label: 'Title' },
        { key: 'alert_type', label: 'Type' },
        { key: 'severity', label: 'Severity', render: (v) => <StatusBadge value={v} /> },
        { key: 'status', label: 'Status', render: (v) => <StatusBadge value={v} /> },
        { key: 'created_at', label: 'Created' },
      ]}
      fields={[
        { name: 'server_id', label: 'Server ID', type: 'number' },
        { name: 'alert_type', label: 'Alert Type', type: 'select', options: ['disk', 'cron', 'domain', 'server', 'docker', 'deployment'] },
        { name: 'title', label: 'Title' },
        { name: 'message', label: 'Message', type: 'textarea' },
        { name: 'severity', label: 'Severity', type: 'select', options: ['info', 'warning', 'critical'] },
        { name: 'status', label: 'Status', type: 'select', options: ['open', 'resolved'] },
        { name: 'resolved_at', label: 'Resolved At', type: 'datetime-local' },
      ]}
    />
  );
}
