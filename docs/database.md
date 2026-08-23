# Persistencia en Supabase

El estado estructural versionado se compone del baseline `supabase/migrations/20260820001640_initial_remote_schema.sql`, la migration `20260821002738_add_contact_rate_limit.sql` y `supabase/config.toml`. Este documento resume lo necesario para mantenerlos; no sustituye al SQL.

## Clientes

| Cliente | Credenciales | Uso actual |
| --- | --- | --- |
| `supabase` | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Lee proyectos publicados y genera URLs públicas de `project-media` desde módulos `server-only`. |
| `supabaseAdmin` | `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SECRET_KEY` | Inserta mensajes de contacto desde código protegido con `server-only`; no persiste sesión ni renueva tokens. |

La clave secreta solo se importa desde servicios de servidor. Tanto el cliente de lectura como el de escritura permanecen fuera del árbol cliente y las consultas de presentación permanecen fuera de los componentes.

## Esquema `public`

### `projects`

Contiene la información de cada proyecto, incluyendo contenido, tipo, stack, enlaces, estado y orden destacado. Sus restricciones principales son:

- `id` es la clave primaria UUID y `slug` es único y usa formato kebab-case;
- `title` admite entre 2 y 120 caracteres y `summary` entre 10 y 500;
- `project_year`, si existe, debe estar entre 2000 y 2100;
- `project_type` admite `corporate`, `full_stack`, `saas`, `automation`, `ecommerce` o `mobile_app`;
- `status` admite `draft`, `published` o `archived`;
- un proyecto destacado requiere `featured_order` positivo; un proyecto no destacado debe dejarlo en `NULL`.

Los índices relevantes cubren búsquedas por estado, la lectura ordenada de proyectos publicados destacados y la unicidad de `featured_order` entre proyectos destacados.

### `project_media`

Cada registro pertenece a `projects` mediante `project_id`; la foreign key elimina sus medios en cascada al eliminar el proyecto. Almacena el tipo (`image` o `video`), rutas de Storage, texto alternativo, dimensiones, orden y condición de portada.

- `(project_id, sort_order)` es único y `sort_order` no puede ser negativo;
- solo puede existir una portada por proyecto;
- las dimensiones presentes deben ser positivas;
- las imágenes requieren `alt_text` no vacío.

La aplicación filtra la relación por `is_cover = true` al consultar los proyectos destacados. En servidor valida que la portada sea una imagen con ruta, texto alternativo y dimensiones utilizables, resuelve su URL pública y entrega a la UI un DTO sin detalles de persistencia.

### `contact_messages`

Almacena `name`, `email`, `contact_type`, `message`, consentimiento, estado, origen, path, UTMs y timestamps.

- `name`: entre 2 y 100 caracteres;
- `email`: formato validado y entre 5 y 254 caracteres después de `trim`;
- `message`: entre 10 y 3000 caracteres después de `trim`;
- `contact_type`: `project`, `job`, `collaboration` o `general`;
- `status`: `new`, `read`, `replied`, `closed` o `spam`;
- `utm_source` y `utm_medium`: hasta 150 caracteres; `utm_campaign`: hasta 200.

El índice `(status, created_at DESC)` facilita la gestión de la bandeja. Los límites de aplicación y PostgreSQL están alineados: correo hasta 254 caracteres y mensaje hasta 3000, siempre después de `trim`.

## Rate limit en el schema `private`

La segunda migration crea `private.contact_rate_limits`, fuera de los schemas expuestos por la Data API. Su clave primaria es `identifier_hash`, un HMAC-SHA256 hexadecimal de 64 caracteres; también conserva el inicio de ventana, contador y fecha de actualización. El contador debe ser positivo.

`public.check_contact_rate_limit(text)` es una función `SECURITY DEFINER` con `search_path` vacío que realiza la actualización atómica de la tabla. Implementa una ventana fija de diez minutos y permite como máximo cinco solicitudes por identificador; devuelve `allowed`, `remaining` y `retry_after_seconds`.

