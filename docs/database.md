# Persistencia en Supabase

El estado estructural se define en `supabase/config.toml` y las siguientes migrations bajo `supabase/migrations/`:

- `20260820001640_initial_remote_schema.sql`: baseline del schema público.
- `20260821002738_add_contact_rate_limit.sql`: rate limit privado y RPC.
- `20260909214742_add_data_retention.sql`: última interacción, funciones de limpieza, índices y Cron del rate limit.
- `20260911033436_add_touch_contact_interaction.sql`: registro manual de nuevas interacciones.
- `20260911040426_schedule_expired_contact_cleanup.sql`: Cron de eliminación de contactos vencidos.
- `20261029172143_create_ads_cases_catalog.sql`: crea `ads_cases`, constraints, RLS, índice de orden publicado y registro inicial Mejoravit en borrador.
- `20261029173130_adapt_ads_cases_for_data_cards.sql`: renombra las columnas de imagen a logo, permite publicar sin logo e incorpora segunda métrica y período; actualiza los destacados del borrador Mejoravit.
- `20261101173204_allow_digital_ads_project_type.sql`: amplía `projects.project_type` con `digital_ads`.
- `20261101175908_add_projects_inter_nav.sql`: agrega la ruta interna nullable y su constraint.
- `20261101195955_expand_contact_message_types.sql`: amplía los motivos de contacto a siete valores.

Este documento resume lo necesario para mantenerlos; no sustituye al SQL.

## Clientes

| Cliente         | Credenciales                                                       | Uso actual                                                                                                   |
| --------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| `supabase`      | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Lee proyectos y casos publicitarios publicados; genera URLs públicas de `project-media` desde módulos `server-only`. |
| `supabaseAdmin` | `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SECRET_KEY`                  | Inserta mensajes de contacto desde código protegido con `server-only`; no persiste sesión ni renueva tokens. |

La clave secreta solo se importa desde servicios de servidor. Tanto el cliente de lectura como el de escritura permanecen fuera del árbol cliente y las consultas de presentación permanecen fuera de los componentes.

## Esquema `public`

### `projects`

Contiene la información de cada proyecto, incluyendo contenido, tipo, stack, enlaces, estado y orden destacado. Sus restricciones principales son:

- `id` es la clave primaria UUID y `slug` es único y usa formato kebab-case;
- `title` admite entre 2 y 120 caracteres y `summary` entre 10 y 500;
- `project_year`, si existe, debe estar entre 2000 y 2100;
- `project_type` admite `corporate`, `full_stack`, `saas`, `automation`, `ecommerce`, `mobile_app` o `digital_ads`;
- `status` admite `draft`, `published` o `archived`;
- un proyecto destacado requiere `featured_order` positivo; un proyecto no destacado debe dejarlo en `NULL`.

Los índices relevantes cubren búsquedas por estado, la lectura ordenada de proyectos publicados destacados y la unicidad de `featured_order` entre proyectos destacados.

`inter_nav text NULL` es independiente de `demo_url` y `repository_url`: el primero indica navegación interna y los otros conservan sus usos de demo/repositorio externos. `projects_inter_nav_internal_path_check` exige, si hay valor, longitud entre 2 y 200 y segmentos en minúsculas alfanuméricas separados por guiones y `/`, empezando por `/`. Por ejemplo, `/ads/mejoravit` es válido; no admite URLs absolutas, `//`, query, fragmentos ni barra final. No comprueba que la ruta exista: esa revisión corresponde al mantenimiento de contenido. El servicio vuelve a validar el formato antes de exponer `interNav` al componente.

`digital_ads` clasifica proyectos de publicidad sin reemplazar trabajos web anteriores. La decisión de conservar Mejoravit web y crear un destacado `mejoravit-ads` se registra en [decisions.md](decisions.md); las migrations de tipo y ruta no insertan esas filas ni suben sus portadas.

### `project_media`

Cada registro pertenece a `projects` mediante `project_id`; la foreign key elimina sus medios en cascada al eliminar el proyecto. Almacena el tipo (`image` o `video`), rutas de Storage, texto alternativo, dimensiones, orden y condición de portada.

- `(project_id, sort_order)` es único y `sort_order` no puede ser negativo;
- solo puede existir una portada por proyecto;
- las dimensiones presentes deben ser positivas;
- las imágenes requieren `alt_text` no vacío.

La aplicación filtra la relación por `is_cover = true` al consultar los proyectos destacados. En servidor valida que la portada sea una imagen con ruta, texto alternativo y dimensiones utilizables, resuelve su URL pública y entrega a la UI un DTO sin detalles de persistencia.

### `ads_cases`

Catálogo de tarjetas publicitarias separado del portafolio `projects`. El esquema resultante de ambas migrations es:

