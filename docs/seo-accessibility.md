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

- El shell global aporta `header`, navegación principal y `footer`; cada ruta renderiza su propio `main`.
- Cada página pública y la página 404 renderizan un solo `h1`.
- Las secciones principales enlazan sus headings mediante `aria-labelledby` cuando corresponde.
- Proyectos y servicios usan `article`, listas y botones según su función.

### Navegación y foco

- Enlaces y botones tienen estilos `:focus-visible` en las áreas interactivas principales.
- El botón burger expone `aria-label`, `aria-expanded` y `aria-controls`.
- Al abrir el burger, el foco pasa al primer control del panel y Tab/Shift+Tab quedan confinados en sus elementos interactivos. El panel cerrado usa `inert`; se cierra con Escape, clic exterior, navegación o al pasar a desktop, y Escape devuelve el foco al trigger.
- `SmartLink` mueve el foco al destino de una ancla en la ruta actual. Las secciones enlazables de la home usan `tabIndex={-1}` y una clase que oculta el outline del foco programático.
- `RouteFocusManager` enfoca el `main` tras cambios de pathname, sin alterar el scroll.
- El mazo móvil usa botones nativos, `aria-expanded`, `aria-controls`, `aria-busy` e `inert` para las tarjetas cerradas; al abrir mediante teclado enfoca la primera acción disponible y al contraer devuelve el foco al control.
- Las estrellas de servicios son botones con nombre accesible y estado `aria-pressed` cuando están activas.

### Formulario

- Todos los campos visibles tienen `label` asociado.
- Los campos obligatorios usan `required`; los errores usan `aria-invalid` y `aria-describedby`.
- El texto de ayuda del mensaje se asocia al `textarea`.
- Los errores de envío usan `role="alert"`/`aria-live="assertive"`; el éxito usa `role="status"`/`aria-live="polite"`.
- El botón de envío comunica actividad con `aria-busy` y permanece deshabilitado durante la solicitud.
- Cuando la validación local o la API devuelve errores de campo, `useContactForm` enfoca el primer control inválido según el orden del formulario.
- Timeout, fallo de red y error inesperado tienen mensajes diferentes que reconocen que no es posible confirmar la recepción.

### Movimiento

El código reduce o elimina movimiento mediante media queries en scroll, botones, navbar, footer, privacidad, constelación, tarjetas, 404 y `Home4`. `SmartLink`, la constelación, el planeta y el mazo móvil también consultan `prefers-reduced-motion` desde JavaScript para evitar scroll o animaciones programáticas.

La cobertura actual no alcanza las animaciones CSS del fondo estrellado ni del spinner.

## Elementos no verificados

El repositorio no contiene resultados de Lighthouse, pruebas automatizadas específicas de accesibilidad ni mediciones de contraste. La suite de Vitest cubre lógica crítica y el Route Handler, no una auditoría del DOM renderizado. El foco, teclado, responsive, anuncios de tecnología asistiva y apariencia visual deben comprobarse también de forma manual.
