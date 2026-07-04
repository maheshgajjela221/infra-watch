CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS servers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    public_ip VARCHAR(50) NOT NULL,
    private_ip VARCHAR(50),
    provider VARCHAR(100),
    region VARCHAR(100),
    environment VARCHAR(50) CHECK (environment IN ('prod', 'dev', 'staging', 'test')) DEFAULT 'dev',
    os_name VARCHAR(100),
    ssh_user VARCHAR(100),
    project_path TEXT,
    cpu_info VARCHAR(150),
    ram_total_gb NUMERIC(10,2),
    disk_total_gb NUMERIC(10,2),
    disk_used_gb NUMERIC(10,2),
    disk_free_gb NUMERIC(10,2),
    disk_used_percent NUMERIC(5,2),
    status VARCHAR(50) DEFAULT 'active',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS domains (
    id SERIAL PRIMARY KEY,
    domain_name VARCHAR(255) NOT NULL UNIQUE,
    server_id INTEGER REFERENCES servers(id) ON DELETE SET NULL,
    app_name VARCHAR(150),
    environment VARCHAR(50) DEFAULT 'dev',
    dns_provider VARCHAR(100),
    nginx_config_path TEXT,
    ssl_enabled BOOLEAN DEFAULT true,
    ssl_expiry_date DATE,
    status VARCHAR(50) DEFAULT 'active',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cron_jobs (
    id SERIAL PRIMARY KEY,
    server_id INTEGER REFERENCES servers(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    schedule VARCHAR(100),
    command TEXT,
    log_path TEXT,
    last_run_at TIMESTAMP,
    last_status VARCHAR(50) DEFAULT 'unknown',
    last_error TEXT,
    alert_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS services (
    id SERIAL PRIMARY KEY,
    server_id INTEGER REFERENCES servers(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    service_type VARCHAR(50),
    container_name VARCHAR(150),
    port VARCHAR(50),
    status VARCHAR(50) DEFAULT 'unknown',
    restart_policy VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS deployments (
    id SERIAL PRIMARY KEY,
    server_id INTEGER REFERENCES servers(id) ON DELETE SET NULL,
    project_name VARCHAR(150) NOT NULL,
    repo_url TEXT,
    branch VARCHAR(100),
    deploy_path TEXT,
    cicd_tool VARCHAR(100),
    last_commit_id VARCHAR(100),
    last_commit_message TEXT,
    last_author VARCHAR(150),
    last_deploy_status VARCHAR(50),
    last_deploy_time TIMESTAMP,
    build_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS alerts (
    id SERIAL PRIMARY KEY,
    server_id INTEGER REFERENCES servers(id) ON DELETE SET NULL,
    alert_type VARCHAR(100),
    title VARCHAR(255),
    message TEXT,
    severity VARCHAR(50) DEFAULT 'warning',
    status VARCHAR(50) DEFAULT 'open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_servers_environment ON servers(environment);
CREATE INDEX IF NOT EXISTS idx_servers_status ON servers(status);
CREATE INDEX IF NOT EXISTS idx_domains_server_id ON domains(server_id);
CREATE INDEX IF NOT EXISTS idx_cron_jobs_server_id ON cron_jobs(server_id);
CREATE INDEX IF NOT EXISTS idx_services_server_id ON services(server_id);
CREATE INDEX IF NOT EXISTS idx_deployments_server_id ON deployments(server_id);
CREATE INDEX IF NOT EXISTS idx_alerts_status ON alerts(status);
