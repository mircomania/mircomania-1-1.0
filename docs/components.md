# Componentes

Este documento describe todos los componentes, hooks y servicios principales del proyecto.

---

# Global

## globals.css

Estado:

- ✅

Responsabilidad:

Contiene los estilos globales del proyecto.

Incluye:

- Reset CSS.
- Scrollbar.
- Autofill.
- Fondo principal.
- Variables globales.
- Responsive global.

---

# Hooks

## useMediaQuery

Estado:

- ✅

Responsabilidad:

Detectar Media Queries utilizando useSyncExternalStore para mantener compatibilidad con SSR y evitar renderizados innecesarios.

---

# Lib

## server.ts

Estado:

- ✅

Responsabilidad:

Inicializa el cliente de Supabase.

Gestiona las variables de entorno.

---

## getPublicMediaUrl.ts

Estado:

- ✅

Responsabilidad:

Construir la URL pública de un archivo almacenado en Supabase Storage.

---

# Services

## getFeaturedProjects.ts

Estado:

- ✅

Responsabilidad:

Obtener los proyectos destacados desde Supabase junto con toda su información multimedia.

---

## getProjectCover.ts

Estado:

- ✅

Responsabilidad:

Obtener la imagen principal (desktop o mobile) de un proyecto.

---

# Home

## Home1

Estado:

- ✅

Presentación inicial del sitio.

---

## Home2

Estado:

- ✅

Constelación interactiva de servicios.

---

## Home3

Estado:

- 🚧

Proyectos destacados.

---

# Componentes futuros

-

-

-
