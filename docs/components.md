# Componentes y módulos principales

## Shell global

| Módulo | Responsabilidad actual |
| --- | --- |
| `Navbar` | Navegación fija; alterna menú de escritorio y burger según media query y cambia de aspecto en tres estados de scroll. |
| `BurgerMenu` | Renderiza el panel móvil en un portal, mantiene el panel cerrado como `inert` y delega apertura, cierre y foco a `useBurgerMenu`. |
| `NavItems` | Adapta los elementos de `navbarMenu` a `SmartLink`. |
| `Footer` | Marca, navegación, redes, correo, enlace legal y año actual. |
| `StarryBackground` | Tres capas CSS fijas de estrellas decorativas. |
| `UtmAttributionTracker` | Captura UTM en entrada y cambios de ruta/búsqueda mediante un efecto, sin estado ni DOM visual; se monta globalmente dentro de `Suspense`. |

`Navbar` y `Footer` se montan desde el layout raíz y aparecen en todas las rutas.

## Secciones de página

| Componente | Responsabilidad actual |
| --- | --- |
| `Home1` | Hero con el título principal y “Full Stack Dev”. |
| `Home2` | Constelación interactiva de cuatro servicios; Publicidad Digital incluye un `SmartLink` interno hacia `/ads`. |
| `Home3` | Encabezado y presentación responsive de una colección de DTOs `FeaturedProjectCard`; la home no lo monta si no hay tarjetas renderizables. |
| `ProjectCard` | Presenta el DTO con portada, tipo (incluido `digital_ads`), año, resumen y stack; `interNav` abre un estudio con `SmartLink`, separado de demo y repositorio externos. |
| `MobileProjectsDeck` | Mazo expandible de proyectos para anchos inferiores a `1200px`. |
| `ProjectsLoadError` | Estado accesible y local cuando no es posible consultar los proyectos destacados. |
| `Home4` | CTA al CV público. |
| `Home5` | Bloque de colaboración, planeta de escritorio y formulario. |
| `Contact1` | Presentación de `/contacto`, planeta de escritorio y formulario. |
| `Privacy1` | Contenido semántico de la política de privacidad. |

## Publicidad Digital y Mejoravit

| Módulo | Responsabilidad actual |
| --- | --- |
| `/ads/page.tsx` | Landing de servicios publicitarios, consulta del catálogo con revalidación horaria y CTA a contacto con `servicio=marketing`. |
| `AdsCases` | Sección de estudios; distingue lista, catálogo vacío y fallo de carga, sin inventar casos. |
| `AdsCaseCard` | Tarjeta semántica con título, resumen, categoría, logo opcional, hasta dos métricas y período; solo enlaza estudios con `studyHref`. |
| `MobileAdsCasesCarousel` | Cuadrícula responsive y carrusel móvil; agrupa diapositivas, oculta clones con `inert`/`aria-hidden` y anuncia posición cuando hay bucle. |
| `useMobileAdsCasesCarousel` | Scroll, índice, corrección del bucle y tamaño; flechas/Home/End con foco en el carrusel y alineación de la tarjeta al recibir foco. |
| `adsCarouselPosition` | Cálculo puro del índice lógico y corrección de los extremos clonados. |
| `/ads/mejoravit/page.tsx` | Compone contexto profesional, evolución, histórico, comparación Mi Cuenta — Mejoravit 4, calidad comercial y CTA. |
| `MonthlyCpaChart` | Gráfico SVG de servidor con 17 meses, escala desde cero, tooltips y meses parciales; ofrece una tabla histórica en `details`. |
| `cpaGeometry` | Coordenadas, escala común y tramos separados ante datos inválidos o ausentes; no convierte ausencia de CPA en cero. |
| `data/ads/mejoravit-history.json` | Snapshot público versionado de métricas agregadas y procedencia del XML; no contiene inversión. |
| `data/ads/mejoravit.ts` | Exporta el snapshot, el reporte comercial independiente y formateadores `es-CL`; meses en UTC y CPA en MXN. |
| `scripts/import_mejoravit_history.py` | Valida el XML y genera o comprueba el snapshot especializado; no forma parte del runtime de Next.js. |

El mantenimiento, metodología y límites del estudio se explican en [mejoravit-ads.md](mejoravit-ads.md).

## Formulario de contacto

| Módulo | Responsabilidad actual |
| --- | --- |
| `ContactForm` | Campos controlados, errores asociados, consentimiento, honeypot, estados de envío y botón con `aria-busy`. |
| `ContactFormStatus` | Mensajes de éxito con `role="status"` y errores con `role="alert"`. |
| `useContactForm` | Estado, lectura UTM al enviar, validación cliente y envío con el mismo payload, foco del primer campo inválido, reseteo y mensajes distintos para timeout, red y error inesperado. |
| `validateContactPayload` | Normaliza y valida nombre, correo, motivo, mensaje, consentimiento y UTM; se reutiliza en cliente y Route Handler. |
| `pushContactFormEvent` | Agrega el evento `send_form` con el tipo de contacto a `window.dataLayer`. |

El formulario acepta los motivos `project`, `automation`, `advertising`, `analytics`, `job`, `collaboration` y `general`, definidos en `CONTACT_TYPES`. Nombre, correo, mensaje y consentimiento son obligatorios; el correo admite hasta 254 caracteres y el mensaje entre 10 y 3000.

`ContactForm` recibe `initialContactType` y el hook lo utiliza al inicializar el estado, sin actualizar valores mediante un efecto. `/contacto` interpreta `?servicio=marketing` y pasa `advertising` a través de `Contact1`; la home usa la selección vacía por defecto. Es una selección inicial de interfaz, editable por el usuario y separada de la atribución UTM.

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
| `getPublishedAdsCases` | Lee `ads_cases` publicados en orden, valida y normaliza a `PublishedAdsCase`, resuelve logos opcionales y asigna enlaces solo para estudios registrados (`mejoravit`). |
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
| `getUtmParams` | Reemplaza el conjunto almacenado al recibir UTM no vacíos; en su ausencia lo reutiliza sin renovar el timestamp. Tolera fallos de Storage y descarta valores inválidos o con más de 15 días. |
| `getRequestPath` | Devuelve el pathname del `Referer` solo cuando su host coincide con el de la solicitud. |
| `getClientIdentity` | Usa Passenger como fuente confiable en producción; fuera de producción admite fallbacks de IP para desarrollo y tests. |
| `hashRateLimitIdentifier` | Genera un HMAC-SHA256 hexadecimal con `RATE_LIMIT_SECRET`; falla si el secreto no está disponible. |
| `readLimitedJsonBody` | Lee el stream, suma bytes antes de decodificar UTF-8 y clasifica body grande, JSON inválido y body inválido. |
| `routes.ts` | Centraliza URL base, rutas públicas, anclas, correo, CV y perfiles sociales. |

Los iconos de `src/assets/icons` son componentes SVG sin dependencia de una biblioteca externa.
