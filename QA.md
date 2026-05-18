# Atlas LifeOS QA

## Stage: Google OAuth Live Read-Only Connection
Date/time: 2026-05-18 20:00 Asia/Dubai
Branch: feature/google-oauth-live-connection

### Required Checks
- `git status --short`
- `npx tsc --noEmit`
- `DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder" npm run build`
- Migration smoke test for `db/migrations/0001_connected_accounts.sql`.
- Browser smoke test of `/connect`.
- API smoke test of Google connector routes.

### Checks Attempted In This Environment
- Attempted `git status --short`.
- Attempted `npx tsc --noEmit`.
- Attempted `DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder" npm run build`.
- Reviewed and updated branch files through the GitHub connector.
- Ran targeted searches for unsafe write scopes and forbidden wording.

### Checks Not Completed
- `git status --short`: local shell process could not start.
- `npx tsc --noEmit`: local shell process could not start.
- Production build command: local shell process could not start.
- Migration execution: local shell/database access unavailable.
- Browser visual QA: app could not be launched from this environment.
- Live Google OAuth QA: not completed because local runtime/browser flow is unavailable.

### Errors Encountered
- Execution tool rejected `/bin/bash` startup with `No such file or directory (os error 2)` for all commands.

### Manual QA Notes
- Google start route requires a signed-in user and signed OAuth state.
- Google callback validates signed state and session user match before token exchange.
- Missing `ATLAS_TOKEN_ENCRYPTION_KEY` prevents token persistence and redirects safely to `/connect`.
- Tokens are encrypted server-side and raw tokens are never returned to the client.
- `/api/connect/google/signals` can sync from a stored connected account id or return mock-safe signals.
- Gmail mapping remains metadata/snippet only; full bodies and attachments are not stored.
- Calendar mapping remains metadata only; no event edits are performed.
- `/connect` shows readiness, callback status, connected account preview, and disconnect placeholder.

### Local Validation Steps
1. Run `git status --short`.
2. Run `npx tsc --noEmit`.
3. Run `DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder" npm run build`.
4. Apply `db/migrations/0001_connected_accounts.sql` to a local/dev database.
5. Set `NEXTAUTH_SECRET`, `ATLAS_TOKEN_ENCRYPTION_KEY`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`, and read-only `GOOGLE_CONNECT_SCOPES`.
6. Confirm Google Cloud OAuth redirect URI exactly matches `/api/connect/google/callback`.
7. GET `/api/connect/google/health` and confirm OAuth/encryption readiness.
8. Start OAuth from `/connect`, complete Google consent, and confirm redirect returns to `/connect?google=connected`.
9. GET `/api/connect/google/signals?connectedAccountId=<id>` and confirm read-only signal sync without token exposure.
10. Confirm no route or UI implies sending, deleting, archiving, mark-read, full body storage, attachment download, calendar editing, event creation, auto-responding, account changes, or autonomous execution.

### Exact Next Step
Run TypeScript/build validation in a working local or CI environment, apply the migration, then complete one local Google read-only OAuth smoke test.
