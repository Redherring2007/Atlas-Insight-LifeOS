# ATLAS LifeOS

A cloud-first AI command system for life and business management.

## Features

- **Cloud-First Architecture**: Built with Next.js, TypeScript, Tailwind CSS, and Neon PostgreSQL
- **AI-Powered Learning**: Self-learning memory system that adapts to user behavior
- **Mobile-Responsive**: Designed for mobile access with PWA capabilities
- **Multi-Workspace**: Business and private workspaces with strict permission separation
- **Comprehensive Modules**: Tasks, projects, finance, contracts, emails, calendar, teams, automations
- **Secure Authentication**: Protected frontend with NextAuth.js

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Neon PostgreSQL, Drizzle ORM
- **Auth**: NextAuth.js
- **Deployment**: Vercel-ready

## Setup Instructions

### 1. Clone and Install

```bash
git clone https://github.com/Redherring2007/Atlas-Insight-LifeOS.git
cd Atlas-Insight-LifeOS
npm install
```

### 2. Database Setup

1. Create a Neon project at [neon.tech](https://neon.tech)
2. Get your database connection string
3. Run the schema:

```bash
psql "your-neon-connection-string" < neon/schema.sql
```

### 3. Environment Variables

Create `.env.local`:

```env
DATABASE_URL="postgresql://neondb_owner:xxx@ep-summer-mouse-xxx-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
NEXTAUTH_SECRET="your-random-secret-key"
NEXTAUTH_URL="http://localhost:3003"
```

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3003` and sign in with:
- Email: owner@example.com
- Password: password

## Database Schema

The system includes 22 tables for comprehensive life and business management:

- `users` - User accounts
- `workspaces` - Business and private workspaces
- `workspace_members` - Team members
- `projects` - Project management
- `tasks` - Task tracking
- `finance_accounts` - Financial accounts
- `invoices` - Invoice management
- `payments` - Payment tracking
- `contracts` - Contract management
- `emails` - Email triage
- `calendar_events` - Calendar and scheduling
- `team_handoffs` - Team task handoffs
- `automations` - Automation rules
- `agents` - AI agents
- `activity_log` - Activity tracking
- `memories` - AI memory system
- `decision_history` - Learning from user decisions
- `priority_rules` - Dynamic priority rules
- `delegation_rules` - Task delegation patterns
- `contact_profiles` - Contact management
- `daily_briefings` - AI-generated briefings

## Deployment to Vercel

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

## Build Phases

- **Phase 1**: ✅ Database schema + auth
- **Phase 2**: Dashboard + workspace separation
- **Phase 3**: Tasks, projects, calendar
- **Phase 4**: Finance, contracts, payments
- **Phase 5**: Email triage
- **Phase 6**: Team handoff
- **Phase 7**: AI Brain + memory
- **Phase 8**: Automations
- **Phase 9**: Mobile PWA
- **Phase 10**: Real integrations

## Privacy & Security

- Private life data visible only to owner
- Team users cannot access private tasks, personal finance, or private calendar
- Row-level security policies implemented
- Secure authentication with NextAuth.js

## AI Learning System

The system learns from:
- User decisions and approvals
- Email urgency markings
- Task delegation patterns
- Meeting acceptances
- Contract priorities
- Communication styles
- Daily habits and preferences

This creates personalized AI assistance that adapts to individual workflows.