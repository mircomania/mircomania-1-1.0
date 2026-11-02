# Mircomania

Mircomania is a professional portfolio website for presenting web development, automation, and digital advertising services, featured projects, professional experience, and contact options. It is built with the Next.js App Router, React, TypeScript, CSS Modules, and Supabase.

## Current features

- Spanish-language public site with home service sections, Supabase-backed featured projects, public CVs, contact, and privacy pages.
- Digital advertising landing at `/ads`, linked from the home service constellation, and the historical `/ads/mejoravit` case study. Published advertising cards come from Supabase `ads_cases`; only registered study routes receive links.
- Server-side project loading with hourly revalidation, validated presentation DTOs, and an isolated error state when the project query fails.
- Featured projects support the `digital_ads` type and optional `inter_nav` internal study links, independently of external demos and repositories.
- Contact form with seven enquiry types (`project`, `automation`, `advertising`, `analytics`, `job`, `collaboration`, `general`), shared client/server validation, a honeypot, and a 20-second client timeout. `/contacto?servicio=marketing` preselects `advertising`.
- Global UTM capture on entry and client navigation, persisted for 15 days and read again on submission. New campaigns replace the previous set; reads without campaign parameters do not renew expiry.
- GTM integration with `data-link`/`data-cta` hooks for externally configured `click_link`/`click_cta` events and an explicit `send_form` push after a confirmed submission. Tags and triggers are managed outside this repository.
- Hardened `POST /api/contact` flow with a real 10,000-byte body limit and a persistent Supabase rate limit of five requests per hashed identity in a fixed ten-minute window.
- Daily Supabase Cron cleanup of contacts older than 24 months since their last recorded interaction and rate-limit records unchanged for over 24 hours. Later contact interactions are recorded manually through a restricted SQL function; email/Make copies are not automatically deleted.
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
| `/ads` | Digital advertising services and published case cards; hourly revalidation |
| `/ads/mejoravit` | Historical Google Ads case study and monthly CPA chart |
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
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Publishable key used by the server-only project and advertising catalog readers |
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
| `python3 -m unittest discover -s scripts -p 'test_*.py'` | Tests the specialized Mejoravit XML importer |
| `python3 scripts/import_mejoravit_history.py /path/to/report.xml --check` | Compares the XML-derived snapshot with the versioned JSON without writing |

## Testing

Vitest runs TypeScript tests in a Node environment using `vitest.config.mts`. Suites cover contact/security logic and the `/api/contact` HTTP contract, UTM persistence, advertising catalog normalization and rendering, carousel indexing, the Mejoravit snapshot, and server-rendered SVG geometry/tooltips/table. Python tests cover importer calculations and input validation. Browser, responsive, and assistive-technology checks remain separate from these suites; see the [Mejoravit maintenance guide](docs/mejoravit-ads.md).

## Supabase workflow

- `supabase/migrations/20260820001640_initial_remote_schema.sql` is the versioned baseline for the current public schema.
- `supabase/migrations/20260821002738_add_contact_rate_limit.sql` adds the private persistent rate-limit table and its restricted RPC.
- `supabase/migrations/20260909214742_add_data_retention.sql` adds `last_interaction_at`, private cleanup functions, indexes, and the daily rate-limit cleanup job.
- `supabase/migrations/20260911033436_add_touch_contact_interaction.sql` adds manual interaction tracking through `private.touch_contact_interaction(uuid)`, restricted to `postgres`.
- `supabase/migrations/20260911040426_schedule_expired_contact_cleanup.sql` schedules expired-contact cleanup daily at 03:30 UTC; rate-limit cleanup runs at 03:15 UTC.
- `supabase/migrations/20261029172143_create_ads_cases_catalog.sql` creates the advertising catalog, public published-row read policy, and a draft Mejoravit record.
- `supabase/migrations/20261029173130_adapt_ads_cases_for_data_cards.sql` makes logos optional and adds secondary metrics and a reference period.
- `supabase/migrations/20261101173204_allow_digital_ads_project_type.sql` adds the `digital_ads` project type.
- `supabase/migrations/20261101175908_add_projects_inter_nav.sql` adds constrained nullable internal project links.
- `supabase/migrations/20261101195955_expand_contact_message_types.sql` expands contact types to seven values.
- Future structural database changes must be added under `supabase/migrations/`, reviewed as SQL, and checked with `supabase db push --dry-run` when applicable before `supabase db push`.
- `supabase/config.toml` versions local structural configuration, including the public `project-media` bucket, its 5 MiB limit, and allowed media types.
- Migrations and configuration describe structure; production rows and stored media files are not part of this repository.

See [Database](docs/database.md) for tables, policies, constraints, credentials boundaries, and the full maintenance workflow.

## Project structure

```text
public/                  Public CV documents
scripts/                 Specialized Mejoravit XML importer and Python tests
src/
├── app/                 App Router pages, metadata files, and Route Handlers
├── assets/              SVG icons exposed as React components
├── components/          Shared shell, page sections, forms, and visuals
├── constants/           Routes and external links
├── data/ads/            Versioned Mejoravit snapshot and presentation helpers
├── hooks/               Shared client hooks
├── lib/supabase/        Server-only Supabase clients and helpers
├── services/            Project/catalog reads and contact operations
├── styles/              Global styles and design tokens
├── types/               Shared TypeScript models
└── utils/               Navigation, metadata, analytics, and HTTP utilities
supabase/
├── migrations/          Versioned database schema history
└── config.toml          Versioned local and Storage configuration
tests/                    Test-only support modules
```

## Production build

The advertising pages, schema changes, components, and global attribution are implemented and versioned in GitHub. Automated checks and local browser validation were reported during development; they do not establish deployment status. Staging approval and publication of this update to production remain pending. `/ads` is an individual service landing; no general `/servicios` page is implemented (`/#servicios` is a home anchor).

The privacy copy already describes global UTM capture. Legal and technical review of consent and analytics remains a separate future task.

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
- [Mejoravit Ads maintenance](docs/mejoravit-ads.md)
