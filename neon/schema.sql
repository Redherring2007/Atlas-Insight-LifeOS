-- ATLAS LifeOS Database Schema for Neon PostgreSQL

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Workspaces table
CREATE TABLE workspaces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  owner_id UUID REFERENCES users(id),
  type TEXT DEFAULT 'business',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Workspace members table
CREATE TABLE workspace_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id),
  user_id UUID REFERENCES users(id),
  role TEXT DEFAULT 'member',
  joined_at TIMESTAMP DEFAULT NOW()
);

-- Contact profiles table
CREATE TABLE contact_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  tags JSONB,
  trust_level INTEGER DEFAULT 5,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id),
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tasks table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id),
  workspace_id UUID REFERENCES workspaces(id),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'todo',
  priority TEXT DEFAULT 'medium',
  assignee_id UUID REFERENCES users(id),
  due_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Finance accounts table
CREATE TABLE finance_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id),
  name TEXT NOT NULL,
  type TEXT DEFAULT 'bank',
  balance DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Invoices table
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id),
  client_id UUID REFERENCES contact_profiles(id),
  amount DECIMAL(10,2),
  status TEXT DEFAULT 'pending',
  due_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Payments table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_id UUID REFERENCES invoices(id),
  amount DECIMAL(10,2),
  date TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Contracts table
CREATE TABLE contracts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id),
  client_id UUID REFERENCES contact_profiles(id),
  title TEXT NOT NULL,
  value DECIMAL(10,2),
  status TEXT DEFAULT 'active',
  expiry_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Emails table
CREATE TABLE emails (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id),
  "from" TEXT,
  "to" TEXT,
  subject TEXT,
  body TEXT,
  urgency TEXT DEFAULT 'normal',
  linked_project_id UUID REFERENCES projects(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Calendar events table
CREATE TABLE calendar_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id),
  user_id UUID REFERENCES users(id),
  title TEXT NOT NULL,
  start TIMESTAMP,
  "end" TIMESTAMP,
  type TEXT DEFAULT 'meeting',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Team handoffs table
CREATE TABLE team_handoffs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id),
  from_user_id UUID REFERENCES users(id),
  to_user_id UUID REFERENCES users(id),
  task_id UUID REFERENCES tasks(id),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Automations table
CREATE TABLE automations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id),
  name TEXT NOT NULL,
  trigger TEXT,
  action TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Agents table
CREATE TABLE agents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id),
  name TEXT NOT NULL,
  type TEXT DEFAULT 'ai',
  config JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Activity log table
CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id),
  user_id UUID REFERENCES users(id),
  action TEXT,
  details JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Memories table
CREATE TABLE memories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  workspace_id UUID REFERENCES workspaces(id),
  scope TEXT DEFAULT 'BUSINESS',
  memory_type TEXT,
  content TEXT,
  source TEXT,
  confidence DECIMAL(3,2) DEFAULT 0.5,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_used_at TIMESTAMP
);

-- Decision history table
CREATE TABLE decision_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  workspace_id UUID REFERENCES workspaces(id),
  decision_type TEXT,
  input_context TEXT,
  ai_suggestion TEXT,
  user_action TEXT,
  outcome TEXT,
  learning_summary TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Priority rules table
CREATE TABLE priority_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  workspace_id UUID REFERENCES workspaces(id),
  rule TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Delegation rules table
CREATE TABLE delegation_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  workspace_id UUID REFERENCES workspaces(id),
  rule TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Daily briefings table
CREATE TABLE daily_briefings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  workspace_id UUID REFERENCES workspaces(id),
  date TIMESTAMP DEFAULT NOW(),
  content TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Row Level Security Policies (RLS)
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_handoffs ENABLE ROW LEVEL SECURITY;
ALTER TABLE automations ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE decision_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE priority_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE delegation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_briefings ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (simplified - in production, use proper auth context)
-- For now, allow all operations (will be updated with proper auth)
CREATE POLICY "Allow all operations on users" ON users FOR ALL USING (true);
CREATE POLICY "Allow all operations on workspaces" ON workspaces FOR ALL USING (true);
CREATE POLICY "Allow all operations on workspace_members" ON workspace_members FOR ALL USING (true);
CREATE POLICY "Allow all operations on contact_profiles" ON contact_profiles FOR ALL USING (true);
CREATE POLICY "Allow all operations on projects" ON projects FOR ALL USING (true);
CREATE POLICY "Allow all operations on tasks" ON tasks FOR ALL USING (true);
CREATE POLICY "Allow all operations on finance_accounts" ON finance_accounts FOR ALL USING (true);
CREATE POLICY "Allow all operations on invoices" ON invoices FOR ALL USING (true);
CREATE POLICY "Allow all operations on payments" ON payments FOR ALL USING (true);
CREATE POLICY "Allow all operations on contracts" ON contracts FOR ALL USING (true);
CREATE POLICY "Allow all operations on emails" ON emails FOR ALL USING (true);
CREATE POLICY "Allow all operations on calendar_events" ON calendar_events FOR ALL USING (true);
CREATE POLICY "Allow all operations on team_handoffs" ON team_handoffs FOR ALL USING (true);
CREATE POLICY "Allow all operations on automations" ON automations FOR ALL USING (true);
CREATE POLICY "Allow all operations on agents" ON agents FOR ALL USING (true);
CREATE POLICY "Allow all operations on activity_log" ON activity_log FOR ALL USING (true);
CREATE POLICY "Allow all operations on memories" ON memories FOR ALL USING (true);
CREATE POLICY "Allow all operations on decision_history" ON decision_history FOR ALL USING (true);
CREATE POLICY "Allow all operations on priority_rules" ON priority_rules FOR ALL USING (true);
CREATE POLICY "Allow all operations on delegation_rules" ON delegation_rules FOR ALL USING (true);
CREATE POLICY "Allow all operations on daily_briefings" ON daily_briefings FOR ALL USING (true);

-- Seed data
INSERT INTO users (email, name, role) VALUES ('owner@example.com', 'Owner User', 'owner');
INSERT INTO workspaces (name, owner_id, type) VALUES ('Business Workspace', (SELECT id FROM users WHERE email = 'owner@example.com'), 'business');
INSERT INTO workspaces (name, owner_id, type) VALUES ('Private Workspace', (SELECT id FROM users WHERE email = 'owner@example.com'), 'private');