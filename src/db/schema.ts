import { pgTable, text, integer, timestamp, boolean, uuid, jsonb, decimal, uniqueIndex } from 'drizzle-orm/pg-core';

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

export const connectedAccounts = pgTable('connected_accounts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  provider: text('provider').notNull(),
  providerAccountId: text('provider_account_id').notNull(),
  accountEmail: text('account_email'),
  displayName: text('display_name'),
  scopes: jsonb('scopes').notNull().default([]),
  encryptedAccessToken: text('encrypted_access_token').notNull(),
  encryptedRefreshToken: text('encrypted_refresh_token'),
  tokenExpiresAt: timestamp('token_expires_at'),
  status: text('status').notNull().default('connected'),
  lastHealthCheckAt: timestamp('last_health_check_at'),
  lastSignalSyncAt: timestamp('last_signal_sync_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  connectedAccountsIdentityIdx: uniqueIndex('connected_accounts_identity_idx').on(table.userId, table.provider, table.providerAccountId),
}));

export const connectedAccountSignals = pgTable('connected_account_signals', {
  id: uuid('id').primaryKey().defaultRandom(),
  connectedAccountId: uuid('connected_account_id').references(() => connectedAccounts.id),
  signalType: text('signal_type').notNull(),
  sourceType: text('source_type').notNull(),
  sourceRef: text('source_ref'),
  title: text('title').notNull(),
  summary: text('summary'),
  confidence: decimal('confidence', { precision: 3, scale: 2 }).default('0.50'),
  occurredAt: timestamp('occurred_at'),
  metadataJson: jsonb('metadata_json'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const twinProfiles = pgTable('twin_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  status: text('status').notNull().default('default'),
  summary: text('summary'),
  traitsJson: jsonb('traits_json').notNull().default({}),
  scenarioResponsesJson: jsonb('scenario_responses_json').notNull().default([]),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const twinFeedbackEvents = pgTable('twin_feedback_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  twinProfileId: uuid('twin_profile_id').references(() => twinProfiles.id),
  action: text('action').notNull(),
  targetType: text('target_type').notNull(),
  targetId: text('target_id').notNull(),
  instruction: text('instruction'),
  beforeText: text('before_text'),
  afterText: text('after_text'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const commandQueueActions = pgTable('command_queue_actions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  actionType: text('action_type').notNull(),
  section: text('section').notNull(),
  title: text('title').notNull(),
  context: text('context'),
  proposedOutput: text('proposed_output'),
  confidence: decimal('confidence', { precision: 3, scale: 2 }).default('0.50'),
  urgency: text('urgency').notNull().default('medium'),
  riskLevel: text('risk_level').notNull().default('low'),
  sourceSignal: text('source_signal'),
  suggestedNextStep: text('suggested_next_step'),
  status: text('status').notNull().default('ready'),
  metadataJson: jsonb('metadata_json').default({}),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const draftMessages = pgTable('draft_messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  commandQueueActionId: uuid('command_queue_action_id').references(() => commandQueueActions.id),
  userId: uuid('user_id').references(() => users.id),
  draftType: text('draft_type').notNull(),
  recipientRef: text('recipient_ref'),
  subject: text('subject'),
  body: text('body').notNull(),
  sourceSignal: text('source_signal'),
  status: text('status').notNull().default('prepared'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const scheduleSuggestions = pgTable('schedule_suggestions', {
  id: uuid('id').primaryKey().defaultRandom(),
  commandQueueActionId: uuid('command_queue_action_id').references(() => commandQueueActions.id),
  userId: uuid('user_id').references(() => users.id),
  title: text('title').notNull(),
  reason: text('reason'),
  proposedWindow: text('proposed_window'),
  confidence: decimal('confidence', { precision: 3, scale: 2 }).default('0.50'),
  riskLevel: text('risk_level').notNull().default('low'),
  status: text('status').notNull().default('proposed'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const approvalActions = pgTable('approval_actions', {
  id: uuid('id').primaryKey().defaultRandom(),
  commandQueueActionId: uuid('command_queue_action_id').references(() => commandQueueActions.id),
  userId: uuid('user_id').references(() => users.id),
  approvalEvent: text('approval_event').notNull(),
  instruction: text('instruction'),
  createdAt: timestamp('created_at').defaultNow(),
});
