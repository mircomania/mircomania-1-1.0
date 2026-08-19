# Design system

## Identidad visual implementada

La interfaz usa un fondo oscuro espacial, texto claro, gradientes, brillos suaves y elementos inspirados en estrellas y constelaciones. Las tarjetas y formularios combinan fondos translúcidos, bordes claros de baja opacidad y, en algunos casos, `backdrop-filter`.

## Tokens de color

Definidos en `src/styles/colors.css`:

```css
/* Base */
--color-white: #f0f0f5;
--color-black: #000000;
--color-dark: #050508;
--color-space-dark: #010208;
--color-space-blue: #03040a;

/* Texto */
--text-primary: rgba(255, 255, 255, 0.92);
--text-secondary: rgba(230, 235, 255, 0.68);
--text-muted: rgba(235, 240, 255, 0.72);

/* Estrellas y luz */
--star-core: rgba(255, 255, 255, 0.96);
--star-glow-soft: rgba(180, 200, 255, 0.35);
--star-glow-strong: rgba(255, 255, 255, 0.85);

/* Constelaciones */
--constellation-line: rgba(220, 230, 255, 0.24);
--constellation-glow: rgba(180, 200, 255, 0.18);

/* Efectos */
--text-glow-soft: 0 0 24px rgba(255, 255, 255, 0.2);
--space-glow-blue: rgba(120, 150, 255, 0.12);
```

El navbar añade `--navbar-height-mobile: 64px` y `--navbar-height-desktop: 100px` para su altura y los offsets de anclas.

## Tipografía

Las fuentes se cargan en el layout raíz y se exponen como variables:

| Variable | Fuente y pesos | Uso observable |
| --- | --- | --- |
| `--font-title` | Montserrat 700, 900 | Headings globales y títulos principales |
| `--font-body` | Inter 400, 500, 700 | Body, controles y texto general |
| `--font-space` | Space Grotesk 500, 700 | Etiquetas, metadata, CTAs y acentos espaciales |

Las clases globales `.font-title`, `.font-body` y `.font-space` permiten aplicar cada familia de forma explícita.

## Patrones visuales

- `space-main` compone gradientes radiales y lineales compartidos.
- `StarryBackground` mantiene tres capas de estrellas fijas con `box-shadow` y animaciones CSS.
- `ParticlePlanet` dibuja un planeta de puntos en canvas, disponible solo desde `1200px` mediante `DesktopParticlePlanet`.
- La sección de servicios usa cuatro estrellas seleccionables, líneas SVG y un slider horizontal en móvil/vertical en escritorio.
- `ButtonLink` ofrece variantes `primary` tipo píldora y `secondary` tipo enlace subrayado al interactuar.
- Las tarjetas de proyecto usan radio de `20px`; el formulario usa radio de `18px` y controles de `10px`.

## Responsive

Los estilos se escriben con base móvil. Los breakpoints presentes son `576px`, `768px`, `992px`, `1200px`, `1400px` y `1700px`, aplicados solo donde cada componente los necesita. Los cambios estructurales principales ocurren en `992px` para el navbar y en `1200px` para proyectos, formularios, constelación y planeta.

## Movimiento

Hay manejo de `prefers-reduced-motion` en el scroll global, botones compartidos, navbar, footer, privacidad, constelación, tarjetas, página 404, mazo móvil y planeta de partículas. La cobertura no es total: el fondo estrellado, el spinner y la estrella animada de `Home4` no tienen una desactivación efectiva propia en el código actual.
