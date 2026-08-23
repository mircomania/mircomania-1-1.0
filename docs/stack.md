# Stack tecnológico

Versiones resueltas por `package-lock.json`:

| Área | Tecnología | Versión |
| --- | --- | --- |
| Framework | Next.js (App Router) | 16.3.1 |
| UI | React / React DOM | 19.2.4 |
| Lenguaje | TypeScript | 5.9.3 |
| Datos y Storage | `@supabase/supabase-js` | 2.110.7 |
| Analytics | `@next/third-parties` | 16.3.0 |
| Lint | ESLint / `eslint-config-next` | 9.39.4 / 16.3.1 |
| Tests | Vitest | 4.1.11 |

## Implementación

- Server Components y Route Handlers de Next.js; Client Components para estado, eventos y APIs del navegador.
- CSS global y CSS Modules, sin preprocesador ni framework de componentes.
- Fuentes Montserrat, Inter y Space Grotesk mediante `next/font/google`.
- Supabase para consultar `projects`/`project_media`, insertar en `contact_messages`, aplicar el rate limit mediante RPC y resolver URLs del bucket `project-media`.
- `next/image` para portadas remotas de proyectos.
- Canvas 2D, Web Animations API, `IntersectionObserver`, `matchMedia` y `localStorage` para las interacciones visuales y de formulario.
- Google Tag Manager mediante `GoogleTagManager` y `window.dataLayer`.
- Metadata API, archivos de metadata, `robots.ts` y `sitemap.ts` para SEO.

## Build

Los scripts usan los CLI de Next.js, ESLint y Vitest. `next.config.ts` activa `output: 'standalone'` cuando `VERCEL` no está definida y deja el output predeterminado de Next.js bajo Vercel. El repositorio no fija una plataforma de hosting ni una versión de Node.js.

Vitest usa `vitest.config.mts`, entorno Node, alias `@` hacia `src` y un sustituto vacío de `server-only` exclusivo para tests. La suite cubre lógica crítica y el contrato HTTP de `/api/contact`; no representa cobertura total de la UI.
