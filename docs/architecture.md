# Arquitectura

Este documento describe la estructura observable del repositorio. Las rutas usan Next.js App Router; los componentes son Server Components salvo cuando un archivo declara `'use client'`.

## Estructura principal

```text
public/
└── documents/                  # CV público en PDF

supabase/
├── migrations/                 # Baseline y cambios estructurales de la base de datos
└── config.toml                 # Configuración local y Storage versionable

src/
├── app/
│   ├── (site)/                 # Route group de páginas públicas
│   │   ├── page.tsx            # /
│   │   ├── contacto/page.tsx   # /contacto
│   │   └── politica-privacidad/page.tsx
│   ├── api/contact/route.ts    # POST /api/contact
│   ├── layout.tsx              # Layout raíz, fuentes, Navbar, Footer y GTM
│   ├── not-found.tsx
│   ├── robots.ts
│   ├── sitemap.ts
│   └── globals.css
├── assets/icons/               # Iconos SVG como componentes React
├── components/
│   ├── common/                 # Navbar y Footer
│   ├── exports/                # Secciones de página y formulario
│   └── visuals/                # Planeta de partículas
├── constants/routes.ts         # URL del sitio, rutas, anclas y enlaces externos
├── hooks/useMediaQuery.tsx
├── lib/supabase/               # Clientes Supabase y utilidades server-only
├── services/
│   ├── contacts/               # Envío, rate limit e inserción en Supabase
│   └── projects/               # Consulta y normalización para presentación
├── styles/                     # Estilos globales importados por globals.css
├── types/                      # Tipos compartidos de contacto, navegación y proyectos
└── utils/                      # Links, metadata, foco, UTM y seguridad HTTP

tests/server-only.ts              # Sustituto vacío de server-only para Vitest
vitest.config.mts                 # Tests TypeScript en entorno Node
```

El detalle de componentes y archivos auxiliares está en [components.md](components.md).

## Composición de la aplicación

`src/app/layout.tsx` define `lang="es"`, carga Montserrat, Inter y Space Grotesk mediante `next/font`, monta `RouteFocusManager`, `Navbar` y `Footer` alrededor de todas las páginas e incorpora Google Tag Manager.

Las tres páginas públicas están dentro de `(site)`, un grupo que organiza archivos sin añadir un segmento a la URL. Cada página define sus metadatos con `createMetadata` y renderiza el fondo estrellado junto con sus secciones.

La página de inicio es asíncrona, consulta los proyectos destacados antes de renderizar y exporta `revalidate = 3600`.

## Límites servidor/cliente

### Servidor

- Las páginas y las secciones sin `'use client'` se renderizan como Server Components.
- `getFeaturedProjects` consulta Supabase, valida cada fila y entrega a la UI un DTO preparado para renderizar.
- El cliente de lectura de Supabase y la resolución de URLs de Storage están protegidos con `server-only`.
- `POST /api/contact` valida identidad, rate limit, body y payload antes de delegar la escritura a `createContact`.
- `src/lib/supabase/admin.ts` y `createContact.ts` importan `server-only`; la clave `SUPABASE_SECRET_KEY` queda en ese límite.

### Cliente

Se usa `'use client'` únicamente en piezas con estado o APIs del navegador: navegación responsive, menú móvil, formulario, constelación, mazo móvil de proyectos, `SmartLink`, `RouteFocusManager` y planeta de partículas.

## Flujos de datos

### Proyectos destacados

```text
src/app/(site)/page.tsx
  → getFeaturedProjects()
  → cliente Supabase server-only con publishable key
  → projects + portada filtrada por is_cover
  → validación y resolución de URL de Storage
  → FeaturedProjectCard
  → Home3
  → ProjectCard / MobileProjectsDeck
```

La consulta filtra proyectos destacados y publicados, limita la relación a la portada y ordena por `featured_order`. El servicio omite con un warning de servidor las filas que no pueden convertirse en una tarjeta segura. Si la consulta devuelve cero proyectos renderizables, la sección no se monta; si Supabase falla, la home conserva el resto del contenido y muestra un estado de error local.

### Formulario de contacto

```text
ContactForm
  → useContactForm
  → validación en cliente
  → submitContact (timeout local de 20 s)
  → POST /api/contact
  → Content-Type y Content-Length
  → identidad → HMAC-SHA256 → RPC de rate limit
  → lectura por stream (máximo 10 000 bytes) → JSON
  → objeto plano → honeypot → validación en servidor → referer same-origin
  → createContact
  → contact_messages mediante el cliente admin de Supabase
```

En producción la identidad solo acepta una IP válida del header de Passenger. Antes de llamar a Supabase se transforma mediante HMAC con `RATE_LIMIT_SECRET`, de modo que la RPC recibe un hash y no la IP original. La política persistente permite cinco solicitudes por identidad en una ventana fija de diez minutos y falla cerrado si no puede establecer identidad, hash o estado del rate limit.

Los parámetros `utm_source`, `utm_medium` y `utm_campaign` se leen de la URL, se conservan hasta 15 días en `localStorage` y se envían con el formulario; todos los accesos a Storage toleran fallos. `useContactForm` distingue timeout, error de red y error inesperado sin afirmar que el mensaje no llegó cuando la entrega es incierta. Tras un envío confirmado se agrega `send_form` a `window.dataLayer`.

## Navegación y foco

`SmartLink` gestiona el scroll y el foco de anclas en la ruta actual, respetando `prefers-reduced-motion`. Tras un cambio de pathname, `RouteFocusManager` mueve el foco programático al `main`. El menú móvil y el mazo de proyectos mantienen su lógica de teclado y foco dentro de sus hooks; el detalle operativo está en [seo-accessibility.md](seo-accessibility.md).

## Testing

Vitest ejecuta en entorno Node suites colocadas junto al código probado. La validación de contacto, lectura limitada del body, identidad, HMAC y adaptador de rate limit tienen tests unitarios; `/api/contact` tiene tests de integración con `Request`/`Response` reales y solo las fronteras de Supabase mockeadas. Esto no sustituye el QA visual, responsive o de interacción.

## Estilos y assets

`src/app/globals.css` importa ocho hojas globales para reset, tokens, tipografías, navegación, fondo y utilidades. Cada área visual mantiene sus estilos locales en archivos `*.module.css`. Los estilos base son móviles y se amplían con media queries.

El único archivo bajo `public` es el CV. Las imágenes de proyecto no se almacenan en el repositorio: se sirven desde Supabase Storage.
