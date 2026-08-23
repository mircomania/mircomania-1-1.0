# AGENTS.md

## Project

Mircomania is a production Next.js application using:

- Next.js App Router
- React
- TypeScript
- CSS Modules
- Supabase

Before making architectural changes, inspect the existing implementation and relevant documentation under `/docs`.

## General rules

- Prefer the simplest solution that solves the actual problem.
- Do not refactor unrelated code.
- Do not introduce new dependencies without a clear reason.
- Preserve existing behavior unless the task explicitly requires changing it.
- Server Components are preferred by default.
- Use Client Components only when browser APIs, interactivity or client state require them.
- Keep database access outside presentation components.
- Never expose private Supabase credentials to client code.
- Maintain accessibility and responsive behavior.

## Documentation

Relevant project documentation lives under `/docs`.

Read only the documents relevant to the task instead of assuming every document is current.

When documentation conflicts with the implementation, report the inconsistency instead of silently changing the code to match the documentation.

## Supabase

- Make schema changes through local migrations under `supabase/migrations/`; do not modify the remote production schema directly unless an exceptional intervention is explicitly requested.
- Review migration SQL before applying it and, when applicable, run `supabase db push --dry-run` before `supabase db push`.
- Treat production data separately from migrations.
- Keep `supabase/config.toml` synchronized with versionable structural configuration.
- If remote state and local migrations differ, report the discrepancy before changing either one.

## Validation

After code changes, when applicable run:

```bash
npm test
npm run lint
npm run build
```

Do not consider a task finished if any command fails because of the changes made.

## Scope

Before editing:

1. inspect the affected files;
2. identify the smallest reasonable change;
3. avoid modifying unrelated files.

For significant architectural changes, explain the proposed approach before implementing it.
