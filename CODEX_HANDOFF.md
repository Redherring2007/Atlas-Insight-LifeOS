# ATLAS LifeOS - Codex Development Handoff

## Project Overview
ATLAS LifeOS is a cloud-first AI command system for life and business management. Built with Next.js, TypeScript, Tailwind CSS, and Neon PostgreSQL.

**Repository**: https://github.com/Redherring2007/Atlas-Insight-LifeOS
**Tech Stack**: Next.js 14, TypeScript, Tailwind CSS, Neon PostgreSQL, NextAuth.js, Drizzle ORM

---

## ✅ COMPLETED: Phase 1-3

### Phase 1: Supabase Schema + Auth (Using Neon)
**Status**: ✅ DONE
- Complete PostgreSQL schema with 22 tables
- Neon database integration with Drizzle ORM
- NextAuth.js authentication setup
- Environment variables configured
- Row-level security policies enabled

**Files Created**:
- `/src/db/schema.ts` - Drizzle ORM schema
- `/src/db/index.ts` - Database connection
- `/src/lib/auth.ts` - NextAuth configuration
- `/neon/schema.sql` - Full database schema
- `drizzle.config.ts` - Drizzle configuration

### Phase 2: Dashboard + Private/Business Separation
**Status**: ✅ DONE
- Dashboard with workspace selector
- Brain icon with animated processing visualization
- Command input interface
- Dashboard panels with workspace-specific content
- Private workspace (owner-only)
- AI Brain page with memory and learning metrics

**Components Created**:
- `/src/components/brain-icon.tsx` - Animated brain with neural processing strands
- `/src/components/command-input.tsx` - Command interface
- `/src/components/workspace-selector.tsx` - Workspace switcher
- `/src/components/dashboard-panels.tsx` - Dashboard content panels
- `/src/components/providers.tsx` - NextAuth session provider

**Pages Created**:
- `/src/app/dashboard/page.tsx` - Main dashboard
- `/src/app/private/page.tsx` - Private workspace
- `/src/app/brain/page.tsx` - AI brain interface
- `/src/app/auth/signin/page.tsx` - Sign-in page

### Phase 3: Tasks, Projects, Calendar
**Status**: 🟡 IN PROGRESS - Needs calendar view completion
- Full task management with filtering and status tracking
- Project management with progress tracking
- Calendar with events (structure ready, view component needed)
- Mobile navigation integration

**Components Created**:
- `/src/components/task-card.tsx` - Task card component
- `/src/components/project-card.tsx` - Project card component
- `/src/components/calendar-view.tsx` - **NEEDS TO BE CREATED**

**Pages Created**:
- `/src/app/tasks/page.tsx` - Task management
- `/src/app/projects/page.tsx` - Project management
- `/src/app/calendar/page.tsx` - Calendar interface (needs view component)

---

## 🟡 IN PROGRESS: Phase 3 - Calendar Component

**MISSING**: `src/components/calendar-view.tsx`

This component needs to display:
- Monthly/weekly/daily calendar view
- Event cards with time slots
- Drag-and-drop event scheduling
- Event creation modal
- AI suggestions sidebar (optional on mobile)

**Implementation Requirements**:
```typescript
// Interface needed for calendar-view.tsx
interface CalendarViewProps {
  currentDate: Date
  events: CalendarEvent[]
  onDateChange: (date: Date) => void
  onEventCreate: (event: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>) => void
}
```

---

## 📋 TODO: Phase 4-10

### Phase 4: Finance, Contracts, Payments
**Status**: ⏳ NOT STARTED
- Finance dashboard with accounts overview
- Invoice management and tracking
- Payment tracking with due date alerts
- Contract management with renewal dates
- Financial reporting and cash flow

**Pages Needed**:
- `/src/app/finance/page.tsx`
- `/src/app/contracts/page.tsx`
- `/src/app/invoices/page.tsx`
- `/src/app/payments/page.tsx`

### Phase 5: Email Triage
**Status**: ⏳ NOT STARTED
- Email parsing and urgency classification
- AI-powered email flagging (>£1000, urgent keywords, etc.)
- Email-to-task/project linking
- Urgent email queue

**Pages Needed**:
- `/src/app/emails/page.tsx`
- `/src/components/email-triage.tsx`

### Phase 6: Team Handoff
**Status**: ⏳ NOT STARTED
- Team member management
- Task delegation interface
- Workload distribution
- Team collaboration features

**Pages Needed**:
- `/src/app/teams/page.tsx`

### Phase 7: AI Brain + Memory
**Status**: ⏳ NOT STARTED
- Memory storage and retrieval
- Decision history tracking
- Learning from user actions
- Priority/delegation rule generation
- Daily briefing generation

**Components Needed**:
- Memory storage API
- Learning engine integration
- Briefing generator

### Phase 8: Automations
**Status**: ⏳ NOT STARTED
- Automation rule builder
- Integration with external services (email, calendar, Stripe, Teams, etc.)
- Trigger/action configuration

### Phase 9: Mobile PWA
**Status**: ⏳ NOT STARTED
- Progressive web app manifest
- Offline support
- Push notifications
- Mobile app-like experience

