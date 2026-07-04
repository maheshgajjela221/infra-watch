import EntityPage from '../components/EntityPage.jsx';
import StatusBadge from '../components/StatusBadge.jsx';

export default function Services() {
  return (
    <EntityPage
      title="Services"
      endpoint="/services"
      columns={[
        { key: 'name', label: 'Name' },
        { key: 'service_type', label: 'Type' },
        { key: 'container_name', label: 'Container' },
        { key: 'port', label: 'Port' },
        { key: 'status', label: 'Status', render: (v) => <StatusBadge value={v} /> },
      ]}
      fields={[
        { name: 'server_id', label: 'Server ID', type: 'number' },
        { name: 'name', label: 'Service Name' },
        { name: 'service_type', label: 'Service Type', type: 'select', options: ['docker', 'systemd', 'nginx', 'postgres', 'redis', 'node'] },
        { name: 'container_name', label: 'Container Name' },
        { name: 'port', label: 'Port' },
        { name: 'status', label: 'Status', type: 'select', options: ['running', 'stopped', 'unknown'] },
        { name: 'restart_policy', label: 'Restart Policy' },
      ]}
    />
  );
}
