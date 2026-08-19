# Persistencia en Supabase

Este documento refleja solo las tablas, columnas y operaciones visibles en el código. El repositorio no contiene migraciones ni una definición completa del esquema.

## Clientes

| Cliente | Variables | Uso observado |
| --- | --- | --- |
| `supabase` | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Lectura de proyectos y resolución de URLs públicas de Storage. |
| `supabaseAdmin` | `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SECRET_KEY` | Inserción de mensajes; módulo protegido con `server-only`, sin persistencia de sesión ni renovación de token. |

## Tablas utilizadas

### `projects`

`getFeaturedProjects` selecciona:

- `id`
- `slug`
- `title`
- `summary`
- `project_year`
- `project_type`
- `stack`
- `demo_url`
- `repository_url`
- relación embebida `project_media`

La consulta aplica `featured = true`, `status = 'published'` y orden ascendente por `featured_order`. Por tanto, `featured`, `status` y `featured_order` también forman parte de la operación aunque no se devuelvan.

Los tipos de proyecto contemplados por la UI son `corporate`, `full_stack`, `saas`, `automation`, `ecommerce` y `mobile_app`.

### `project_media`

La relación embebida devuelve:

- `storage_path`
- `alt_text`
- `width`
- `height`
- `is_cover`

La UI usa el primer registro con `is_cover = true`. Si la portada no tiene `width` o `height`, `ProjectCard` no renderiza el proyecto.

### `contact_messages`

`createContact` inserta:

- `name`
- `email`
- `contact_type`
- `message`
- `status` con valor `new`
- `source` con valor `website`
- `path`
- `utm_source`
- `utm_medium`
- `utm_campaign`
- `privacy_accepted_at` con la fecha ISO del envío

La escritura solo ocurre después de validar el payload en `POST /api/contact`. El endpoint acepta JSON, limita solicitudes declaradas mediante `Content-Length` a 10 000 bytes, usa un campo honeypot y solo conserva el path de un `Referer` del mismo host.

## Storage

El código usa el bucket `project-media` y llama `getPublicUrl`, por lo que espera que las portadas sean públicamente accesibles. `next.config.ts` permite imágenes HTTPS desde:

```text
nsckplnrhhbsjfklxzis.supabase.co/storage/v1/object/public/project-media/**
```

## Alcance no verificable desde el repositorio

No hay evidencia local suficiente para documentar columnas adicionales, claves foráneas concretas, índices, triggers, políticas de Row Level Security ni permisos configurados en Supabase. Esos elementos deben contrastarse con el proyecto remoto o incorporarse como migraciones antes de tratarlos como parte garantizada del esquema.
