import EntityPage from '../components/EntityPage.jsx';
import StatusBadge from '../components/StatusBadge.jsx';

export default function Servers() {
  return (
    <EntityPage
      title="Servers"
      endpoint="/servers"
      columns={[
        { key: 'name', label: 'Name' },
        { key: 'public_ip', label: 'Public IP' },
        { key: 'provider', label: 'Provider' },
        { key: 'environment', label: 'Env', render: (v) => <StatusBadge value={v} /> },
        { key: 'disk_used_percent', label: 'Disk %' },
        { key: 'status', label: 'Status', render: (v) => <StatusBadge value={v} /> },
      ]}
      fields={[
        { name: 'name', label: 'Server Name' },
        { name: 'public_ip', label: 'Public IP' },
        { name: 'private_ip', label: 'Private IP' },
        { name: 'provider', label: 'Provider' },
        { name: 'region', label: 'Region' },
        { name: 'environment', label: 'Environment', type: 'select', options: ['prod', 'dev', 'staging', 'test'] },
        { name: 'os_name', label: 'OS' },
        { name: 'ssh_user', label: 'SSH User' },
        { name: 'project_path', label: 'Project Path' },
        { name: 'cpu_info', label: 'CPU Info' },
        { name: 'ram_total_gb', label: 'RAM GB', type: 'number' },
        { name: 'disk_total_gb', label: 'Disk Total GB', type: 'number' },
        { name: 'disk_used_gb', label: 'Disk Used GB', type: 'number' },
        { name: 'disk_free_gb', label: 'Disk Free GB', type: 'number' },
        { name: 'disk_used_percent', label: 'Disk Used %', type: 'number' },
        { name: 'status', label: 'Status', type: 'select', options: ['active', 'inactive', 'maintenance'] },
        { name: 'notes', label: 'Notes', type: 'textarea' },
      ]}
    />
  );
}
