# Atlas LifeOS Build Log

## Stage: Google OAuth Live Read-Only Connection
Date/time: 2026-05-18 20:00 Asia/Dubai
Branch: feature/google-oauth-live-connection

### Files Created
- `db/migrations/0001_connected_accounts.sql`
- `src/lib/connectors/token-crypto.ts`
- `src/lib/connectors/oauth-state.ts`
- `src/lib/connectors/connected-account-store.ts`

### Files Changed
- `.env.example`
- `src/db/schema.ts`
- `src/app/api/connect/google/start/route.ts`
- `src/app/api/connect/google/callback/route.ts`
- `src/app/api/connect/google/health/route.ts`
- `src/app/api/connect/google/signals/route.ts`
- `src/app/connect/page.tsx`
- `src/lib/connectors/google/types.ts`
- `src/lib/connectors/google/oauth.ts`
- `src/lib/connectors/google/health.ts`
- `BUILD_LOG.md`
- `BUILD_STATE.md`
- `CHANGELOG.md`
- `QA.md`
- `BUILD_STATUS.md`

### Database / Schema / Migration Changes
- Added SQL migration plan for `connected_accounts` and `connected_account_signals`.
- Added matching Drizzle schema entries in `src/db/schema.ts`.
- `connected_accounts` stores provider identity, account email, scopes, encrypted access/refresh tokens, token expiry, status, and sync timestamps.
- `connected_account_signals` stores mapped operational signals only, not full email bodies or attachments.
- Migration has not been executed from this environment because local shell execution is unavailable.

### Routes / Screens / Components Changed
- `/api/connect/google/start`: now requires signed-in user and creates a signed OAuth state token.
- `/api/connect/google/callback`: validates signed state, checks session/user match, exchanges code, fetches Google profile, encrypts tokens, stores connected account, and redirects safely to `/connect`.
- `/api/connect/google/health`: reports OAuth readiness, token encryption readiness, and stored Google connected account previews.
- `/api/connect/google/signals`: can sync read-only signals from a stored encrypted account token or fall back to mock-safe signals.
- `/connect`: now shows callback status, token encryption readiness, connected Google accounts, signal sync preview, and disconnect/revoke placeholder.

### Key Decisions Made
- Prioritised secure architecture over forcing a demo-only insecure connection.
- Added AES-256-GCM token encryption backed by `ATLAS_TOKEN_ENCRYPTION_KEY`; missing key prevents token persistence.
- Added signed OAuth state using `NEXTAUTH_SECRET` with timestamp, nonce, provider, and user id.
- Required callback session user to match signed state user.
- Never returns raw tokens to the client and does not log tokens.
- Stored only operational signal summaries from Gmail metadata/snippets and Calendar metadata.
- Kept disconnect/revoke as a placeholder because a safe revoke flow needs a separate implementation pass.

### Tests / Checks Run
- Read required docs: `ARCHITECTURE.md`, `MODULE_MAP.md`, `CLEANUP_AUDIT.md`, `BUILD_LOG.md`, `BUILD_STATE.md`, `CHANGELOG.md`, `QA.md`, `BUILD_STATUS.md`, `.env.example`.
- Attempted `git status --short`.
- Attempted `npx tsc --noEmit`.
- Attempted `DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder" npm run build`.
- Reviewed branch diff and targeted searches through the GitHub connector.

### Errors Encountered
- Local shell execution still cannot start `/bin/bash`; validation commands failed before Git, TypeScript, Node, or Next.js could run with `No such file or directory (os error 2)`.
- Browser QA and live Google OAuth smoke testing could not run from this environment.
- `feature/google-oauth-live-connection` did not exist at the start, so it was created from `feature/google-workspace-readonly-adapter`.

### Fixes Applied
- Added connected account persistence schema and migration plan.
- Added token encryption/decryption helpers with fail-safe missing-key behaviour.
- Added signed OAuth state helpers with expiry and constant-time signature comparison.
- Updated Google OAuth start/callback to use signed state and encrypted persistence.
- Updated Google health and signal routes to support stored connected accounts without exposing tokens.
- Updated Connect UI and environment documentation for live readiness.

### Known Issues
- TypeScript and production build validation still need to run in a working local or CI environment.
- Migration has not been applied.
- The OAuth state is signed and time-limited but not server-stored for one-time replay prevention yet.
- Refresh-token rotation and expired-token refresh are not fully wired into signal sync yet.
- Disconnect/revoke is a UI placeholder only.

### Remaining TODOs
- Run `npx tsc --noEmit` in a working environment.
- Run `DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder" npm run build` in a working environment.
- Apply the connected account migration in a safe database environment.
- Smoke test Google OAuth locally with read-only scopes and a valid redirect URI.
- Add token refresh, revoke/disconnect, audit trail, and one-time state storage before broader use.

### Exact Next Step
Run validation and apply the migration in a controlled environment, then smoke test `/api/connect/google/start`, `/api/connect/google/callback`, `/api/connect/google/health`, and `/api/connect/google/signals` with read-only Google OAuth credentials.
