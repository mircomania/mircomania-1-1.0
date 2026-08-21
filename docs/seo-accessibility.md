# SEO y accesibilidad

Este documento registra las implementaciones presentes; no representa resultados de una auditoría ni puntajes medidos.

## SEO implementado

### Metadata

El layout raíz configura:

- `metadataBase` con `https://mircomania.cl`;
- título por defecto `Mircomania` y template `%s | Mircomania`;
- descripción global;
- código de verificación de Google.

`createMetadata` añade a cada página canonical, Open Graph (`website`, `es_CL`, nombre del sitio, título, descripción y URL) y Twitter Card `summary_large_image`.

| Ruta | Título configurado |
| --- | --- |
| `/` | `Mircomania | Desarrollo web, automatización y productos digitales` como título absoluto |
| `/contacto` | `Contacto`, combinado con el template global |
| `/politica-privacidad` | `Política de privacidad`, combinado con el template global |

`opengraph-image.png` y `twitter-image.png` viven en `src/app` con sus respectivos archivos `.alt.txt`.

### Descubrimiento e indexación

- `robots.ts` permite `/` a todos los user agents y declara `https://mircomania.cl/sitemap.xml`.
- `sitemap.ts` incluye `/`, `/contacto` y `/politica-privacidad` a partir de `SITE_URL` y `ROUTES`.
- Las rutas públicas están en español, son legibles y el documento raíz usa `lang="es"`.

### Renderizado e imágenes

Las páginas son Server Components. El inicio usa regeneración con `revalidate = 3600`; las otras páginas no declaran revalidación.

Las portadas de proyecto usan `next/image` con `alt`, `width`, `height` y `sizes`. El servicio de servidor valida y normaliza esos valores desde la portada de `project_media`; una fila sin portada renderizable se omite antes de llegar a la UI. Los SVG decorativos incluyen `aria-hidden="true"` y `focusable="false"`.

## Accesibilidad implementada

### Estructura y headings

- El layout usa `header`, `nav`, `main` y `footer`.
- Cada página pública y la página 404 renderizan un solo `h1`.
- Las secciones principales enlazan sus headings mediante `aria-labelledby` cuando corresponde.
- Proyectos y servicios usan `article`, listas y botones según su función.

### Navegación y foco

- Enlaces y botones tienen estilos `:focus-visible` en las áreas interactivas principales.
- El botón burger expone `aria-label`, `aria-expanded` y `aria-controls`.
- El panel cerrado usa `inert`; se cierra con Escape, clic exterior o navegación, y Escape devuelve el foco al botón.
- El mazo móvil usa botones nativos, `aria-expanded`, `aria-controls`, `aria-busy` e `inert` para las tarjetas cerradas; al contraer devuelve el foco al control de apertura.
- Las estrellas de servicios son botones con nombre accesible y estado `aria-pressed` cuando están activas.

### Formulario

- Todos los campos visibles tienen `label` asociado.
- Los campos obligatorios usan `required`; los errores usan `aria-invalid` y `aria-describedby`.
- El texto de ayuda del mensaje se asocia al `textarea`.
- Los errores de envío usan `role="alert"`/`aria-live="assertive"`; el éxito usa `role="status"`/`aria-live="polite"`.
- El botón de envío comunica actividad con `aria-busy` y permanece deshabilitado durante la solicitud.

### Movimiento

El código reduce o elimina movimiento en varias áreas mediante media queries, y las animaciones JavaScript del planeta y del mazo consultan `prefers-reduced-motion`. La cobertura actual no alcanza el fondo estrellado, el spinner ni la animación de la estrella de `Home4`.

## Elementos no verificados

El repositorio no contiene resultados de Lighthouse, pruebas automatizadas de accesibilidad ni mediciones de contraste. Tampoco implementa un focus trap explícito en el menú móvil; su comportamiento completo de teclado debe comprobarse en una auditoría interactiva.