| Columnas | Uso y restricciones |
| --- | --- |
| `id`, `slug` | UUID con generación por defecto y clave primaria; slug único en kebab-case. |
| `title`, `summary`, `category` | Texto obligatorio; longitudes tras `btrim`: 2–120, 10–500 y 2–60 respectivamente. |
| `status`, `featured_order` | Estado `draft` (por defecto) o `published`; orden `smallint` nullable, positivo si existe y obligatorio al publicar. Índice único de orden entre filas publicadas. |
| `logo_path`, `logo_alt` | Par opcional, ambos nulos o ambos presentes. Ruta recortada de 5–500 caracteres, sin `/` inicial ni `..`, extensión webp/avif/jpg/jpeg; alternativo de 8–250 tras `btrim`. Un caso publicado puede no tener logo. |
| `featured_metric_label`, `featured_metric_value` | Par opcional completo; etiqueta de 4–120 y valor de 1–40 tras `btrim`. Se almacenan textos de presentación, no métricas calculadas por SQL. |
| `featured_metric_secondary_label`, `featured_metric_secondary_value` | Segundo par opcional con las mismas restricciones. |
| `featured_metric_period` | Período de referencia opcional, 6–120 caracteres tras `btrim`; no valida semánticamente fechas. |
| `created_at`, `updated_at` | `timestamptz NOT NULL DEFAULT now()`; trigger de actualización. |

Los nombres actuales son `logo_path` y `logo_alt`; la adaptación del catálogo renombró las columnas de la primera migration. El logo se resuelve en el bucket existente `project-media`, sin tabla de medios propia ni bucket adicional.

`getPublishedAdsCases()` filtra `published`, ordena por `featured_order` y omite registros no normalizables. El slug no crea automáticamente una página ni un enlace; el registro explícito de rutas del servicio mantiene actualmente solo `mejoravit` → `/ads/mejoravit`.

La creación incluye una fila `mejoravit` en `draft`; la segunda migration incorpora sus métricas destacadas y período mientras siga en borrador. Son datos iniciales concretos versionados en SQL, no una sincronización del catálogo: publicar, mantener filas posteriores y subir logos son operaciones de contenido independientes. Cambiar el JSON histórico no actualiza las tarjetas remotas automáticamente.

### `contact_messages`

Almacena `name`, `email`, `contact_type`, `message`, consentimiento, estado, origen, path, UTMs y timestamps.

- `name`: entre 2 y 100 caracteres;
- `email`: formato validado y entre 5 y 254 caracteres después de `trim`;
- `message`: entre 10 y 3000 caracteres después de `trim`;
- `contact_type`: `project`, `automation`, `advertising`, `analytics`, `job`, `collaboration` o `general`;
- `status`: `new`, `read`, `replied`, `closed` o `spam`;
- `utm_source` y `utm_medium`: hasta 150 caracteres; `utm_campaign`: hasta 200.

El índice `(status, created_at DESC)` facilita la gestión de la bandeja. Los límites de aplicación y PostgreSQL están alineados: correo hasta 254 caracteres y mensaje hasta 3000, siempre después de `trim`.

`last_interaction_at timestamptz NOT NULL DEFAULT now()` determina el inicio del plazo de retención. La migration inicializó las filas existentes con `last_interaction_at = created_at`, preservando `updated_at` durante ese backfill. En contactos nuevos, ambos valores iniciales son aproximadamente iguales. El índice `contact_messages_last_interaction_idx` facilita la búsqueda y eliminación de contactos vencidos.

Cada `INSERT` sobre `public.contact_messages` dispara un Database Webhook hacia Make; los eventos `UPDATE` y `DELETE` no forman parte de esta automatización. El webhook depende de la extensión `pg_net` habilitada y de la integración oficial Database Webhooks de Supabase.

## Rate limit en el schema `private`

La segunda migration crea `private.contact_rate_limits`, fuera de los schemas expuestos por la Data API. Su clave primaria es `identifier_hash`, un HMAC-SHA256 hexadecimal de 64 caracteres; también conserva el inicio de ventana, contador y fecha de actualización. El contador debe ser positivo.

`public.check_contact_rate_limit(text)` es una función `SECURITY DEFINER` con `search_path` vacío que realiza la actualización atómica de la tabla. Implementa una ventana fija de diez minutos y permite como máximo cinco solicitudes por identificador; devuelve `allowed`, `remaining` y `retry_after_seconds`.

La aplicación no accede directamente a `private.contact_rate_limits`: la tabla revoca permisos a `PUBLIC`, `anon`, `authenticated` y `service_role`. La función revoca ejecución pública y para `anon`/`authenticated`, y concede `EXECUTE` solo a `service_role`.

