# Mircomania

Portfolio profesional de Mircomania para presentar servicios, proyectos destacados, experiencia y vías de contacto. La aplicación está construida con Next.js App Router, React, TypeScript y Supabase.

## Funcionalidades actuales

- Inicio con secciones de servicios, proyectos obtenidos desde Supabase, acceso al CV y formulario de contacto.
- Páginas de contacto y política de privacidad.
- Formulario con validación compartida entre cliente y servidor, honeypot, atribución UTM y evento `send_form` para Google Tag Manager.
- Metadatos por página, imágenes Open Graph/Twitter, `robots.txt`, `sitemap.xml` y página 404.
- Navegación responsive, constelación interactiva, mazo móvil de proyectos y planeta de partículas en canvas para escritorio.

## Rutas

| Ruta | Contenido |
| --- | --- |
| `/` | Inicio y secciones `#servicios`, `#proyectos` y `#cv` |
| `/contacto` | Formulario de contacto |
| `/politica-privacidad` | Política de privacidad |
| `/api/contact` | Route Handler `POST` para registrar mensajes |

## Requisitos y configuración

El repositorio incluye `package-lock.json` y usa scripts npm. La versión de Node.js no está fijada en el proyecto.

1. Instala las dependencias:

   ```bash
   npm ci
   ```

2. Crea `.env.local` con las variables que consume el código:

   ```dotenv
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
   SUPABASE_SECRET_KEY=
   NEXT_PUBLIC_GTM_ID=
   ```

   `SUPABASE_SECRET_KEY` se usa únicamente en código marcado como `server-only`. No debe exponerse al cliente.

3. Inicia el entorno de desarrollo:

   ```bash
   npm run dev
   ```

La aplicación queda disponible en `http://localhost:3000`.

## Scripts

| Comando | Acción |
| --- | --- |
| `npm run dev` | Inicia Next.js en desarrollo |
| `npm run build` | Genera el build de producción |
| `npm run start` | Sirve el build de producción |
| `npm run lint` | Ejecuta ESLint |

`next.config.ts` genera salida `standalone` y permite optimizar las imágenes del bucket público `project-media` del proyecto Supabase configurado.

## Documentación

- [Arquitectura](docs/architecture.md)
- [Stack](docs/stack.md)
- [Componentes](docs/components.md)
- [Base de datos](docs/database.md)
- [Estilo de código](docs/coding-style.md)
- [Sistema de diseño](docs/design-system.md)
- [SEO y accesibilidad](docs/seo-accessibility.md)
