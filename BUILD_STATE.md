# Atlas LifeOS Build State

Stage: Google OAuth Live Read-Only Connection
Date/time: 2026-05-18 20:00 Asia/Dubai
Branch: feature/google-oauth-live-connection
Status: Safe live Google OAuth connection foundation prepared on GitHub branch; validation blocked by unavailable local shell.

## Current Purpose
Turn the Google Workspace read-only adapter foundation into a secure live connection flow with signed OAuth state, encrypted token persistence, and read-only Gmail/Calendar signal sync boundaries.

## Current Status
- Added migration plan and Drizzle schema entries for `connected_accounts` and `connected_account_signals`.
- Added `ATLAS_TOKEN_ENCRYPTION_KEY` requirement for token persistence.
- Added token encryption helpers using AES-256-GCM.
- Added signed OAuth state helpers using `NEXTAUTH_SECRET` with expiry and user/provider binding.
- Google OAuth callback now validates state, checks session user match, exchanges code, fetches Google profile, and stores encrypted tokens when persistence is available.
- Google signal route can use a stored connected account id to decrypt the access token server-side and sync read-only signals.
- `/connect` now shows live readiness, callback status, encryption readiness, connected account previews, and sync preview.

## Current Blockers
- Local shell execution is unavailable, so `git status --short`, `npx tsc --noEmit`, and the production build command could not execute.
- Migration has not been applied from this environment.
- Full OAuth browser flow cannot be tested here.

## Checks Run
- Read all required docs and `.env.example`.
- Attempted required Git/TypeScript/build commands; blocked before shell startup.
- Ran targeted GitHub searches for unsafe write scopes and forbidden wording.
- Reviewed branch diff through the GitHub connector.

## Checks Still Required
- `git status --short`
- `npx tsc --noEmit`
- `DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder" npm run build`
- Apply `db/migrations/0001_connected_accounts.sql` in a safe DB.
- Smoke test `/api/connect/google/start`, `/api/connect/google/callback`, `/api/connect/google/health`, and `/api/connect/google/signals`.

## Known Risks
- OAuth state is signed and time-limited but not yet stored server-side for one-time replay prevention.
- Token refresh is not yet fully wired into signal sync.
- Disconnect/revoke is not implemented yet.
- Demo user id may not satisfy DB foreign keys unless the demo user exists in the target database.

## Exact Next Step
Run validation in CI or a working local shell, apply the migration, configure Google OAuth read-only credentials and `ATLAS_TOKEN_ENCRYPTION_KEY`, then smoke test the live read-only connection flow end to end.
