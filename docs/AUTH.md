# MVP authentication

Better Auth handles email/password accounts, password hashing, session cookies,
and sign-out through `/api/auth/[...all]`. The Drizzle adapter maps its user
model to the existing `users` table. Profiles, dives, and training sessions
continue to reference the same `users.id` UUID. Auth support tables are
`accounts`, `sessions`, and `verifications`.

Set these server environment variables locally in `.env.local` and in the
deployment environment:

- `DATABASE_URL`: existing Neon PostgreSQL connection string.
- `BETTER_AUTH_SECRET`: a unique, high-entropy secret of at least 32 characters.
- `BETTER_AUTH_URL`: the public application origin, such as
  `http://localhost:3000` in development or the HTTPS origin in production.

Never use a `NEXT_PUBLIC_` prefix for these values. `.env.local` is ignored by
Git. Generate and apply schema changes with `pnpm db:generate` and
`pnpm db:migrate`; commit each generated SQL migration and its Drizzle metadata.

For future user-owned writes, call `requireCurrentUser()` from a server action
or route handler and use its `id`. Never accept a submitted `userId` as proof
of ownership. `/app` layout enforces an authenticated session and a completed
profile before rendering the five user routes.
