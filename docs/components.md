# Componentes y módulos principales

## Shell global

| Módulo | Responsabilidad actual |
| --- | --- |
| `Navbar` | Navegación fija; alterna menú de escritorio y burger según media query y cambia de aspecto en tres estados de scroll. |
| `BurgerMenu` | Renderiza el panel móvil en un portal, mantiene el panel cerrado como `inert` y delega apertura, cierre y foco a `useBurgerMenu`. |
| `NavItems` | Adapta los elementos de `navbarMenu` a `SmartLink`. |
| `Footer` | Marca, navegación, redes, correo, enlace legal y año actual. |
| `StarryBackground` | Tres capas CSS fijas de estrellas decorativas. |

`Navbar` y `Footer` se montan desde el layout raíz y aparecen en todas las rutas.

## Secciones de página

| Componente | Responsabilidad actual |
| --- | --- |
| `Home1` | Hero con el título principal y “Full Stack Dev”. |
| `Home2` | Constelación interactiva de cuatro servicios y su contenido desplazable. |
| `Home3` | Encabezado y presentación responsive de una colección de DTOs `FeaturedProjectCard`; la home no lo monta si no hay tarjetas renderizables. |
| `ProjectCard` | Presenta con `next/image` un DTO que ya contiene portada, tipo, año, resumen, stack y enlaces externos. |
| `MobileProjectsDeck` | Mazo expandible de proyectos para anchos inferiores a `1200px`. |
| `ProjectsLoadError` | Estado accesible y local cuando no es posible consultar los proyectos destacados. |
| `Home4` | CTA al CV público. |
| `Home5` | Bloque de colaboración, planeta de escritorio y formulario. |
| `Contact1` | Presentación de `/contacto`, planeta de escritorio y formulario. |
| `Privacy1` | Contenido semántico de la política de privacidad. |

## Formulario de contacto

| Módulo | Responsabilidad actual |
| --- | --- |
| `ContactForm` | Campos controlados, errores asociados, consentimiento, honeypot, estados de envío y botón con `aria-busy`. |
| `ContactFormStatus` | Mensajes de éxito con `role="status"` y errores con `role="alert"`. |
| `useContactForm` | Estado, UTM, validación cliente, foco del primer campo inválido, envío, reseteo y mensajes distintos para timeout, red y error inesperado. |
| `validateContactPayload` | Normaliza y valida nombre, correo, motivo, mensaje, consentimiento y UTM; se reutiliza en cliente y Route Handler. |
| `pushContactFormEvent` | Agrega el evento `send_form` con el tipo de contacto a `window.dataLayer`. |

El formulario acepta los motivos `project`, `job`, `collaboration` y `general`. Nombre, correo, mensaje y consentimiento son obligatorios; el correo admite hasta 254 caracteres y el mensaje entre 10 y 3000.

## Visuales interactivos

| Módulo | Responsabilidad actual |
| --- | --- |
| `DesktopParticlePlanet` | Renderiza el planeta solo desde `1200px`. |
| `ParticlePlanet` | Dibuja 420 puntos en canvas, anima la rotación y la pausa fuera del viewport o con movimiento reducido. |
| `useConstellation` | Controla las fases de la constelación y sincroniza estrella activa con el slider. |
| `useMobileProjectsDeck` | Expande/contrae con Web Animations, omite la animación con movimiento reducido, conserva el scroll, lleva el foco a la primera acción al abrir por teclado y lo devuelve al control al cerrar. |

## Hooks compartidos

| Hook | Responsabilidad actual |
| --- | --- |
| `useMediaQuery` | Suscribe `matchMedia` mediante `useSyncExternalStore`; durante SSR devuelve `false`. |
| `useBurgerMenu` | Estado del panel, foco inicial, confinamiento de Tab, cierre por navegación, clic exterior, Escape o cambio a desktop, retorno al trigger con Escape y bloqueo de scroll. |
| `useNavbarScroll` | Produce los estados `top`, `transition` y `solid`, actualizados con `requestAnimationFrame`. |

## Datos y servicios

| Módulo | Responsabilidad actual |
| --- | --- |
| `lib/supabase/server.ts` | Crea el cliente de lectura con URL y publishable key públicas dentro de un límite `server-only`. |
| `lib/supabase/admin.ts` | Crea el cliente de escritura con clave secreta y límite `server-only`. |
| `getPublicMediaUrl` | Resuelve en servidor una ruta válida del bucket `project-media` a URL pública. |
| `getFeaturedProjects` | Consulta proyectos publicados y destacados con solo su portada, valida las filas y las convierte al DTO de presentación ordenado por `featured_order`. |
| `submitContact` | Envía JSON a `POST /api/contact`, aplica un timeout local de 20 segundos y normaliza la respuesta. |
| `checkContactRateLimit` | Valida el hash, llama a la RPC `check_contact_rate_limit` y normaliza estados permitido, bloqueado o error. |
| `createContact` | Inserta el mensaje validado en `contact_messages` mediante el cliente admin. |

## Utilidades

| Módulo | Responsabilidad actual |
| --- | --- |
| `ButtonLink` | Enlace con variantes `primary`/`secondary`; abre en una pestaña nueva por defecto y puede mostrar icono externo. |
| `SmartLink` | `next/link` con scroll suave para la ruta o ancla actual y atributos de analítica. |
| `RouteFocusManager` | Tras un cambio de pathname enfoca el `main` sin desplazar la página. |
| `createMetadata` | Genera canonical, Open Graph y Twitter Card a partir de título, descripción y ruta. |
| `getUtmParams` | Lee UTM de la URL o de `localStorage`, tolera fallos de Storage y elimina valores inválidos o expirados tras 15 días. |
| `getRequestPath` | Devuelve el pathname del `Referer` solo cuando su host coincide con el de la solicitud. |
| `getClientIdentity` | Usa Passenger como fuente confiable en producción; fuera de producción admite fallbacks de IP para desarrollo y tests. |
| `hashRateLimitIdentifier` | Genera un HMAC-SHA256 hexadecimal con `RATE_LIMIT_SECRET`; falla si el secreto no está disponible. |
| `readLimitedJsonBody` | Lee el stream, suma bytes antes de decodificar UTF-8 y clasifica body grande, JSON inválido y body inválido. |
| `routes.ts` | Centraliza URL base, rutas públicas, anclas, correo, CV y perfiles sociales. |

Los iconos de `src/assets/icons` son componentes SVG sin dependencia de una biblioteca externa.
