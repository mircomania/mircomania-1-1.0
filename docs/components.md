# Componentes y módulos principales

## Shell global

| Módulo | Responsabilidad actual |
| --- | --- |
| `Navbar` | Navegación fija; alterna menú de escritorio y burger según media query y cambia de aspecto en tres estados de scroll. |
| `BurgerMenu` | Renderiza el panel móvil en un portal, expone estado ARIA y delega apertura/cierre a `useBurgerMenu`. |
| `NavItems` | Adapta los elementos de `navbarMenu` a `SmartLink`. |
| `Footer` | Marca, navegación, redes, correo, enlace legal y año actual. |
| `StarryBackground` | Tres capas CSS fijas de estrellas decorativas. |

`Navbar` y `Footer` se montan desde el layout raíz y aparecen en todas las rutas.

## Secciones de página

| Componente | Responsabilidad actual |
| --- | --- |
| `Home1` | Hero con el título principal y “Full Stack Dev”. |
| `Home2` | Constelación interactiva de cuatro servicios y su contenido desplazable. |
| `Home3` | Encabezado y presentación responsive de proyectos destacados. |
| `ProjectCard` | Portada con `next/image`, tipo, año, resumen, stack y enlaces externos del proyecto. |
| `MobileProjectsDeck` | Mazo expandible de proyectos para anchos inferiores a `1200px`. |
| `Home4` | CTA al CV público. |
| `Home5` | Bloque de colaboración, planeta de escritorio y formulario. |
| `Contact1` | Presentación de `/contacto`, planeta de escritorio y formulario. |
| `Privacy1` | Contenido semántico de la política de privacidad. |

## Formulario de contacto

| Módulo | Responsabilidad actual |
| --- | --- |
| `ContactForm` | Campos controlados, errores asociados, consentimiento, honeypot, estado de envío y botón de submit. |
| `ContactFormStatus` | Mensajes de éxito con `role="status"` y errores con `role="alert"`. |
| `useContactForm` | Estado, UTM, validación en cliente, envío, reseteo y manejo de respuestas. |
| `validateContactPayload` | Normaliza y valida nombre, correo, motivo, mensaje, consentimiento y UTM; se reutiliza en cliente y Route Handler. |
| `pushContactFormEvent` | Agrega el evento `send_form` con el tipo de contacto a `window.dataLayer`. |

El formulario acepta los motivos `project`, `job`, `collaboration` y `general`. Nombre, correo, mensaje y consentimiento son obligatorios; el mensaje admite entre 10 y 3000 caracteres.

## Visuales interactivos

| Módulo | Responsabilidad actual |
| --- | --- |
| `DesktopParticlePlanet` | Renderiza el planeta solo desde `1200px`. |
| `ParticlePlanet` | Dibuja 420 puntos en canvas, anima la rotación y la pausa fuera del viewport o con movimiento reducido. |
| `useConstellation` | Controla las fases de la constelación y sincroniza estrella activa con el slider. |
| `useMobileProjectsDeck` | Expande/contrae las tarjetas con Web Animations, conserva el scroll y devuelve el foco al control de apertura. |

## Hooks compartidos

| Hook | Responsabilidad actual |
| --- | --- |
| `useMediaQuery` | Suscribe `matchMedia` mediante `useSyncExternalStore`; durante SSR devuelve `false`. |
| `useBurgerMenu` | Estado del panel, cierre por navegación, clic exterior o Escape, retorno de foco y bloqueo de scroll. |
| `useNavbarScroll` | Produce los estados `top`, `transition` y `solid`, actualizados con `requestAnimationFrame`. |

## Datos y servicios

| Módulo | Responsabilidad actual |
| --- | --- |
| `lib/supabase/server.ts` | Crea un cliente con URL y publishable key públicas. |
| `lib/supabase/admin.ts` | Crea el cliente de escritura con clave secreta y límite `server-only`. |
| `getPublicMediaUrl` | Resuelve una ruta del bucket `project-media` a URL pública. |
| `getFeaturedProjects` | Consulta proyectos publicados y destacados con su media y los ordena por `featured_order`. |
| `getProjectCover` | Devuelve el primer elemento de media marcado `is_cover`. |
| `submitContact` | Envía JSON a `POST /api/contact` y normaliza la respuesta. |
| `createContact` | Inserta el mensaje validado en `contact_messages` mediante el cliente admin. |

## Utilidades

| Módulo | Responsabilidad actual |
| --- | --- |
| `ButtonLink` | Enlace con variantes `primary`/`secondary`; abre en una pestaña nueva por defecto y puede mostrar icono externo. |
| `SmartLink` | `next/link` con scroll suave para la ruta o ancla actual y atributos de analítica. |
| `createMetadata` | Genera canonical, Open Graph y Twitter Card a partir de título, descripción y ruta. |
| `getUtmParams` | Lee UTM de la URL o de `localStorage`, donde expiran después de 15 días. |
| `getRequestPath` | Devuelve el pathname del `Referer` solo cuando su host coincide con el de la solicitud. |
| `routes.ts` | Centraliza URL base, rutas públicas, anclas, correo, CV y perfiles sociales. |

Los iconos de `src/assets/icons` son componentes SVG sin dependencia de una biblioteca externa.
