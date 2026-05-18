# Changelog

## 2026-05-18 - Google OAuth Live Read-Only Connection
- Added connected account persistence migration plan for encrypted provider tokens and operational signal summaries.
- Added Drizzle schema entries for `connected_accounts` and `connected_account_signals`.
- Added token encryption helpers using `ATLAS_TOKEN_ENCRYPTION_KEY`; missing key prevents live token persistence.
- Added signed OAuth state helpers bound to provider, user id, nonce, and expiry.
- Updated Google OAuth start/callback flow to use signed state, validate session user match, exchange code, fetch Google profile, and store encrypted tokens server-side.
- Updated Google health route to report token encryption readiness and stored Google account previews.
- Updated Google signals route to sync read-only Gmail/Calendar signals from a stored connected account id or fall back safely to mock signals.
- Updated `/connect` with live readiness, callback status, connected account preview, signal sync preview, and disconnect/revoke placeholder.
- Preserved safety boundaries: read-only scopes only, no token logging, no raw token response, no full email body storage, no attachment downloads, no email/calendar mutations, and no autonomous execution.

## 2026-05-18 - Google Workspace Read-Only Adapter Foundation
- Added provider-specific Google Workspace adapter foundation under `src/lib/connectors/google`.
- Added read-only Google OAuth helpers for auth URL generation, code exchange, refresh, scope configuration, and scope safety checks.
- Added API routes for `/api/connect/google/start`, `/api/connect/google/callback`, `/api/connect/google/health`, and `/api/connect/google/signals`.
- Added Gmail read-only metadata/snippet signal extraction for urgent follow-ups, client opportunities, meeting changes, finance pressure, travel mentions, and operational blockers.
- Added Google Calendar read-only event metadata signal extraction for meetings, travel, schedule pressure, personal/work clashes, deadlines, and operational blockers.
- Updated `/connect` with a Google Workspace read-only adapter card, Connect Google action, supported signals, adapter health, and explicit no-write safety language.
- Updated `.env.example` with Google read-only OAuth variables and scopes.
- Integrated mock Google Gmail/Calendar signals into connector summaries used by the Operational Context Engine.
- Preserved safety boundaries: no write scopes, no email sending, no calendar editing, no event creation, no deleting/archive/mark-read, no auto-responding, no token persistence, and no autonomous execution.

## 2026-05-18 - Read-Only Universal Connector Foundation
- Added provider-neutral Atlas Connect contracts under `src/lib/connectors` for providers, connection methods, read-only capabilities, connection health, connected accounts, and operational signals.
- Added deterministic local provider detection for Gmail/Google Workspace, Microsoft 365/Outlook/Exchange, iCloud, Zoho, Yahoo, Proton Mail Bridge/manual, Generic IMAP, Google Calendar, Outlook Calendar, CalDAV, and ICS fallback paths.
- Added mock connected accounts and signal extraction summaries for meetings, travel, urgent follow-ups, client opportunities, finance pressure, schedule pressure, operational blockers, risk awareness, and personal/work clashes.
- Added `/connect` with read-only setup explanation, account/provider detection, confidence result, manual setup fallback, connected account mocks, connection health, and supported signal types.
- Updated the Atlas Connect module card to link to `/connect` and use trust-focused approved-account signal language.
- Integrated connector signal summaries into the Operational State Engine, Daily Brief context, and Atlas Brain fallback Command Queue suggestions.
- Preserved safety boundaries: no production OAuth, no write access, no email sending, no calendar editing, no external automation, and no autonomous execution.

## 2026-05-18 - Repository Cleanup and Atlas-only Audit
- Added `CLEANUP_AUDIT.md` with keep, legacy/internal, archive, remove, and future-decision classifications.
- Removed stale duplicate AI routes `/brain` and `/ai-brain` now superseded by Ask Atlas and Atlas Brain service layer.
- Removed stale automation builder route and components that conflicted with approval-only Command Queue direction.
- Removed superseded connected-systems route and trading-bot/OSINT/Sargassum integration language now covered by Modules / Atlas Connect strategy.
- Removed stale private/offline routes and duplicate `/team` alias.
- Tightened `.gitignore` for debug logs, temporary artifacts, and generated files.

## 2026-05-18 - Context Awareness Foundation
- Added structured context layer under `src/lib/context` for tasks, projects, command queue, finance, calendar, risk, priorities, focus analysis, daily brief, and operational state.
- Added Operational State Engine to aggregate workload pressure, focus pressure, approval load, finance pressure, resilience awareness, blockers, opportunities, and risk indicators.
- Updated Atlas Brain to receive concise operational context and return a UI-safe context snapshot.
- Upgraded Daily Brief, focus analysis, operational summary, and command suggestion prompts to use structured context.
- Updated Ask Atlas with subtle operational awareness signals after responses.
- Updated Command Queue suggestions to use context-aware proposed actions while remaining approval-only.
- Refined Atlas Risk module copy around operational resilience and continuity awareness.

## 2026-05-18 - Atlas Brain Integration Foundation
- Added typed Atlas Brain service layer under `src/lib/ai` with config, request/response contracts, prompt builders, Ollama provider, and safe fallback handling.
- Added `/api/atlas-brain` for controlled Ask Atlas modes: ask, daily brief, command suggestions, operational summary, and focus.
- Wired Ask Atlas to submit prompts, show loading/live/fallback states, and display proposed queue-ready actions.
- Wired Command Queue to request proposed Atlas Brain suggestions while preserving approval-only shell actions.
- Added `.env.example` for `DATABASE_URL`, NextAuth local values, `OLLAMA_BASE_URL`, and `ATLAS_BRAIN_MODEL`.
- Ignored local env/build artifacts and removed tracked `tsconfig.tsbuildinfo` from the repository branch.

## 2026-05-18 - LifeOS Shell Simplification
- Simplified primary navigation to Home, Ask Atlas, Command Queue, Modules, and Settings.
- Rebuilt Home as a calm operational surface with Ask Atlas, Today's Focus, Command Queue preview, Daily Brief, module preview, and two strategic signals.
- Added Ask Atlas page as an AI-ready operational brain interface prepared for future local Atlas Brain integration.
- Added Command Queue page with mock approval cards and safe shell actions: Approve, Edit, Snooze, Dismiss.
- Added Modules launcher for Atlas Projects, CRM, Verify, Risk, Finance, Vault, Connect, and MyLife.
- Preserved underlying prototype routes while hiding complexity from the top-level shell.

## 2026-05-18 - TypeScript Hardening Stabilisation
- Added NextAuth session/JWT/User type augmentation for stable `session.user.id` and `session.user.role` usage.
- Added display-safe helpers for nullable strings, dates, and decimal money fields.
- Added UI extension types for demo-only contact, email, team member, and handoff metadata.
- Aligned finance mock data with Drizzle decimal string expectations.
- Normalized nullable task, project, invoice, calendar, contact, email, and handoff values before rendering.
- Documented current build state, QA status, data model assumptions, and remaining validation step.