### Phase 10: Real Integrations
**Status**: ⏳ NOT STARTED
- OpenAI/Claude API integration
- Email service integration
- Calendar service integration (Google, Outlook)
- Stripe integration
- Teams/Slack integration
- Telegram bot for command input

---

## Database Schema Reference

### Core Tables
- **users** - User accounts (email, name, role)
- **workspaces** - Business and private workspaces
- **workspace_members** - Team membership and roles

### Task Management
- **projects** - Project containers
- **tasks** - Individual tasks with priority and status
- **team_handoffs** - Task delegations between users

### Finance
- **finance_accounts** - Bank/credit accounts
- **invoices** - Customer invoices
- **payments** - Payment tracking
- **contracts** - Contract management with renewal dates

### Communication
- **emails** - Email triage
- **calendar_events** - Calendar events and meetings
- **contact_profiles** - Contact information and trust levels

### AI & Learning
- **memories** - User behavior memories (PRIVATE/BUSINESS scoped)
- **decision_history** - Learning from user decisions
- **priority_rules** - Dynamic priority rules
- **delegation_rules** - Task delegation patterns
- **daily_briefings** - AI-generated briefings

### System
- **automations** - Automation rules
- **agents** - AI agents configuration
- **activity_log** - System activity tracking

---

## Current Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Database Setup
```bash
# Run schema on Neon
psql "DATABASE_URL" < neon/schema.sql

# Or use Drizzle migrations
npm run db:generate
npm run db:push
```

### 3. Environment Variables (.env.local)
```env
DATABASE_URL="postgresql://neondb_owner:npg_faLASvg2p6ZT@ep-summer-mouse-aoqlp1zc-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
NEXTAUTH_SECRET="your-secret-key-change-this"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Development
```bash
npm run dev
```

Visit: http://localhost:3000
- Email: owner@example.com
- Password: password

---

## Design Principles

### Visual Design
- ✅ Dark tactical command centre
- ✅ Premium commercial SaaS aesthetic
- ✅ Mobile-first responsive design
- ✅ Clear urgency colors (red=high, yellow=medium, green=low)
- ✅ Clean card-based layouts
- ✅ Animated brain icon for AI processing

### Privacy & Security
- ✅ Private workspace only visible to owner
- ✅ Team users cannot see private data
- ✅ Row-level security policies
- ✅ Strict permission separation

### AI Learning
The system learns from:
- User decisions and approvals
- Email urgency markings
- Task delegation patterns
- Priority changes
- Calendar suggestions
- Communication patterns

---

## Key Features to Implement

### Missing Components
1. `src/components/calendar-view.tsx` - Calendar display (URGENT)
2. Finance dashboard components
3. Email triage interface
4. Team management interface
5. Memory/learning dashboard
6. Automation rule builder

### API Routes Needed
- `/api/tasks` - CRUD for tasks
- `/api/projects` - CRUD for projects
- `/api/calendar` - Calendar events
- `/api/finance` - Finance operations
- `/api/emails` - Email triage
- `/api/memories` - Memory storage
- `/api/decision-history` - Learning tracking

### Mock Data to API Integration
All pages currently use mock data. Need to:
1. Create API route handlers
2. Replace mock data with database queries
3. Implement real data mutations

---

## Next Steps for Codex

1. **Complete Phase 3**: Create `calendar-view.tsx` component
2. **Create API routes**: Set up database query handlers
3. **Phase 4**: Finance module with invoice/payment tracking
4. **Phase 5**: Email triage with AI classification
5. **Phase 6**: Team management and handoffs
6. **Phase 7**: Memory system and AI learning engine
7. **Phase 8**: Automations (Node-RED/n8n integration)
8. **Phase 9**: PWA capabilities
9. **Phase 10**: Real integrations (OpenAI, email, calendar, Stripe, etc.)

---

## Important Notes

- **NOT a messaging app** - Command-driven interface, not chat-based
- **Premium SaaS** - Professional, tactical command center aesthetic
- **Cloud-first** - All data stored in Neon PostgreSQL
- **Mobile-responsive** - Works on any device
- **Self-learning** - AI adapts to user behavior and preferences
- **Privacy-focused** - Strict separation of personal and business data

---

## File Structure
```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/
│   │   └── routes (to be created)
│   ├── auth/
│   │   └── signin/page.tsx
│   ├── dashboard/page.tsx
│   ├── private/page.tsx
│   ├── brain/page.tsx
│   ├── tasks/page.tsx
│   ├── projects/page.tsx
│   ├── calendar/page.tsx
│   ├── finance/ (to be created)
│   ├── emails/ (to be created)
│   ├── teams/ (to be created)
│   └── layout.tsx
├── components/
│   ├── brain-icon.tsx
│   ├── command-input.tsx
│   ├── workspace-selector.tsx
│   ├── dashboard-panels.tsx
│   ├── task-card.tsx
│   ├── project-card.tsx
│   ├── calendar-view.tsx (NEEDS CREATION)
│   └── providers.tsx
├── db/
│   ├── schema.ts
│   └── index.ts
├── lib/
│   └── auth.ts
├── types/
│   └── index.ts
└── app/
    └── globals.css

neon/
└── schema.sql
```

---

## Ready to Continue!
All groundwork is complete. Phase 3 (calendar) needs the calendar-view component, then move to Phase 4-10 for full feature implementation.
