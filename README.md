# Mircomania

Mircomania is a production portfolio website for presenting web development and automation services, featured projects, professional experience, and contact options. It is built with the Next.js App Router, React, TypeScript, CSS Modules, and Supabase.

## Current features

- Spanish-language public site with services, Supabase-backed featured projects, a public CV, contact, and privacy pages.
- Server-side project loading with hourly revalidation, validated presentation DTOs, and an isolated error state when the project query fails.
- Contact form with shared client/server validation, a honeypot, UTM attribution, a 20-second client timeout, and the `send_form` Google Tag Manager event.
- Hardened `POST /api/contact` flow with a real 10,000-byte body limit and a persistent Supabase rate limit of five requests per hashed identity in a fixed ten-minute window.
- Per-page metadata, Open Graph and Twitter images, `robots.txt`, `sitemap.xml`, and a custom not-found page.
- Responsive keyboard-accessible navigation and interactions, route focus management, reduced-motion handling, and canvas-based visual effects.

## Technology stack

Versions are resolved from `package-lock.json`.

| Area | Technology | Version |
| --- | --- | --- |
| Framework | Next.js App Router | 16.3.1 |
| UI | React / React DOM | 19.2.4 |
| Language | TypeScript | 5.9.3 |
| Data and Storage | `@supabase/supabase-js` | 2.110.7 |
| Analytics | `@next/third-parties` | 16.3.0 |
| Linting | ESLint / `eslint-config-next` | 9.39.4 / 16.3.1 |
| Testing | Vitest | 4.1.11 |

Styling uses global CSS and CSS Modules. Supabase provides PostgreSQL persistence, RPC-based rate limiting, and the public `project-media` Storage bucket.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Home, including `#servicios`, `#proyectos`, and `#cv` |
| `/contacto` | Contact form |
| `/politica-privacidad` | Privacy policy |
| `POST /api/contact` | Validates, rate-limits, and stores contact messages |

## Requirements

- Node.js >= 22.0.0 and npm.
- Access to a Supabase project with the versioned schema and Storage configuration when using data-backed features.
- Supabase CLI only when working on local database state or migrations.

## Local setup

1. Install the locked dependencies:

   ```bash
   npm ci
   ```

2. Create `.env.local`:

   ```dotenv
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
   SUPABASE_SECRET_KEY=
   RATE_LIMIT_SECRET=
   NEXT_PUBLIC_GTM_ID=
   ```

   `SUPABASE_SECRET_KEY` and `RATE_LIMIT_SECRET` are private server credentials and must never be exposed to client code. `RATE_LIMIT_SECRET` is used to HMAC-hash contact identities before the rate-limit RPC receives them.

3. Start the development server:

   ```bash
   npm run dev
   ```

The application is then available at `http://localhost:3000`.

### Environment variables

| Variable | Current use |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL used by both server-side clients |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Publishable key used by the server-only project reader |
| `SUPABASE_SECRET_KEY` | Secret key used by server-only contact persistence and rate limiting |
| `RATE_LIMIT_SECRET` | Private HMAC key used to pseudonymize contact identities |
| `NEXT_PUBLIC_GTM_ID` | Google Tag Manager container ID rendered by the root layout |
| `NODE_ENV` | Runtime mode managed by Next.js; production enables the strict contact-identity path |
| `VERCEL` | Optional build-context signal; normally supplied by Vercel rather than configured locally |

## Commands

| Command | Action |
| --- | --- |
| `npm run dev` | Starts the Next.js development server |
| `npm run build` | Creates the production build |
| `npm run start` | Runs the configured `next start` production command |
| `npm run lint` | Runs ESLint |
| `npm test` | Runs the Vitest suite once |
| `npm run test:watch` | Runs Vitest in watch mode |

## Testing

Vitest runs TypeScript tests in a Node environment using `vitest.config.mts`. The current suites cover contact validation, bounded JSON-body reading, client identity extraction, HMAC generation, the Supabase rate-limit adapter, and the `/api/contact` HTTP contract. UI, responsive, and animation behavior still require manual verification.

## Supabase workflow

- `supabase/migrations/20260820001640_initial_remote_schema.sql` is the versioned baseline for the current public schema.
- `supabase/migrations/20260821002738_add_contact_rate_limit.sql` adds the private persistent rate-limit table and its restricted RPC.
- Future structural database changes must be added under `supabase/migrations/`, reviewed as SQL, and checked with `supabase db push --dry-run` when applicable before `supabase db push`.
- `supabase/config.toml` versions local structural configuration, including the public `project-media` bucket, its 5 MiB limit, and allowed media types.
- Migrations and configuration describe structure; production rows and stored media files are not part of this repository.

See [Database](docs/database.md) for tables, policies, constraints, credentials boundaries, and the full maintenance workflow.

## Project structure

```text
public/                  Public CV document
src/
├── app/                 App Router pages, metadata files, and Route Handlers
├── assets/              SVG icons exposed as React components
├── components/          Shared shell, page sections, forms, and visuals
├── constants/           Routes and external links
├── hooks/               Shared client hooks
├── lib/supabase/        Server-only Supabase clients and helpers
├── services/            Project reads and contact operations
├── styles/              Global styles and design tokens
├── types/               Shared TypeScript models
└── utils/               Navigation, metadata, analytics, and HTTP utilities
supabase/
├── migrations/          Versioned database schema history
└── config.toml          Versioned local and Storage configuration
tests/                    Test-only support modules
```

## Production build

`next.config.ts` selects output according to the deployment environment:

- when `VERCEL` is present, Next.js uses its default output;
- otherwise, the build uses `output: 'standalone'`.

Standalone deployments must package the generated standalone server with the required public and static assets. This conditional output does not make Vercel or any other hosting provider a project requirement.

## Technical documentation

- [Architecture](docs/architecture.md)
- [Technology stack](docs/stack.md)
- [Components and modules](docs/components.md)
- [Database and Supabase](docs/database.md)
- [Coding style](docs/coding-style.md)
- [Design system](docs/design-system.md)
- [SEO and accessibility](docs/seo-accessibility.md)
