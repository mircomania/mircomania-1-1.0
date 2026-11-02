# Arquitectura

Este documento describe la estructura observable del repositorio. Las rutas usan Next.js App Router; los componentes son Server Components salvo cuando un archivo declara `'use client'`.

## Estructura principal

```text
public/
└── documents/                  # CV públicos en español e inglés

scripts/                        # Importador XML Mejoravit y tests Python

supabase/
├── migrations/                 # Baseline y cambios estructurales de la base de datos
└── config.toml                 # Configuración local y Storage versionable

src/
├── app/
│   ├── (site)/                 # Route group de páginas públicas
│   │   ├── page.tsx            # /
│   │   ├── contacto/page.tsx   # /contacto
│   │   ├── ads/page.tsx         # /ads
│   │   ├── ads/mejoravit/page.tsx # /ads/mejoravit
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
├── data/ads/                    # Snapshot Mejoravit y helpers de presentación
├── hooks/useMediaQuery.tsx
├── lib/supabase/               # Clientes Supabase y utilidades server-only
├── services/
│   ├── contacts/               # Envío, rate limit e inserción en Supabase
│   ├── ads/                     # Catálogo publicado de casos publicitarios
│   └── projects/               # Consulta y normalización para presentación
├── styles/                     # Estilos globales importados por globals.css
├── types/                      # Tipos compartidos de contacto, navegación y proyectos
└── utils/                      # Links, metadata, foco, UTM y seguridad HTTP

tests/server-only.ts              # Sustituto vacío de server-only para Vitest
vitest.config.mts                 # Tests TypeScript en entorno Node
```

El detalle de componentes y archivos auxiliares está en [components.md](components.md).

## Composición de la aplicación

`src/app/layout.tsx` define `lang="es"`, carga Montserrat, Inter y Space Grotesk mediante `next/font`, monta `RouteFocusManager`, `Navbar` y `Footer` alrededor de todas las páginas e incorpora Google Tag Manager. También monta `UtmAttributionTracker`, una pieza cliente sin interfaz dentro de `Suspense` con fallback nulo; el layout permanece como Server Component.

Las cinco páginas públicas están dentro de `(site)`: `/`, `/contacto`, `/ads`, `/ads/mejoravit` y `/politica-privacidad`. El grupo organiza archivos sin añadir un segmento a la URL. Cada página define sus metadatos con `createMetadata` y renderiza el fondo estrellado junto con sus secciones. `/ads` es una landing individual de Publicidad Digital; `/#servicios` sigue siendo un ancla de la home, sin página general `/servicios`.

La página de inicio es asíncrona, consulta los proyectos destacados antes de renderizar y exporta `revalidate = 3600`. `/ads` consulta el catálogo publicitario y declara el mismo intervalo. `/ads/mejoravit` usa un snapshot local y no declara revalidación propia; `/contacto` resuelve `searchParams` para la preselección del formulario.

## Límites servidor/cliente

### Servidor

- Las páginas y las secciones sin `'use client'` se renderizan como Server Components.
- `getFeaturedProjects` y `getPublishedAdsCases` consultan Supabase, validan cada fila y entregan a la UI DTOs preparados para renderizar.
- El cliente de lectura de Supabase y la resolución de URLs de Storage están protegidos con `server-only`.
- `POST /api/contact` valida identidad, rate limit, body y payload antes de delegar la escritura a `createContact`.
- `src/lib/supabase/admin.ts` y `createContact.ts` importan `server-only`; la clave `SUPABASE_SECRET_KEY` queda en ese límite.

### Cliente

Se usa `'use client'` en piezas con estado o APIs del navegador: navegación responsive, menú móvil, formulario, constelación, mazo móvil de proyectos, carrusel publicitario, `SmartLink`, `RouteFocusManager`, tracker UTM y planeta de partículas. El gráfico `MonthlyCpaChart` se renderiza en servidor como SVG y tabla.

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

`project_type = digital_ads` clasifica trabajos publicitarios. El DTO separa `demo_url` → `demoUrl` y `repository_url` → `repositoryUrl`, enlaces externos, de `inter_nav` → `interNav`, una ruta interna opcional validada. `ProjectCard` usa `SmartLink` para el estudio y conserva las acciones externas independientes. La decisión editorial es mantener el proyecto web Mejoravit original y presentar el trabajo publicitario como `mejoravit-ads`; esas filas y sus portadas son datos remotos, no se crean mediante estas nuevas migrations.

