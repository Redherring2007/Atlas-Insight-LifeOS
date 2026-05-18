# Changelog

## 2026-05-18 - TypeScript Hardening Stabilisation
- Added NextAuth session/JWT/User type augmentation for stable `session.user.id` and `session.user.role` usage.
- Added display-safe helpers for nullable strings, dates, and decimal money fields.
- Added UI extension types for demo-only contact, email, team member, and handoff metadata.
- Aligned finance mock data with Drizzle decimal string expectations.
- Normalized nullable task, project, invoice, calendar, contact, email, and handoff values before rendering.
- Documented current build state, QA status, data model assumptions, and remaining validation step.
