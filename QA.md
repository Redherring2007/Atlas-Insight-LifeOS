# Atlas LifeOS QA

## Stage: Digital Twin + Approval-Gated Command Queue Actions
Date/time: 2026-05-19 12:00 Asia/Dubai
Branch: feature/digital-twin-command-queue-actions

### Required Checks
- `git status --short`
- `npx tsc --noEmit`
- `DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder" npm run build`
- Migration smoke test for `db/migrations/0002_twin_command_queue_actions.sql`.
- Browser smoke test of `/twin/setup`, `/command-queue`, `/calendar`, `/ask-atlas`, and `/settings`.

### Checks Attempted In This Environment
- Attempted `git status --short`.
- Attempted `npx tsc --noEmit`.
- Attempted `DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder" npm run build`.
- Read required docs and schema files through the GitHub connector.
- Reviewed branch diff through the GitHub connector.

### Checks Not Completed
- `git status --short`: local shell process could not start.
- `npx tsc --noEmit`: local shell process could not start.
- Production build command: local shell process could not start.
- Migration execution: local shell/database access unavailable.
- Browser visual QA: app could not be launched from this environment.

### Errors Encountered
- Execution tool rejected `/bin/bash` startup with `No such file or directory (os error 2)` for all commands.

### Manual QA Notes
- `/twin/setup` should show 10 scenario questions, defaults, progress, completion summary, and adjustment chips.
- `/command-queue` should show prepared work sections and actions for Approve, Edit, Rewrite, Regenerate, Dismiss, plus email draft review controls.
- `/calendar` should be reachable from the top-level nav and should present planning/readiness only, not calendar editing.
- `/ask-atlas` and `/settings` should expose Digital Twin setup entry points.
- All external action language should remain approval-gated and should not imply hidden execution.
- No email sending, calendar writing, deleting, archiving, mark-read, or autonomous execution is implemented in this phase.

### Local Validation Steps
1. Run `git status --short`.
2. Run `npx tsc --noEmit`.
3. Run `DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder" npm run build`.
4. Apply `db/migrations/0002_twin_command_queue_actions.sql` to a local/dev database.
5. Open `/twin/setup`, answer at least three scenarios, complete setup, and verify the summary renders.
6. Open `/command-queue` and test Approve, Edit, Rewrite, Regenerate, and Dismiss state changes.
7. Open `/calendar` and confirm schedule suggestions remain approval-only.
8. Confirm top-level navigation includes Calendar without breaking Home, Ask Atlas, Command Queue, Modules, or Settings.

### Exact Next Step
Run TypeScript/build validation in a working local or CI environment, then smoke test the new Twin, Command Queue, and Calendar routes in the browser.