### Catálogo publicitario

```text
Supabase ads_cases (status = published, orden featured_order)
  → getPublishedAdsCases() server-only
  → normalización a PublishedAdsCase
  → /ads → AdsCases → MobileAdsCasesCarousel → AdsCaseCard
```

El servicio recorta y valida textos, slug, orden, pares de métricas, período y logo opcional; resuelve el logo desde `project-media` y omite filas inválidas con un warning. La página distingue catálogo vacío de fallo de carga. Las tarjetas admiten hasta dos métricas, período y ausencia de logo.

El enlace de estudio procede de un registro explícito `studyRoutes`, actualmente `mejoravit` → `/ads/mejoravit`. No se construye una ruta para cualquier slug del catálogo: un caso no registrado muestra “Estudio completo próximamente”. `ads_cases` aporta tarjetas comerciales; `projects` y `project_media` alimentan el portafolio y conservan sus propias responsabilidades.

### Histórico Mejoravit

```text
XML exportado de Google Ads
  → scripts/import_mejoravit_history.py
  → src/data/ads/mejoravit-history.json versionado
  → src/data/ads/mejoravit.ts
  → /ads/mejoravit → MonthlyCpaChart (SVG + tabla)
```

El XML genera o verifica un snapshot; no existe consulta de Google Ads en tiempo real. El importador calcula CPA agregado con costo total / conversiones totales y no publica inversión. El snapshot cubre 17 meses, junio de 2025 a octubre de 2026 parcial, e incluye procedencia y hash SHA-256. La comparación de canales se limita a Mi Cuenta — Mejoravit 4; la clasificación y el contexto de conversiones fueron confirmados manualmente. El reporte comercial de calidad es una fuente separada. El alcance del importador y el procedimiento de actualización están en [mejoravit-ads.md](mejoravit-ads.md).

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
  → Supabase Database Webhook (INSERT)
  → Make / Watch Events
  → SMTP hola@mircomania.cl
  → mirco@mircomania.cl
```

En producción la identidad solo acepta una IP válida del header de Passenger. Antes de llamar a Supabase se transforma mediante HMAC con `RATE_LIMIT_SECRET`, de modo que la RPC recibe un hash y no la IP original. La política persistente permite cinco solicitudes por identidad en una ventana fija de diez minutos y falla cerrado si no puede establecer identidad, hash o estado del rate limit.

El escenario de Make está activo, procesa cada nuevo contacto inmediatamente y envía la notificación autenticándose por SMTP como `hola@mircomania.cl`. El flujo fue validado desde producción. El forwarder del hosting desde esa casilla hacia `mirco@mircomania.cl` es independiente y solo opera sobre mensajes enviados directamente por personas a `hola@mircomania.cl`.

El formulario admite `project`, `automation`, `advertising`, `analytics`, `job`, `collaboration` y `general`. `/contacto?servicio=marketing` pasa `initialContactType="advertising"` mediante `Contact1` a `ContactForm`; es una preselección de interfaz, sin generar atribución ni eventos adicionales. `useContactForm` distingue timeout, error de red y error inesperado sin afirmar que el mensaje no llegó cuando la entrega es incierta.

### Atribución UTM

```text
Entrada a cualquier ruta / cambio de pathname o búsqueda en Next.js
  → UtmAttributionTracker → getUtmParams()
  → localStorage: mircomania_utm_params
  → useContactForm al enviar → validación y submitContact con el mismo payload
