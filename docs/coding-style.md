# Coding style

Este documento resume la configuración y los patrones repetidos en el código actual. No sustituye las comprobaciones automáticas.

## Formato y lint

`.prettierrc` configura:

- indentación de 4 espacios;
- ancho de línea de 150 caracteres;
- comillas simples.

ESLint 9 usa la configuración flat de `eslint-config-next`, con las reglas `core-web-vitals` y TypeScript. No hay una regla de orden de imports configurada; los archivos suelen separar imports por procedencia mediante líneas en blanco, pero el orden no es uniforme.

## TypeScript

`tsconfig.json` habilita `strict`, `noEmit`, resolución `bundler`, JSX de React y el alias `@/*` hacia `src/*`. Los modelos y props compartidos se expresan principalmente con `type`; la ampliación global de `Window.dataLayer` usa `interface` dentro de `global.d.ts`.

El código evita `any` y utiliza `unknown` para datos de entrada no validados, como el body del endpoint de contacto. Los payloads se estrechan antes de llegar al servicio de escritura.

## React y Next.js

- Los componentes son funciones y reciben props con tipos explícitos cuando corresponde.
- Los archivos de ruta y la mayoría de las secciones permanecen como Server Components.
- Los módulos que requieren estado, efectos, eventos o APIs del navegador declaran `'use client'`.
- El acceso a Supabase se concentra en `src/lib/supabase` y `src/services`; las páginas consumen servicios y pasan datos a los componentes de presentación.
- Los módulos que usan la clave secreta importan `server-only`.
- Los metadatos de página se construyen mediante `createMetadata` y las rutas se centralizan en `src/constants/routes.ts`.

## CSS

- `src/app/globals.css` importa reset, tokens, tipografías, navegación, fondos, botones, spinner y utilidades globales.
- Los estilos propios de cada componente viven en `*.module.css` junto al componente.
- Las reglas base corresponden a móvil y los layouts se amplían mediante `min-width`.
- Los colores y efectos compartidos usan custom properties de `src/styles/colors.css`; las alturas del navbar se definen en `src/styles/navbar.css`.
- Los estados de teclado usan `:focus-visible` en navegación, formularios, enlaces y controles interactivos.

## Organización y nombres

- Componentes: PascalCase (`ProjectCard.tsx`).
- Hooks: prefijo `use` (`useContactForm.ts`).
- Servicios y utilidades: camelCase (`getFeaturedProjects.ts`).
- CSS Modules: nombre del área en camelCase (`contactForm.module.css`).
- Tipos compartidos: `src/types`; constantes compartidas: `src/constants`.

## Validación local

Después de cambiar código, los comandos disponibles son:

```bash
npm test
npm run test:watch
npm run lint
npm run build
```

Los tests actuales son archivos `*.test.ts` colocados junto al módulo probado, usan imports explícitos de Vitest y se ejecutan en entorno Node. Las suites unitarias controlan fronteras externas concretas con `vi.mock`; la integración de `/api/contact` mantiene reales `Request`, `Response`, parsing, validación, identidad y HMAC, y mockea solo los servicios que salen hacia Supabase.

La suite cubre la lógica crítica del contacto, pero el comportamiento visual, responsive y de interacción continúa requiriendo QA manual.
