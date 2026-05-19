# Changelog

## 2026-05-19 - Digital Twin + Approval-Gated Command Queue Actions
- Added Digital Twin foundation under `src/lib/twin` with scenario prompts, profile inference, draft guidance, lightweight adjustments, and feedback helpers.
- Added `/twin/setup` with 10 scenario-based onboarding questions and a calm completion summary.
- Added approval-gated action contracts under `src/lib/actions` for email drafts, outreach drafts, calendar suggestions, task rescheduling, project follow-ups, meeting packs, and daily priority adjustments.
- Upgraded `/command-queue` into the prepared-work layer with Ready for approval, Needs your guidance, Draft replies, Suggested scheduling changes, Follow-up opportunities, and Priority recommendations.
- Added email signal classification and draft helper logic that ignores likely newsletters/no-reply/promotional noise and prepares drafts only.
- Promoted Calendar into top-level navigation and rebuilt `/calendar` as a planning surface with Today, Upcoming, Deadline, Overdue, unscheduled tasks, focus protection, meeting prep, workload density, and suggested schedule blocks.
- Added lightweight scheduling helpers under `src/lib/scheduling` and calendar planning helpers under `src/lib/calendar`.
- Added migration plan and Drizzle schema entries for `twin_profiles`, `twin_feedback_events`, `command_queue_actions`, `draft_messages`, `schedule_suggestions`, and `approval_actions`.
- Preserved safety boundaries: no autonomous execution, no auto-send, no calendar writes, no hidden actions, and all external actions remain approval-gated.

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
