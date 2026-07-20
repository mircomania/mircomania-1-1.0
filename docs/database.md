# Base de Datos

## Proveedor

Supabase

---

## Storage

### Buckets

project-media

Descripción:

Imágenes y videos de proyectos.

---

## Tablas

### projects

Descripción

Información principal de cada proyecto.

Campos

- id
- slug
- title
- summary
- description
- role
- client
- project_year
- stack
- featured
- featured_order
- status
- demo_url
- repository_url

Relaciones

projects
↓
project_media

---

### project_media

Descripción

Archivos multimedia asociados a cada proyecto.

Campos

- id
- project_id
- storage_path
- poster_path
- alt_text
- caption
- width
- height
- media_type
- variant
- sort_order
- is_cover

---

### contacts

Estado:
🚧 Pendiente

Descripción

Mensajes enviados desde el formulario de contacto.

---

### services

Estado:
🚧 Pendiente

---

### faq

Estado:
🚧 Pendiente

---

## Relaciones

projects

↓

project_media

---

## Convenciones

Slug

kebab-case

---

Storage

proyecto/archivo.webp

Ejemplo

method-lab/cover-desktop.webp
method-lab/cover-movile.webp

---

## Consultas principales

### Obtener proyectos destacados

- ***

### Obtener proyecto por slug

- ***

### Obtener media de un proyecto

- ***

## Seguridad

- Row Level Security
- Buckets públicos únicamente para lectura
- Escritura restringida

---

## Pendientes

-

-

-
