import EntityPage from '../components/EntityPage.jsx';
import StatusBadge from '../components/StatusBadge.jsx';

export default function CronJobs() {
  return (
    <EntityPage
      title="Cron Jobs"
      endpoint="/cron-jobs"
      columns={[
        { key: 'name', label: 'Name' },
        { key: 'schedule', label: 'Schedule' },
        { key: 'log_path', label: 'Log Path' },
        { key: 'last_status', label: 'Last Status', render: (v) => <StatusBadge value={v} /> },
        { key: 'last_run_at', label: 'Last Run' },
      ]}
      fields={[
        { name: 'server_id', label: 'Server ID', type: 'number' },
        { name: 'name', label: 'Cron Name' },
        { name: 'schedule', label: 'Schedule' },
        { name: 'command', label: 'Command', type: 'textarea' },
        { name: 'log_path', label: 'Log Path' },
        { name: 'last_run_at', label: 'Last Run At', type: 'datetime-local' },
        { name: 'last_status', label: 'Last Status', type: 'select', options: ['success', 'failed', 'unknown'] },
        { name: 'last_error', label: 'Last Error', type: 'textarea' },
      ]}
    />
  );
}
