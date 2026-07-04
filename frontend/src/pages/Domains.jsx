import EntityPage from '../components/EntityPage.jsx';
import StatusBadge from '../components/StatusBadge.jsx';

export default function Domains() {
  return (
    <EntityPage
      title="Domains"
      endpoint="/domains"
      columns={[
        { key: 'domain_name', label: 'Domain' },
        { key: 'app_name', label: 'App' },
        { key: 'environment', label: 'Env', render: (v) => <StatusBadge value={v} /> },
        { key: 'ssl_expiry_date', label: 'SSL Expiry' },
        { key: 'status', label: 'Status', render: (v) => <StatusBadge value={v} /> },
      ]}
      fields={[
        { name: 'domain_name', label: 'Domain Name' },
        { name: 'server_id', label: 'Server ID', type: 'number' },
        { name: 'app_name', label: 'App Name' },
        { name: 'environment', label: 'Environment', type: 'select', options: ['prod', 'dev', 'staging', 'test'] },
        { name: 'dns_provider', label: 'DNS Provider' },
        { name: 'nginx_config_path', label: 'Nginx Config Path' },
        { name: 'ssl_expiry_date', label: 'SSL Expiry Date', type: 'date' },
        { name: 'status', label: 'Status', type: 'select', options: ['active', 'inactive'] },
        { name: 'notes', label: 'Notes', type: 'textarea' },
      ]}
    />
  );
}