```

Se capturan `utm_source`, `utm_medium` y `utm_campaign` aunque la página no tenga formulario. Cuando la URL aporta al menos un valor no vacío, reemplaza el conjunto anterior y guarda un nuevo timestamp; los parámetros ausentes quedan vacíos, sin mezclar campañas. Sin UTM nuevos se reutilizan los valores almacenados, sin renovar el plazo. Se descartan al leerlos cuando han pasado más de 15 días o son inválidos; no existe un temporizador de borrado. Los accesos a Storage toleran excepciones y las UTM de la URL siguen disponibles aunque no puedan persistirse. `servicio=marketing` no es un UTM.

### Analítica

El layout carga GTM con `NEXT_PUBLIC_GTM_ID`. `SmartLink`, `ButtonLink` y otros controles exponen `data-link` o `data-cta` como puntos de instrumentación para `click_link` y `click_cta`; estos atributos no hacen un `dataLayer.push()` por sí mismos. Las etiquetas, activadores y el envío a GA4 se administran externamente desde GTM, no se definen en este repositorio.

Después de una respuesta exitosa del formulario, `pushContactFormEvent` agrega explícitamente `{ event: 'send_form', form_name: 'contact', contact_type }` a `window.dataLayer`. No incorpora UTM a ese evento ni añade parámetros de campaña a enlaces internos. La atribución guardada en el mensaje y la medición externa de GA4 son flujos distintos.

La política de privacidad 1.3 ya describe almacenamiento UTM desde la entrada y su reemplazo por nuevas campañas. La revisión jurídica y técnica del consentimiento y la analítica queda pendiente; la aceptación del formulario no acredita consentimiento para operaciones anteriores.

### Ciclo de vida de los contactos

Supabase inicializa `last_interaction_at` con `now()` para cada contacto nuevo, aproximadamente igual a `created_at`; los contactos existentes se inicializaron desde `created_at`. El plazo ordinario máximo de retención es de 24 meses desde la última interacción relacionada con la consulta.

Las interacciones posteriores se registran manualmente como `postgres` mediante `private.touch_contact_interaction(uuid)`. La función devuelve la nueva fecha, mantiene `created_at` y deja que el trigger existente actualice `updated_at`; si el contacto no existe, lanza una excepción. No hay sincronización automática con correo, CRM o Make para mantener esa fecha. Sin registro posterior, el plazo se cuenta desde la fecha inicial.

Dos jobs internos de `pg_cron`, versionados en las migrations y ejecutados como `postgres`, aplican la limpieza diaria:

- A las 03:15 UTC, `delete-stale-contact-rate-limits` ejecuta `private.delete_stale_contact_rate_limits()` para eliminar registros técnicos sin actualización durante más de 24 horas. La ventana operativa del rate limit sigue siendo de diez minutos.
- A las 03:30 UTC, `delete-expired-contacts` ejecuta `private.delete_expired_contacts()` para eliminar contactos cuya `last_interaction_at` sea anterior a 24 meses.

Las tres funciones privadas usan `SECURITY INVOKER` y ejecución restringida a `postgres`. La frecuencia diaria permite intencionalmente algunas horas adicionales hasta el siguiente ciclo exitoso. La limpieza afecta a Supabase; las copias de Make/correo se gestionan por separado y no hay un mecanismo automático de excepciones legales de retención. Los permisos, horarios y criterios exactos se detallan en [database.md](database.md).

## Navegación y foco

`SmartLink` gestiona el scroll y el foco de anclas en la ruta actual, respetando `prefers-reduced-motion`. Tras un cambio de pathname, `RouteFocusManager` mueve el foco programático al `main`. El menú móvil y el mazo de proyectos mantienen su lógica de teclado y foco dentro de sus hooks; el detalle operativo está en [seo-accessibility.md](seo-accessibility.md).

## Testing

Vitest ejecuta en entorno Node suites colocadas junto al código probado. La validación de contacto, lectura limitada del body, identidad, HMAC y adaptador de rate limit tienen tests unitarios; `/api/contact` tiene tests de integración con `Request`/`Response` reales y solo las fronteras de Supabase mockeadas. También hay cobertura del catálogo publicitario, cálculo de posiciones del carrusel, persistencia UTM, snapshot y SVG/tabla de Mejoravit. Python prueba el importador por separado. Esto no sustituye el QA visual, responsive o de interacción.

Las páginas, integraciones, esquema y componentes de esta actualización están implementados y versionados en GitHub. Los resultados de pruebas y navegador comunicados durante el desarrollo son validaciones locales; la aprobación de staging y publicación de esta actualización en producción siguen pendientes. La presencia en `main` no demuestra despliegue.

## Estilos y assets

`src/app/globals.css` importa ocho hojas globales para reset, tokens, tipografías, navegación, fondo y utilidades. Cada área visual mantiene sus estilos locales en archivos `*.module.css`. Los estilos base son móviles y se amplían con media queries.

`public/documents` contiene los CV en español e inglés. Las portadas de proyecto y logos del catálogo se sirven desde Supabase Storage; el snapshot numérico de Mejoravit sí se versiona en el repositorio.
