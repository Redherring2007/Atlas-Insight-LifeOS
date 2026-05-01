import { pgTable, text, integer, timestamp, boolean, uuid, jsonb, decimal } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  name: text('name'),
  role: text('role').default('user'), // owner, admin, member
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const workspaces = pgTable('workspaces', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  ownerId: uuid('owner_id').references(() => users.id),
  type: text('type').default('business'), // business, private
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const workspaceMembers = pgTable('workspace_members', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspaceId: uuid('workspace_id').references(() => workspaces.id),
  userId: uuid('user_id').references(() => users.id),
  role: text('role').default('member'),
  joinedAt: timestamp('joined_at').defaultNow(),
});

export const contactProfiles = pgTable('contact_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspaceId: uuid('workspace_id').references(() => workspaces.id),
  name: text('name').notNull(),
  email: text('email'),
  phone: text('phone'),
  company: text('company'),
  tags: jsonb('tags'),
  trustLevel: integer('trust_level').default(5),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const projects = pgTable('projects', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspaceId: uuid('workspace_id').references(() => workspaces.id),
  name: text('name').notNull(),
  description: text('description'),
  status: text('status').default('active'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const tasks = pgTable('tasks', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').references(() => projects.id),
  workspaceId: uuid('workspace_id').references(() => workspaces.id),
  title: text('title').notNull(),
  description: text('description'),
  status: text('status').default('todo'),
  priority: text('priority').default('medium'),
  assigneeId: uuid('assignee_id').references(() => users.id),
  dueDate: timestamp('due_date'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const financeAccounts = pgTable('finance_accounts', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspaceId: uuid('workspace_id').references(() => workspaces.id),
  name: text('name').notNull(),
  type: text('type').default('bank'), // bank, credit, cash
  balance: decimal('balance', { precision: 10, scale: 2 }).default('0'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const invoices = pgTable('invoices', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspaceId: uuid('workspace_id').references(() => workspaces.id),
  clientId: uuid('client_id').references(() => contactProfiles.id),
  amount: decimal('amount', { precision: 10, scale: 2 }),
  status: text('status').default('pending'),
  dueDate: timestamp('due_date'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const payments = pgTable('payments', {
  id: uuid('id').primaryKey().defaultRandom(),
  invoiceId: uuid('invoice_id').references(() => invoices.id),
  amount: decimal('amount', { precision: 10, scale: 2 }),
  date: timestamp('date').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const contracts = pgTable('contracts', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspaceId: uuid('workspace_id').references(() => workspaces.id),
  clientId: uuid('client_id').references(() => contactProfiles.id),
  title: text('title').notNull(),
  value: decimal('value', { precision: 10, scale: 2 }),
  status: text('status').default('active'),
  expiryDate: timestamp('expiry_date'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const emails = pgTable('emails', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspaceId: uuid('workspace_id').references(() => workspaces.id),
  from: text('from'),
  to: text('to'),
  subject: text('subject'),
  body: text('body'),
  urgency: text('urgency').default('normal'),
  linkedProjectId: uuid('linked_project_id').references(() => projects.id),
  createdAt: timestamp('created_at').defaultNow(),
});

export const calendarEvents = pgTable('calendar_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspaceId: uuid('workspace_id').references(() => workspaces.id),
  userId: uuid('user_id').references(() => users.id),
  title: text('title').notNull(),
  start: timestamp('start'),
  end: timestamp('end'),
  type: text('type').default('meeting'), // meeting, task, personal
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const teamHandoffs = pgTable('team_handoffs', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspaceId: uuid('workspace_id').references(() => workspaces.id),
  fromUserId: uuid('from_user_id').references(() => users.id),
  toUserId: uuid('to_user_id').references(() => users.id),
  taskId: uuid('task_id').references(() => tasks.id),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const automations = pgTable('automations', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspaceId: uuid('workspace_id').references(() => workspaces.id),
  name: text('name').notNull(),
  trigger: text('trigger'),
  action: text('action'),
  active: boolean('active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

export const agents = pgTable('agents', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspaceId: uuid('workspace_id').references(() => workspaces.id),
  name: text('name').notNull(),
  type: text('type').default('ai'),
  config: jsonb('config'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const activityLog = pgTable('activity_log', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspaceId: uuid('workspace_id').references(() => workspaces.id),
  userId: uuid('user_id').references(() => users.id),
  action: text('action'),
  details: jsonb('details'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const memories = pgTable('memories', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  workspaceId: uuid('workspace_id').references(() => workspaces.id),
  scope: text('scope').default('BUSINESS'), // PRIVATE, BUSINESS
  memoryType: text('memory_type'),
  content: text('content'),
  source: text('source'),
  confidence: decimal('confidence', { precision: 3, scale: 2 }).default('0.5'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  lastUsedAt: timestamp('last_used_at'),
});

export const decisionHistory = pgTable('decision_history', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  workspaceId: uuid('workspace_id').references(() => workspaces.id),
  decisionType: text('decision_type'),
  inputContext: text('input_context'),
  aiSuggestion: text('ai_suggestion'),
  userAction: text('user_action'),
  outcome: text('outcome'),
  learningSummary: text('learning_summary'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const priorityRules = pgTable('priority_rules', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  workspaceId: uuid('workspace_id').references(() => workspaces.id),
  rule: text('rule'),
  active: boolean('active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

export const delegationRules = pgTable('delegation_rules', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  workspaceId: uuid('workspace_id').references(() => workspaces.id),
  rule: text('rule'),
  active: boolean('active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

export const dailyBriefings = pgTable('daily_briefings', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  workspaceId: uuid('workspace_id').references(() => workspaces.id),
  date: timestamp('date').defaultNow(),
  content: text('content'),
  createdAt: timestamp('created_at').defaultNow(),
});