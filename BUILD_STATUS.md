# Build Status

Current repo:
Atlas-Insight-LifeOS

Current branch:
feature/google-oauth-live-connection

Current purpose:
Main ATLAS LifeOS shell for operational intelligence across business and personal life management.

Current stage:
Google OAuth Live Read-Only Connection.

Current status:
- Google OAuth has a safe live connection foundation with signed state and session-user validation.
- Connected account persistence has a SQL migration plan and Drizzle schema entries.
- Token fields are encrypted with `ATLAS_TOKEN_ENCRYPTION_KEY`; missing key blocks persistence.
- Google callback can exchange code, fetch Google profile, and persist encrypted tokens when database/encryption are ready.
- Google signal sync can use a stored connected account id to fetch read-only Gmail metadata/snippets and Calendar event metadata.
- `/connect` shows OAuth readiness, encryption readiness, connected account previews, sync preview, and disconnect placeholder.
- No write scopes, token logging, raw token response, full email body storage, attachment downloading, email mutation, calendar mutation, or autonomous execution exists in this phase.

Current known issues:
- Local shell execution is unavailable in this environment, so required TypeScript/build validation still needs to run in a working local or CI environment.
- Migration has not been applied.
- OAuth state is signed and time-limited but not yet server-stored for one-time replay prevention.
- Refresh-token rotation and disconnect/revoke are not implemented yet.
- Demo auth user may need a real database user row before connected account foreign keys succeed.

Current priority:
Validate the branch, apply migration safely, then complete one local Google read-only OAuth smoke test.

Immediate goal:
Run `npx tsc --noEmit`, then `DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder" npm run build`, apply `db/migrations/0001_connected_accounts.sql`, configure Google read-only OAuth env values, and test `/connect` end to end.
