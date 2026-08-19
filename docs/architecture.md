# Arquitectura

Este documento describe la estructura observable del repositorio. Las rutas usan Next.js App Router; los componentes son Server Components salvo cuando un archivo declara `'use client'`.

## Estructura principal

```text
public/
└── documents/                  # CV público en PDF

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
├── lib/supabase/               # Clientes Supabase y URL pública de Storage
├── services/
│   ├── contacts/               # Envío al endpoint e inserción en Supabase
│   └── projects/               # Consulta y selección de portada
├── styles/                     # Estilos globales importados por globals.css
├── types/                      # Tipos compartidos de contacto, navegación y proyectos
└── utils/                      # Links, metadata, UTM, referer y fondo estrellado
```

El detalle de componentes y archivos auxiliares está en [components.md](components.md).

## Composición de la aplicación

`src/app/layout.tsx` define `lang="es"`, carga Montserrat, Inter y Space Grotesk mediante `next/font`, monta `Navbar` y `Footer` alrededor de todas las páginas e incorpora Google Tag Manager.

Las tres páginas públicas están dentro de `(site)`, un grupo que organiza archivos sin añadir un segmento a la URL. Cada página define sus metadatos con `createMetadata` y renderiza el fondo estrellado junto con sus secciones.

La página de inicio es asíncrona, consulta los proyectos destacados antes de renderizar y exporta `revalidate = 3600`.

## Límites servidor/cliente

### Servidor

- Las páginas y las secciones sin `'use client'` se renderizan como Server Components.
- `getFeaturedProjects` consulta Supabase desde la página de inicio.
- `POST /api/contact` valida la solicitud y delega la escritura a `createContact`.
- `src/lib/supabase/admin.ts` y `createContact.ts` importan `server-only`; la clave `SUPABASE_SECRET_KEY` queda en ese límite.

### Cliente

Se usa `'use client'` únicamente en piezas con estado o APIs del navegador: navegación responsive, menú móvil, formulario, constelación, mazo móvil de proyectos, `SmartLink` y planeta de partículas.

## Flujos de datos

### Proyectos destacados

```text
src/app/(site)/page.tsx
  → getFeaturedProjects()
  → cliente Supabase con publishable key
  → projects + project_media
  → Home3
  → ProjectCard
  → getPublicMediaUrl(project-media)
```

La consulta filtra proyectos destacados y publicados, los ordena por `featured_order` y la portada se muestra con `next/image` cuando tiene ancho y alto.

### Formulario de contacto

```text
ContactForm
  → useContactForm
  → validación en cliente
  → POST /api/contact
  → validación en servidor + honeypot + referer same-origin
  → createContact
  → contact_messages mediante el cliente admin de Supabase
```

Los parámetros `utm_source`, `utm_medium` y `utm_campaign` se leen de la URL, se conservan hasta 15 días en `localStorage` y se envían con el formulario. Tras un envío exitoso se agrega el evento `send_form` a `window.dataLayer`.

## Estilos y assets

`src/app/globals.css` importa ocho hojas globales para reset, tokens, tipografías, navegación, fondo y utilidades. Cada área visual mantiene sus estilos locales en archivos `*.module.css`. Los estilos base son móviles y se amplían con media queries.

El único archivo bajo `public` es el CV. Las imágenes de proyecto no se almacenan en el repositorio: se sirven desde Supabase Storage.
