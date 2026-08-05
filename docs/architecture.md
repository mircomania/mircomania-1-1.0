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
│   ├──api/
│   │  └──contact/
│   │     └──route.ts
│   │
│   ├── globals.css
│   ├── icon.svg
│   ├── layout.tsx
│   └── page.tsx
│
├── assets/
│   ├──icons/
│   │  ├── Arrow.tsx
│   │  ├── Logo.tsx
│   │  ├── Menu.tsx
│   │  ├── Spinner.tsx
│   │  └── Star.tsx
│   │
│   └──images/
│
├── components/
│   ├── common/
│   │   ├── footer/
│   │   │
│   │   └── navbar/
│   │       ├── BurgerMenu.tsx
│   │       ├── navbar.module.css
│   │       ├── Navbar.tsx
│   │       ├── navbarMenu.ts
│   │       └── NavItems.tsx
│   │
│   └── exports/
│       ├── form/
│       │   ├── contactForm.module.css.tsx
│       │   ├── ContactForm.tsx
│       │   ├── ContactFormStatus.tsx
│       │   ├── pushContactFormEvent.ts
│       │   └── validateContact.ts
│       │
│       └── home/
│           ├── home1/
│           │   ├── home1.module.css
│           │   └── Home1.tsx
│           │
│           ├── home2/
│           │   ├── home2.module.css
│           │   ├── Home2.tsx
│           │   ├── stars.ts
│           │   └── useConstellation.ts
│           │
│           ├── home3/
│           │   ├── home3.module.css
│           │   ├── Home3.tsx
│           │   ├── MobileProjectsStack.tsx
│           │   └── ProjectCard.tsx
│           │
│           ├── home4/
│           │   ├── home4.module.css
│           │   └── Home4.tsx
│           │
│           └── home5/
│               ├── DesktopParticlePlanet.tsx
│               ├── home5.module.css
│               ├── Home5.tsx
│               ├── particlePlanet.module.css
│               └── ParticlePlanet.tsx
│
├── hooks/
│   ├── useBurgerMenu.ts
│   ├── useContactForm.ts
│   ├── useMediaQuery.tsx
│   └── useNavbarScroll.tsx
│
├── lib/
│   └──supabase/
│      ├── admin.ts
│      ├── getPublicMediaUrl.tsx
│      └── server.ts
│
├── services/
│   ├──contacts/
│   │  ├── createContacts.ts
│   │  └── submitContact.ts
│   │
│   └──proyects/
│      ├── getFeaturedProjects.ts
│      └── getProjectCover.ts
│
├── styles/
│
├── types/
│   ├── contact.ts
│   ├── global.d.ts
│   ├── navigation.tsx
│   └── projects.tsx
│
├── utils/
│   ├── starryBackground/
│   │   ├── starryBackground.module.css
│   │   └── StarryBackground.tsx
│   │
│   ├── ButtonLink.tsx
│   ├── getUtmParams.ts
│   └── SmartLink.tsx
```

---

## Responsabilidades

### app/

Contiene las rutas de Next.js, APIs, layouts y páginas.

---

### components/

Componentes reutilizables de la aplicación.

Se dividen en:

- common
- exports

---

### hooks/

Toda la lógica reutilizable.

No deben renderizar UI en caso de no ser necesario.

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
- buttons.css
- spinner.css
- background.css
- common.css
- navbar.css
- utils.css

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