La aplicación no accede directamente a `private.contact_rate_limits`: la tabla revoca permisos a `PUBLIC`, `anon`, `authenticated` y `service_role`. La función revoca ejecución pública y para `anon`/`authenticated`, y concede `EXECUTE` solo a `service_role`.

## RLS, policies y permisos

RLS está habilitado en las tres tablas:

- `projects`: `anon` y `authenticated` solo pueden seleccionar registros con `status = 'published'`;
- `project_media`: esos roles solo pueden seleccionar medios cuyo proyecto esté publicado;
- `contact_messages`: no tiene policies públicas. La inserción de la aplicación usa el cliente secreto del servidor con permisos de `service_role`.

Los roles públicos no tienen permisos de escritura sobre estas tablas. El baseline conserva los grants privilegiados necesarios para `postgres` y `service_role`.

## Funciones y triggers

`public.set_updated_at()` actualiza `updated_at` antes de cada `UPDATE` en las tres tablas.

`public.rls_auto_enable()` es una función `SECURITY DEFINER` usada por el event trigger `ensure_rls` para habilitar RLS al crear tablas en `public`. Su ejecución está revocada para `PUBLIC` y no está concedida a `anon` ni `authenticated`; el baseline solo la concede a `postgres`.

La función de rate limit y sus permisos se describen en la sección anterior. `private.contact_rate_limits` no depende de acceso público ni de una policy RLS: se aísla mediante schema privado, revocaciones y la RPC autorizada.

## Escritura del formulario

`POST /api/contact` procesa la solicitud en este orden:

1. exige `application/json` y rechaza tempranamente un `Content-Length` superior a 10 000 bytes;
2. obtiene una IP válida del header confiable `!~Passenger-Client-Address` en producción; si no existe, falla cerrado;
3. genera un HMAC-SHA256 con `RATE_LIMIT_SECRET` y consulta la RPC de rate limit, sin enviar la IP original a Supabase;
4. lee el body mediante stream, suma bytes reales y solo decodifica UTF-8 y parsea JSON si no supera 10 000 bytes;
5. exige un objeto plano, aplica honeypot y vuelve a validar los campos;
6. conserva el path del `Referer` solo si pertenece al mismo host y llama a `createContact`.

`createContact` inserta con `status = 'new'`, `source = 'website'` y la fecha de aceptación de privacidad. El navegador nunca recibe `SUPABASE_SECRET_KEY` ni la identidad utilizada por el rate limit.

## Storage

`supabase/config.toml` versiona el bucket `project-media` con:

- acceso público de lectura;
- límite por archivo de `5MiB`;
- MIME types permitidos: `image/avif`, `image/webp`, `image/jpeg`, `video/webm` y `video/mp4`.

Que el bucket sea público no concede escritura pública: el SQL versionado no define policies públicas de escritura en `storage.objects`. Los objetos reales almacenados en el bucket no forman parte del repositorio.

## Versionado y mantenimiento

- `supabase/migrations/` contiene el baseline del schema `public` y la migration que agrega el rate limit privado; debe recibir las futuras modificaciones SQL: schemas, tablas, constraints, índices, RLS, policies, funciones, triggers y grants.
- `supabase/config.toml` describe configuración estructural versionable de Supabase, incluida la del bucket; debe mantenerse sincronizado con el estado estructural esperado.
- Las filas de producción y los objetos reales de Storage son datos remotos, no migrations ni configuración versionada.
- El vínculo de Supabase CLI con el proyecto remoto `mircomania-web` se conserva como estado local ignorado por Git.

Para un cambio estructural, crear una migration local, revisar su SQL y validarla antes de aplicarla. Cuando corresponda, ejecutar `supabase db push --dry-run` antes de `supabase db push`. No cambiar directamente el schema de producción salvo una intervención excepcional explícita; si el remoto y las migrations divergen, detenerse y reportar la diferencia antes de modificar cualquiera de los dos.
