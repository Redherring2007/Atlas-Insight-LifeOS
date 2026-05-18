# Atlas LifeOS Data Model Notes

## Stage: TypeScript Hardening Stabilisation
Date/time: 2026-05-18 12:51 Asia/Dubai
Branch: stabilisation/typescript-hardening

## Schema Source
The current type source is `src/db/schema.ts` using Drizzle inferred select/insert types exported from `src/types/index.ts`.

## Key Assumptions Preserved
- Many database fields are nullable because they are optional in Drizzle schema definitions.
- Decimal fields such as finance account `balance`, invoice `amount`, payment `amount`, and contract `value` are represented as strings by the schema layer.
- `team_handoffs` does not currently persist a `status` column.
- Email triage fields such as read state, preview text, tags, and linked project labels are UI/demo metadata unless the schema is extended later.
- Contact fields such as where-met and conversation notes are UI/demo metadata unless the schema is extended later.

## Stabilisation Approach
- Persisted schema types were not loosened.
- UI-only extension types were added for demo metadata.
- Display helpers normalize nullable values before rendering.
- Handoff status is derived UI state until the schema intentionally adds persisted status.

## No Migration Changes
No schema or migration files were changed in this pass.

## Exact Next Step
If the product decides that handoff status, contact notes, or email triage metadata should be persisted, add explicit schema fields and a migration in a dedicated data-model task.
