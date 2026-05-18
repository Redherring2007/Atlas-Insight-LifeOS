import { users, workspaces, workspaceMembers, contactProfiles, projects, tasks, financeAccounts, invoices, payments, contracts, emails, calendarEvents, teamHandoffs, automations, agents, activityLog, memories, decisionHistory, priorityRules, delegationRules, dailyBriefings } from '@/db/schema';

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Workspace = typeof workspaces.$inferSelect;
export type NewWorkspace = typeof workspaces.$inferInsert;

export type WorkspaceMember = typeof workspaceMembers.$inferSelect;
export type NewWorkspaceMember = typeof workspaceMembers.$inferInsert;

export type ContactProfile = typeof contactProfiles.$inferSelect;
export type NewContactProfile = typeof contactProfiles.$inferInsert;

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;

export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;

export type FinanceAccount = typeof financeAccounts.$inferSelect;
export type NewFinanceAccount = typeof financeAccounts.$inferInsert;

export type Invoice = typeof invoices.$inferSelect;
export type NewInvoice = typeof invoices.$inferInsert;

export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;

export type Contract = typeof contracts.$inferSelect;
export type NewContract = typeof contracts.$inferInsert;

export type Email = typeof emails.$inferSelect;
export type NewEmail = typeof emails.$inferInsert;

export type CalendarEvent = typeof calendarEvents.$inferSelect;
export type NewCalendarEvent = typeof calendarEvents.$inferInsert;

export type TeamHandoff = typeof teamHandoffs.$inferSelect;
export type NewTeamHandoff = typeof teamHandoffs.$inferInsert;

export type Automation = typeof automations.$inferSelect;
export type NewAutomation = typeof automations.$inferInsert;

export type Agent = typeof agents.$inferSelect;
export type NewAgent = typeof agents.$inferInsert;

export type ActivityLog = typeof activityLog.$inferSelect;
export type NewActivityLog = typeof activityLog.$inferInsert;

export type Memory = typeof memories.$inferSelect;
export type NewMemory = typeof memories.$inferInsert;

export type DecisionHistory = typeof decisionHistory.$inferSelect;
export type NewDecisionHistory = typeof decisionHistory.$inferInsert;

export type PriorityRule = typeof priorityRules.$inferSelect;
export type NewPriorityRule = typeof priorityRules.$inferInsert;

export type DelegationRule = typeof delegationRules.$inferSelect;
export type NewDelegationRule = typeof delegationRules.$inferInsert;

export type DailyBriefing = typeof dailyBriefings.$inferSelect;
export type NewDailyBriefing = typeof dailyBriefings.$inferInsert;

export type LeadStatus = 'cold' | 'warm' | 'hot';
export type InvoiceStatus = 'pending' | 'paid' | 'overdue';
export type HandoffStatus = 'pending' | 'accepted' | 'completed' | 'rejected';
export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type TaskPriority = 'high' | 'medium' | 'low';
export type EmailUrgency = 'high' | 'medium' | 'low';

export type ContactProfileUi = ContactProfile & {
  tags?: string[] | string | null;
  whereMet?: string | null;
  conversationPoints?: string | null;
};

export type EmailUi = Email & {
  receivedAt?: Date | null;
  updatedAt?: Date | null;
  read?: boolean;
  urgency?: EmailUrgency | null;
  linkedProject?: string | null;
  preview?: string | null;
  tags?: string[];
};

export type TeamHandoffUi = TeamHandoff & {
  status?: HandoffStatus;
  updatedAt?: Date | null;
  fromUser?: string;
  toUser?: string;
  taskTitle?: string;
  priority?: TaskPriority | string | null;
  dueDate?: Date | null;
};

export type WorkspaceMemberUi = WorkspaceMember & {
  user?: {
    name?: string | null;
    email?: string | null;
  };
  workload?: {
    total: number;
    pending: number;
    overdue: number;
  };
};

export type CalendarEventUi = CalendarEvent & {
  type?: string | null;
};
