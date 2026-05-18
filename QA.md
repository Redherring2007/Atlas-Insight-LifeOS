# Atlas LifeOS QA

## Stage: Google Workspace Read-Only Adapter Foundation
Date/time: 2026-05-18 19:05 Asia/Dubai
Branch: feature/google-workspace-readonly-adapter

### Required Checks
- `git status --short`
- `npx tsc --noEmit`
- `DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder" npm run build`
- Browser smoke test of `/connect`, `/modules`, `/ask-atlas`, `/command-queue`, and `/dashboard`.
- API smoke test of Google connector routes.

### Checks Attempted In This Environment
- Attempted `git status --short`.
- Attempted `npx tsc --noEmit`.
- Attempted `DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder" npm run build`.
- Reviewed and updated branch files through the GitHub connector.
- Checked obvious TypeScript compatibility issues and replaced `flatMap` usage because the repo targets an older ES lib.

### Checks Not Completed
- `git status --short`: local shell process could not start.
- `npx tsc --noEmit`: local shell process could not start.
- Production build command: local shell process could not start.
- Browser visual QA: app could not be launched from this environment.
- Live Google OAuth QA: not completed because local runtime and secure token persistence are not available in this pass.

### Errors Encountered
- Execution tool rejected `/bin/bash` startup with `No such file or directory (os error 2)` for all commands.

### Manual QA Notes
- `/connect` now presents Google Workspace as the first real adapter path.
- UI copy uses trust-focused wording: Atlas reviews approved connected accounts for operational signals only.
- The Google Connect action calls `/api/connect/google/start`; if env is missing, the UI remains mock-safe.
- `/api/connect/google/start` returns an auth URL only when env exists and scopes are read-only.
- `/api/connect/google/callback` accepts callback shape but does not persist or return raw tokens.
- `/api/connect/google/health` reports configured/mock-safe state and safety boundaries.
- `/api/connect/google/signals` returns sanitised mock signals when no bearer token or env is present.
- Gmail mapping uses metadata/snippet fields only; full email bodies are not stored or exposed.
- Calendar mapping uses event metadata only; no calendar edits are possible.
- Scope guard rejects unsupported non-read-only Google scopes before OAuth starts.

### Local Validation Steps
1. Run `git status --short`.
2. Run `npx tsc --noEmit`.
3. Run `DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder" npm run build`.
4. Smoke test `/connect` and confirm Google Workspace adapter card renders.
5. GET `/api/connect/google/health` with no env and confirm mock-safe response.
6. GET `/api/connect/google/start` with no env and confirm no auth URL is returned.
7. GET `/api/connect/google/signals` with no token and confirm mock signals return.
8. Configure read-only Google env values and confirm `/api/connect/google/start` returns an OAuth URL with Gmail readonly and Calendar readonly scopes only.
9. Confirm no route or UI implies sending, deleting, archiving, mark-read, calendar editing, event creation, auto-responding, account changes, or autonomous execution.

### Exact Next Step
Run the required TypeScript/build checks in a working local or CI environment and fix any compiler output before designing secure encrypted token persistence and account linking.
