# Changelog

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