La limpieza diaria elimina registros cuya última actualización supera las 24 horas, sin cambiar la ventana operativa de diez minutos. El índice `contact_rate_limits_updated_at_idx` facilita esa limpieza y evita mantener indefinidamente los identificadores seudonimizados cuando los jobs se ejecutan correctamente.

## RLS, policies y permisos

RLS está habilitado en las cuatro tablas del esquema `public`:

- `projects`: `anon` y `authenticated` solo pueden seleccionar registros con `status = 'published'`;
- `project_media`: esos roles solo pueden seleccionar medios cuyo proyecto esté publicado;
- `ads_cases`: la policy `Public can read published ads cases` permite `SELECT` a `anon` y `authenticated` solo con `status = 'published'`;
- `contact_messages`: no tiene policies públicas. La inserción de la aplicación usa el cliente secreto del servidor con permisos de `service_role`.

Los roles públicos no tienen permisos de escritura sobre estas tablas. El baseline conserva los grants privilegiados de las tablas iniciales para `postgres` y `service_role`. La migration de `ads_cases` revoca permisos a `PUBLIC`, `anon`, `authenticated` y `service_role`, y concede únicamente `SELECT` a `anon` y `authenticated`; no añade un grant de escritura para `service_role`. No debe suponerse que la capacidad de saltar RLS sustituye los privilegios de tabla.

## Funciones y triggers

`public.set_updated_at()` actualiza `updated_at` antes de cada `UPDATE` en las cuatro tablas públicas, incluido el trigger `ads_cases_set_updated_at`.

`public.rls_auto_enable()` es una función `SECURITY DEFINER` usada por el event trigger `ensure_rls` para habilitar RLS al crear tablas en `public`. Su ejecución está revocada para `PUBLIC` y no está concedida a `anon` ni `authenticated`; el baseline solo la concede a `postgres`.

La función de rate limit y sus permisos se describen en la sección anterior. `private.contact_rate_limits` no depende de acceso público ni de una policy RLS: se aísla mediante schema privado, revocaciones y la RPC autorizada.

### Funciones privadas de retención

| Función | Comportamiento | Retorno |
| --- | --- | --- |
| `private.delete_expired_contacts()` | Elimina contactos con `last_interaction_at < now() - interval '24 months'`. | Cantidad de filas eliminadas (`bigint`). |
| `private.delete_stale_contact_rate_limits()` | Elimina registros con `updated_at < now() - interval '24 hours'`. | Cantidad de filas eliminadas (`bigint`). |
| `private.touch_contact_interaction(uuid)` | Actualiza exclusivamente `last_interaction_at = now()` de un contacto; lanza `Contact message not found` si no existe y no crea filas. | Nuevo `last_interaction_at` (`timestamptz`). |

Las tres funciones usan `SECURITY INVOKER`, `search_path = ''` y `timezone = 'UTC'`, con owner `postgres`. Revocan permisos a `PUBLIC`, `anon`, `authenticated` y `service_role`, y conceden ejecución únicamente a `postgres`. El schema `private` no está expuesto por la Data API; estas funciones no modifican RLS ni policies.

## Ciclo de vida y retención

La política pública de privacidad, versión 1.3, establece un máximo ordinario de 24 meses desde la última interacción relacionada con la consulta. Si no se registra otra interacción, `last_interaction_at` conserva la fecha inicial y el contacto vence aproximadamente 24 meses después de su creación.

Las interacciones posteriores se registran manualmente desde Supabase SQL Editor, como `postgres`:

```sql
select private.touch_contact_interaction('UUID_DEL_CONTACTO');
```

El UUID del ejemplo debe sustituirse por el del contacto existente. La función reinicia el cómputo del plazo mediante `last_interaction_at`; no modifica `created_at`. El trigger `contact_messages_set_updated_at` permanece activo y actualiza automáticamente `updated_at`. No existe sincronización con correo, CRM o Make para registrar estas interacciones: recibir o responder un correo no actualiza por sí solo la columna.

### Cron interno

`pg_cron` está habilitado por la migration de retención. Los dos jobs activos se programan como `postgres`:

| Job | Expresión | Horario diario UTC | Comando |
| --- | --- | --- | --- |
| `delete-stale-contact-rate-limits` | `15 3 * * *` | 03:15 | `select private.delete_stale_contact_rate_limits();` |
| `delete-expired-contacts` | `30 3 * * *` | 03:30 | `select private.delete_expired_contacts();` |

Las migrations verifican que `cron.timezone` sea compatible con UTC/GMT sin cambiar la configuración global. Los jobs con nombre se actualizan para el mismo rol al repetir la programación. La frecuencia diaria permite intencionalmente que un registro permanezca algunas horas después de vencer, hasta el siguiente ciclo exitoso.

