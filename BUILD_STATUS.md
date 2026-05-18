# Build Status

Current repo:
Atlas-Insight-LifeOS

Current branch:
feature/read-only-connectors-foundation

Current purpose:
Main ATLAS LifeOS shell for operational intelligence across business and personal life management.

Current stage:
Read-Only Universal Connector Foundation.

Current status:
- Atlas Connect foundation exists under `src/lib/connectors` with provider-neutral types, detection heuristics, read-only capability summaries, connection health helpers, mock connected accounts, and signal extraction summaries.
- `/connect` is the current Atlas Connect setup surface for approved read-only email/calendar account signal preparation.
- Modules now routes Atlas Connect to `/connect`.
- Operational Context Engine and Daily Brief can consume connector signal summaries.
- Atlas Brain fallback Command Queue suggestions include connector-aware proposed actions while preserving approval-only behaviour.
- No production OAuth, credential storage, token refresh, live inbox/calendar sync, write access, or external automation exists in this phase.

Current known issues:
- Local shell execution is unavailable in this environment, so required TypeScript/build validation still needs to run in a working local or CI environment.
- Provider detection is heuristic only and does not perform DNS/MX lookup, OAuth discovery, autodiscover, or live account verification.
- `/connect` uses mock connected accounts only and does not persist user setup state.
- Production read-only connector implementation needs consent design, secure token storage, audit logging, provider-specific scopes, and privacy review.

Current priority:
Validate this connector foundation branch, then prepare the first real read-only provider implementation path.

Immediate goal:
Run `npx tsc --noEmit`, then `DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder" npm run build`, then smoke test `/connect`, `/modules`, `/ask-atlas`, and `/command-queue`.
