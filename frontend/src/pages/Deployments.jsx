import EntityPage from '../components/EntityPage.jsx';
import StatusBadge from '../components/StatusBadge.jsx';

export default function Deployments() {
  return (
    <EntityPage
      title="Deployments"
      endpoint="/deployments"
      columns={[
        { key: 'project_name', label: 'Project' },
        { key: 'branch', label: 'Branch' },
        { key: 'cicd_tool', label: 'CI/CD' },
        { key: 'last_commit_id', label: 'Commit' },
        { key: 'last_deploy_status', label: 'Status', render: (v) => <StatusBadge value={v} /> },
      ]}
      fields={[
        { name: 'server_id', label: 'Server ID', type: 'number' },
        { name: 'project_name', label: 'Project Name' },
        { name: 'repo_url', label: 'Repo URL' },
        { name: 'branch', label: 'Branch' },
        { name: 'deploy_path', label: 'Deploy Path' },
        { name: 'cicd_tool', label: 'CI/CD Tool', type: 'select', options: ['GitHub Actions', 'Jenkins', 'Manual'] },
        { name: 'last_commit_id', label: 'Last Commit ID' },
        { name: 'last_commit_message', label: 'Last Commit Message', type: 'textarea' },
        { name: 'last_author', label: 'Last Author' },
        { name: 'last_deploy_status', label: 'Deploy Status', type: 'select', options: ['success', 'failed', 'running', 'unknown'] },
        { name: 'last_deploy_time', label: 'Deploy Time', type: 'datetime-local' },
        { name: 'build_url', label: 'Build URL' },
      ]}
    />
  );
}