La limpieza actúa sobre las filas de Supabase. No elimina automáticamente las copias ni las notificaciones históricas en Make o correo. Tampoco implementa excepciones legales automáticas de conservación ni sustituye la gestión de solicitudes de eliminación anticipada. La política pública contempla esas situaciones, pero el criterio SQL de contactos se basa únicamente en `last_interaction_at`.

## Escritura del formulario

`POST /api/contact` procesa la solicitud en este orden:

1. exige `application/json` y rechaza tempranamente un `Content-Length` superior a 10 000 bytes;
2. obtiene una IP válida del header confiable `!~Passenger-Client-Address` en producción; si no existe, falla cerrado;
3. genera un HMAC-SHA256 con `RATE_LIMIT_SECRET` y consulta la RPC de rate limit, sin enviar la IP original a Supabase;
4. lee el body mediante stream, suma bytes reales y solo decodifica UTF-8 y parsea JSON si no supera 10 000 bytes;
5. exige un objeto plano, aplica honeypot y vuelve a validar los campos;
6. conserva el path del `Referer` solo si pertenece al mismo host y llama a `createContact`.

`createContact` inserta con `status = 'new'`, `source = 'website'` y la fecha de aceptación de privacidad. El navegador nunca recibe `SUPABASE_SECRET_KEY` ni la identidad utilizada por el rate limit.

## Integraciones externas no versionadas

Las integraciones externas de notificaciones conectadas a Supabase no forman parte de las migrations del proyecto. El Cron interno de retención sí se versiona como lógica propia de la base de datos, según la sección anterior. Las etiquetas y los activadores de GTM/GA4 también se administran externamente, no mediante SQL ni archivos de configuración del repositorio.

Aunque algunas de estas integraciones pueden crear extensiones, funciones, triggers u otros objetos internos dentro de PostgreSQL, se consideran infraestructura externa y no estructura propia del modelo de datos de la aplicación.

Actualmente, la automatización de nuevos contactos requiere:

- extensión `pg_net` habilitada;
- integración oficial Database Webhooks de Supabase instalada;
- Database Webhook configurado sobre `public.contact_messages`;
- evento limitado a `INSERT`;
- escenario externo en Make encargado de recibir el evento y enviar la notificación por correo.

Esta configuración no se versiona mediante `supabase/migrations/` y debe recrearse manualmente si el proyecto se reconstruye o migra a una nueva instancia.

La decisión busca mantener las migrations desacopladas de proveedores externos. Las migrations permanecen reservadas para la estructura, seguridad y lógica propia de la base de datos utilizada directamente por la aplicación.

Si una integración externa se reemplaza o elimina, su configuración debe modificarse fuera del historial de migrations sin alterar innecesariamente el modelo estructural del proyecto.

## Storage

`supabase/config.toml` versiona el bucket `project-media` con:

- acceso público de lectura;
- límite por archivo de `5MiB`;
- MIME types permitidos: `image/avif`, `image/webp`, `image/jpeg`, `video/webm` y `video/mp4`.

Que el bucket sea público no concede escritura pública: el SQL versionado no define policies públicas de escritura en `storage.objects`. Los objetos reales almacenados en el bucket no forman parte del repositorio.

## Versionado y mantenimiento

- `supabase/migrations/` contiene diez archivos: baseline, rate limit, retención, interacción manual, Cron, catálogo publicitario y su adaptación, tipo `digital_ads`, `inter_nav` y ampliación del contacto. Debe recibir los cambios estructurales, de seguridad y de lógica propios del modelo de datos de la aplicación, incluyendo schemas, tablas, constraints, índices, RLS, policies, funciones, triggers y grants propios del proyecto.
- Las integraciones externas, aunque utilicen capacidades internas de PostgreSQL o Supabase, no forman parte de las migrations salvo que pasen a convertirse explícitamente en lógica propia y estable del proyecto.
- `supabase/config.toml` describe configuración estructural versionable de Supabase, incluida la del bucket; debe mantenerse sincronizado con el estado estructural esperado.
- Las filas de producción y los objetos reales de Storage son datos remotos, no migrations ni configuración versionada.
- El vínculo de Supabase CLI con el proyecto remoto `mircomania-web` se conserva como estado local ignorado por Git.

Para un cambio estructural propio del proyecto, crear una migration local, revisar su SQL y validarla antes de aplicarla. Cuando corresponda, ejecutar `supabase db push --dry-run` antes de `supabase db push`.

No cambiar directamente el schema de producción salvo una intervención excepcional explícita. Si el remoto y las migrations divergen en elementos que sí pertenecen al modelo estructural del proyecto, detenerse y reportar la diferencia antes de modificar cualquiera de los dos.

Las diferencias originadas exclusivamente por integraciones externas configuradas fuera del sistema de migrations deben tratarse como configuración operativa y documentarse por separado.
