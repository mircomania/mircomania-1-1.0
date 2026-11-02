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
| `/` | `Mircomania \| Desarrollo web, automatización y productos digitales` como título absoluto |
| `/contacto` | `Contacto`, combinado con el template global |
| `/ads` | `Publicidad digital`, combinado con el template global |
| `/ads/mejoravit` | `Mejoravit Ads`, combinado con el template global |
| `/politica-privacidad` | `Política de privacidad`, combinado con el template global |

`opengraph-image.png` y `twitter-image.png` viven en `src/app` con sus respectivos archivos `.alt.txt`.

`/ads` describe campañas de Google Ads, medición y optimización web. `/ads/mejoravit` describe experiencia profesional en PRO Consultores, 17 meses de captación, evolución del CPA y comparación contextual de Search/PMax. Ambas usan canonical de su ruta y los metadatos sociales de `createMetadata`; el estudio declara además explícitamente las imágenes globales de Open Graph (1200 × 630) y Twitter, con su texto alternativo. No se generan imágenes propias ni datos estructurados específicos del estudio.

### Descubrimiento e indexación

- `robots.ts` permite `/` a todos los user agents y declara `https://mircomania.cl/sitemap.xml`.
- `sitemap.ts` incluye cinco rutas: `/`, `/contacto`, `/ads`, `/ads/mejoravit` y `/politica-privacidad`, a partir de `SITE_URL` y `ROUTES`.
- Las rutas públicas están en español, son legibles y el documento raíz usa `lang="es"`.

### Renderizado e imágenes

Las páginas son Server Components. El inicio y `/ads` declaran `revalidate = 3600` para sus consultas a Supabase. `/ads/mejoravit` utiliza el JSON versionado y no declara ese intervalo; tampoco lo declaran contacto ni privacidad. Existir en el sitemap o en `main` no acredita que esta actualización esté publicada: staging y despliegue siguen pendientes.

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
- La estrella Publicidad Digital ofrece un enlace interno a `/ads`. `ProjectCard` renderiza el estudio de `interNav` mediante `SmartLink`, independiente de la demo y del repositorio externos; las rutas internas válidas deben apuntar a páginas existentes.

### Catálogo de publicidad

- `AdsCases` usa una sección con heading asociado y un destino de ancla `#casos-estudio` con `tabIndex={-1}`. Presenta estados de catálogo vacío y error sin tarjetas ficticias.
- `AdsCaseCard` usa `article`, `h3` y `dl`/`dt`/`dd` para sus métricas; el logo opcional usa `next/image` con texto alternativo validado. Solo muestra un enlace al estudio cuando el servicio entrega una ruta registrada.
- En móvil (hasta 768 px), `MobileAdsCasesCarousel` usa scroll horizontal y snap; con más de un caso activa bucle, región nombrada y foco en el contenedor. Las diapositivas reales tienen etiqueta de posición; los clones son `aria-hidden` e `inert`.
- Con foco en el carrusel, flechas izquierda/derecha y Home/End cambian de posición. Al recibir foco un enlace de una tarjeta real, el hook alinea esa diapositiva. El estado “Caso n de total” se anuncia con `role="status"`, `aria-live="polite"` y `aria-atomic`; los indicadores visuales están ocultos a tecnología asistiva.
- En escritorio se presenta la cuadrícula; con un solo caso no se activa el bucle ni su región interactiva. Los desplazamientos programáticos respetan movimiento reducido.

### Gráfico mensual Mejoravit

`MonthlyCpaChart` genera `figure`/`figcaption` y un SVG con `role="img"`, `aria-labelledby` hacia `title` y `aria-describedby` hacia `desc`. Las etiquetas incluyen los 17 meses; el período parcial tiene banda, asterisco y aclaración en el tooltip. Los `<title>` de cada punto reciben una cadena única con mes, condición parcial y CPA, conservada durante SSR.

La escala vertical empieza en cero y los datos inválidos o ausentes interrumpen la línea. El gráfico conserva un ancho mínimo y se desplaza horizontalmente en su sección nombrada, acompañado de una indicación textual. No se depende de los tooltips para leer los valores: `details`/`summary` abre una tabla alternativa con `caption`, encabezados `scope="col"`/`scope="row"`, conversiones y CPA. La tabla también tiene contenedor horizontal nombrado y muestra “No disponible” cuando corresponde. Si no hay puntos válidos se ofrece un estado textual honesto.

Estas propiedades documentan la semántica implementada; no garantizan por sí solas soporte completo en todos los lectores de pantalla o interacción táctil.

### Formulario

- Todos los campos visibles tienen `label` asociado.
- Los campos obligatorios usan `required`; los errores usan `aria-invalid` y `aria-describedby`.
- El texto de ayuda del mensaje se asocia al `textarea`.
- Los errores de envío usan `role="alert"`/`aria-live="assertive"`; el éxito usa `role="status"`/`aria-live="polite"`.
- El botón de envío comunica actividad con `aria-busy` y permanece deshabilitado durante la solicitud.
- Cuando la validación local o la API devuelve errores de campo, `useContactForm` enfoca el primer control inválido según el orden del formulario.
- Timeout, fallo de red y error inesperado tienen mensajes diferentes que reconocen que no es posible confirmar la recepción.
- Los siete motivos permanecen seleccionables. `?servicio=marketing` inicia Publicidad Digital sin bloquear cambios del usuario; el tracker UTM no introduce controles ni contenido visual.

### Movimiento

El código reduce o elimina movimiento mediante media queries en scroll, botones, navbar, footer, privacidad, constelación, tarjetas, 404 y `Home4`. `SmartLink`, la constelación, el planeta y el mazo móvil también consultan `prefers-reduced-motion` desde JavaScript para evitar scroll o animaciones programáticas.

La cobertura actual no alcanza las animaciones CSS del fondo estrellado ni del spinner.

## Elementos no verificados

El repositorio no contiene resultados de Lighthouse ni mediciones de contraste o una auditoría integral de accesibilidad. Vitest incluye aserciones sobre HTML de servidor del catálogo y sobre SVG, tooltips y tabla histórica, además de lógica crítica y el Route Handler; no equivale a una auditoría de WCAG ni del navegador con tecnología asistiva. Las verificaciones de navegador comunicadas durante el desarrollo, incluido el gráfico sin errores de hidratación, no sustituyen revisar foco, teclado, responsive, anuncios de lectores de pantalla y apariencia visual en staging y producción.
