# Atlas LifeOS Cleanup Audit

Stage: Repository Cleanup and Atlas-only Audit
Date/time: 2026-05-18 17:15 Asia/Dubai
Branch: chore/repo-cleanup-atlas-only

## Scope
This pass audited the repository against the current ATLAS LifeOS direction:
- Home
- Ask Atlas
- Command Queue
- Modules
- Settings
- Atlas Brain
- Operational Context Engine
- Daily Brief
- Future Atlas Twin entry point
- Module launcher for Projects, CRM, Verify, Risk, Finance, Vault, Connect, and MyLife

This was not a feature build, orchestration pass, UI redesign, or module expansion.

## Audit Method
- Read required project tracking docs.
- Attempted required local commands, but the shell could not start in this environment.
- Audited known current shell routes, known legacy/prototype routes, stale duplicate AI surfaces, automation surfaces, generated artifacts, and unrelated-project language through GitHub branch file reads and targeted searches.
- Removed only files that were clearly stale, duplicate, misleading, conflicting, or superseded by the current shell architecture.

## KEEP
These are current build files and should remain active.

- `src/app/page.tsx` — authenticated root redirect to Home.
- `src/app/dashboard/page.tsx` — current Home shell.
- `src/app/ask-atlas/page.tsx` — current Ask Atlas interface.
- `src/app/command-queue/page.tsx` — current approval/action layer.
- `src/app/modules/page.tsx` — current module launcher.
- `src/app/settings/page.tsx` — current settings shell.
- `src/app/api/atlas-brain/route.ts` — controlled Atlas Brain API route.
- `src/lib/ai/**` — Atlas Brain service layer and prompt builders.
- `src/lib/context/**` — Operational Context Engine and structured context builders.
- `src/components/side-nav.tsx` — current five-item shell navigation.
- `src/components/brand-header.tsx` — active shell header component.
- `ARCHITECTURE.md`, `MODULE_MAP.md`, `BUILD_LOG.md`, `BUILD_STATE.md`, `CHANGELOG.md`, `QA.md`, `BUILD_STATUS.md` — active documentation tracking system.
- `.env.example` — current local environment documentation.
- `.gitignore` — active generated-file hygiene.

## KEEP BUT LEGACY / INTERNAL
These routes/components are useful prototype module surfaces and should remain available for now, but they are not top-level shell destinations.

- `src/app/projects/**` — Atlas Projects prototype/internal module surface.
- `src/app/contacts/**` — Atlas CRM prototype/internal module surface.
- `src/app/finance/**` — Atlas Finance prototype/internal module surface.
- `src/app/calendar/**` — Atlas MyLife/calendar prototype/internal module surface.
- `src/app/emails/**` — email-aware CRM/follow-up prototype surface.
- `src/app/teams/**` — team/handoff prototype surface; kept as internal capability.
- Supporting module cards/types for the routes above — retained if still used by kept module surfaces.

Reason: the current shell intentionally hides module complexity behind `/modules`, but these prototypes may later become module internals. Removing them would risk deleting useful capability too early.

## ARCHIVE
No source files were physically moved into an archive folder in this pass.

Reason: the clearly stale files contained misleading product language, unsupported automation/autonomy claims, or duplicate routes. Their cleanup decision is archived here instead of preserving executable source that could confuse future builds.

## REMOVE
The following files were removed from the active repository branch.

### Duplicate / misleading AI surfaces
- `src/app/brain/page.tsx`
  - Removed because it was a duplicate AI Brain route with old light UI, memory-bank claims, learning patterns, and apply-style suggestions that conflict with the current controlled Atlas Brain architecture.
- `src/app/ai-brain/page.tsx`
  - Removed because Ask Atlas is now the active Atlas Brain entry point. This route duplicated the AI surface and depended on stale learning/memory components.
- `src/components/ai-brain-panel.tsx`
  - Removed because it claimed always-learning context and duplicated Ask Atlas prompt UX.
- `src/components/learning-signals-panel.tsx`
  - Removed because it implied auto-learning/memory behavior not built in the current product boundary.
- `src/components/brain-icon.tsx`
  - Removed because it only supported the removed private command workspace.

