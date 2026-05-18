# Build Status

Current repo:
Atlas-Insight-LifeOS

Current branch:
feature/google-workspace-readonly-adapter

Current purpose:
Main ATLAS LifeOS shell for operational intelligence across business and personal life management.

Current stage:
Google Workspace Read-Only Adapter Foundation.

Current status:
- Google Workspace is now the first provider-specific Atlas Connect adapter foundation.
- `src/lib/connectors/google` contains read-only config, OAuth helpers, Gmail metadata/snippet extraction, Google Calendar event metadata extraction, signal mapping, and health helpers.
- `/api/connect/google/start`, `/api/connect/google/callback`, `/api/connect/google/health`, and `/api/connect/google/signals` exist as safe foundation routes.
- `/connect` shows Google Workspace as the first real adapter path with read-only scope explanation, mock-safe state, health panel, and safety boundary.
- `.env.example` documents `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`, and `GOOGLE_CONNECT_SCOPES`.
- Operational Context Engine can consume mock Google Gmail/Calendar signals without requiring a live connection.
- No token persistence, credential storage, write scopes, email sending, calendar editing, event creation, deleting, archiving, mark-read, auto-responding, or autonomous execution exists in this phase.

Current known issues:
- Local shell execution is unavailable in this environment, so required TypeScript/build validation still needs to run in a working local or CI environment.
- Google OAuth callback does not persist tokens and therefore does not create a durable connected account yet.
- Live signals route requires a bearer access token supplied for the request; this is foundation-only and not production account linking.
- Signal extraction is heuristic and metadata/snippet based.
- Secure encrypted token storage, consent audit trail, disconnect/revoke flow, and provider verification remain future work.

Current priority:
Validate the Google adapter foundation branch, then design secure token persistence and account-linking before enabling live Google connections.

Immediate goal:
Run `npx tsc --noEmit`, then `DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder" npm run build`, then smoke test `/connect` and the Google connector API routes.
