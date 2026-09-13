# Inner Depths — Codex Instructions

## Project

Inner Depths is a freediving web application being rebuilt from existing
HTML prototypes as a production Next.js application.

The supplied HTML prototypes in `/reference` are the visual and behavioral
source of truth. Do not redesign the product unless explicitly instructed.

## Stack

- Next.js App Router
- TypeScript
- React
- Tailwind CSS where useful
- Existing global design tokens in `src/app/globals.css`
- Neon PostgreSQL
- Drizzle ORM
- Zod for validation
- Vercel deployment

## Development principles

1. Preserve the visual language of the supplied prototypes.
2. Convert prototype code into reusable React components rather than copying
   large HTML blocks into page files.
3. Keep `page.tsx` files small and compositional.
4. Use Server Components by default.
5. Add `"use client"` only where browser interaction or React hooks require it.
6. Never expose DATABASE_URL or server secrets to Client Components.
7. Database access belongs in server-side modules under `src/db` or server actions.
8. Validate user input with Zod before database writes.
9. Use strict TypeScript. Do not use `any` unless unavoidable and documented.
10. Prefer simple architecture over unnecessary abstractions.

## Current routing

User app:

- `/app/home`
- `/app/log`
- `/app/train`
- `/app/progress`
- `/app/community`

The `/app` layout owns the mobile application shell and bottom navigation.

## Database

Neon PostgreSQL is connected through Drizzle.

Database connection:

`src/db/index.ts`

Database health check:

`GET /api/health/db`

Do not change the database connection architecture unless necessary.

## UI

Use the design tokens already defined for:

- mist
- seafoam
- lumen
- tidal
- current
- depth
- abyss
- sand
- coral

Typography:

- DM Sans for UI/body
- DM Serif Display for display headings

The mobile application should visually match
`reference/inner-depths-prototype-v14.html`.

## MVP priorities

Build in this order:

1. Stable application shell
2. Authentication
3. User profile
4. Dive logging CRUD
5. Training logging
6. Home dashboard using real database data
7. Progress analytics
8. Performance assessment
9. Production deployment

Do not implement advanced research, WHOOP integration, labs, community social
features, or complex clinician tooling unless explicitly requested.

## Safety / research

ARS is a research instrument under validation.

Do not:
- present ARS as diagnostic
- expose clinician-side scores to participants
- invent scoring rules
- include ARS in normal onboarding without explicit instruction

## Quality gates

Before completing a task:

- run TypeScript checks
- run lint
- run relevant tests
- confirm existing routes still work
- avoid unrelated refactors

Useful commands:

`pnpm dev`
`pnpm lint`
`pnpm build`

When changing database schemas, explain the migration required.

## Working style

For large tasks:

1. inspect the existing repository first
2. state the implementation plan
3. make focused changes
4. run checks
5. summarize exactly what changed