### Automation surfaces that conflict with Command Queue
- `src/app/automations/page.tsx`
  - Removed because it presented rule-based automatic execution, email sending, Slack messages, and invoice follow-ups. That conflicts with the current approval-only Command Queue model.
- `src/components/rule-card.tsx`
- `src/components/rule-builder.tsx`
- `src/components/action-configurator.tsx`
- `src/components/trigger-selector.tsx`
  - Removed because they only supported the removed automation builder.

### Superseded integrations / unrelated module language
- `src/app/connected-systems/page.tsx`
  - Removed because Modules / Atlas Connect supersedes it. It also referenced OSINT, Sargassum, and trading-bot concepts that conflict with ATLAS LifeOS positioning.
- `src/components/connected-system-card.tsx`
  - Removed because it only supported the removed connected-systems page and included trading-specific icon logic.

### Stale private/offline surfaces
- `src/app/private/page.tsx`
  - Removed because it was an old private command workspace with execute-style command language and no current shell role.
- `src/components/command-input.tsx`
  - Removed because it only supported the removed private command workspace and used execute-style command language.
- `src/components/dashboard-panels.tsx`
  - Removed because it only supported the removed private workspace.
- `src/app/offline/page.tsx`
  - Removed because it claimed cached offline availability that is not implemented or part of the current LifeOS shell.

### Duplicate team route
- `src/app/team/page.tsx`
  - Removed because it was only an alias to `/teams`. `/teams` remains as the useful internal prototype surface.

## Files Requiring Future Decision
- `src/app/teams/**` — keep as internal for now, but later decide whether this becomes part of Atlas Projects, Atlas CRM, or Settings/permissions.
- `src/app/emails/**` — keep as internal for now, but later decide whether this lives under Atlas CRM or Atlas Connect.
- `src/app/calendar/**` — keep as internal for now, but later decide whether it becomes Atlas MyLife or a read-only context source.
- `src/app/finance/**` — keep as internal for now, but later align with Atlas Finance strategy and accounting-system integration boundaries.
- `src/app/projects/**` — keep as internal for now, but later decide whether it remains in LifeOS or moves fully into Atlas Projects.
- `src/app/contacts/**` — keep as internal for now, but later align with Atlas CRM.
- `src/components/privacy-banner.tsx` — kept for now because privacy language may still support Settings/MyLife later, but it is not currently a top-level shell dependency.

## Route Cleanup Decisions
- Active shell routes kept: `/dashboard`, `/ask-atlas`, `/command-queue`, `/modules`, `/settings`.
- Active API route kept: `/api/atlas-brain`.
- Module/internal routes kept: projects, contacts, finance, calendar, emails, teams.
- Removed duplicate AI routes: `/brain`, `/ai-brain`.
- Removed superseded integration route: `/connected-systems`.
- Removed conflicting automation route: `/automations`.
- Removed stale private/offline routes: `/private`, `/offline`.
- Removed duplicate alias: `/team`.

## Documentation Cleanup Decisions
- Kept the existing tracking system rather than rewriting it.
- Added this `CLEANUP_AUDIT.md` as the durable cleanup record.
- Updated build tracking docs with files removed, known validation limitations, and exact next step.
- No business plan or product strategy docs were rewritten.

## Generated-file Cleanup Decisions
- Confirmed `tsconfig.tsbuildinfo` is not present on this branch.
- Updated `.gitignore` to include:
  - `.next`
  - `node_modules`
  - `tsconfig.tsbuildinfo`
  - `.env`
  - `.env.local`
  - `npm-debug.log*`
  - `yarn-debug.log*`
  - `yarn-error.log*`
  - `pnpm-debug.log*`
  - `*.log`
  - `263`
  - `*.tmp`
  - `*.temp`
- No `.next`, `node_modules`, tracked env files, tracked debug logs, or `263` artifact were found through targeted GitHub searches in this pass.

## Validation Status
Attempted but not completed in this environment:
- `git status --short`
- `npx tsc --noEmit`
- `DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder" npm run build`

Reason: local shell execution failed before `/bin/bash` startup with `No such file or directory (os error 2)`.

## Exact Next Step
Run TypeScript and production build validation in a working local shell or CI. If validation passes, keep this cleanup branch as the Atlas-only baseline for future read-only context adapter work.
