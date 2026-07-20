# Arquitectura

## Filosofía

El proyecto sigue una arquitectura simple, escalable y mantenible.

Cada archivo debe tener una única responsabilidad y una estructura predecible para facilitar el mantenimiento a largo plazo.

---

## Estructura

```
src/
│
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
│
├── assets/
│
├── components/
│   ├── common/
│   ├── exports/
│   │   └── home/
│   └── utils/
│
├── hooks/
│
├── lib/
│
├── services/
│
├── styles/
│
├── types/
│
└── utils/
```

---

## Responsabilidades

### app/

Contiene las rutas de Next.js, layouts y páginas.

---

### components/

Componentes reutilizables de la aplicación.

Se dividen en:

- common
- exports
- utils

---

### hooks/

Toda la lógica reutilizable.

No deben renderizar UI.

---

### services/

Comunicación con APIs, Supabase o cualquier fuente de datos.

Los componentes nunca consultan directamente la base de datos.

---

### lib/

Configuraciones y clientes compartidos.

Ejemplo:

- Supabase
- Helpers

---

### styles/

Variables globales.

- colors.css
- fonts.css

---

### types/

Todos los tipos compartidos del proyecto.

---

## Flujo de datos

```
Page (Server Component)

↓

Service

↓

Supabase

↓

Page

↓

Componentes
```

Los datos se obtienen en Server Components siempre que sea posible.

Los Client Components reciben únicamente las props necesarias.

---

## Organización

- Mobile First.
- Componentes pequeños.
- Responsabilidad única.
- Lógica desacoplada.
- CSS Modules.
- Sin dependencias innecesarias.
