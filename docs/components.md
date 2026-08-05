# Componentes

Este documento describe todos los componentes, hooks y servicios principales del proyecto.

---

# Global

## globals.css

Estado:

- ✅

Responsabilidad:

Contiene los estilos globales del proyecto importados como modulos.

Incluye:

- Reset CSS.
- Scrollbar.
- Autofill.
- Fondo principal.
- Variables globales.
- Responsive global.

---

# Hooks

## useMediaQuery.tsx

Estado:

- ✅

Responsabilidad:

Detectar Media Queries utilizando useSyncExternalStore para mantener compatibilidad con SSR y evitar renderizados innecesarios.

---

## useContactForm.ts

Estado:

- ✅

Responsabilidad:

Maneja toda la logica del formulario de contacto, datos inciales, validacion de inputs y envio del formulario.

---

## useBurgerMenu.ts

Estado:

- ✅

Responsabilidad:

Maneja toda la logica del burger menu.

---

## useNavbarScroll.ts

Estado:

- ✅

Responsabilidad:

Maneja la transicion del navbar cuando se hace scroll, se maneja en 3 etapas.

---

# Lib

## server.ts

Estado:

- ✅

Responsabilidad:

Inicializa el cliente de Supabase.

Gestiona las variables de entorno publicas.

---

## admin.ts

Estado:

- ✅

Responsabilidad:

Inicializa el cliente de Supabase.

Gestiona las variables de entorno privadas.

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

## createContact.ts

Estado:

- ✅

Responsabilidad:

Arma los datos del formulario de contacto antes de enviarlos a supabase.

---

## submitContact.ts

Estado:

- ✅

Responsabilidad:

Encargado de enviar los datos del formulario de contacto recopilados en createContact a supabase.

---

# Utils

## ButtonLink.tsx

Estado:

- ✅

Responsabilidad:

Componente reutilizable para links que navegen fuera del sitio web.

---

## SmartLink.tsx

Estado:

- ✅

Responsabilidad:

Componente reutilizable para links que navegen dentro del sitio web, ya sean rutas o anclas.

---

## getUtmParams.ts

Estado:

- ✅

Responsabilidad:

Obtiene los utm de la url en caso de exisitir y los almacena en local storage, para ser datos utiles en la analitica del form.

---

## pushContactFormEvent.ts

Estado:

- ✅

Responsabilidad:

Crea y envia el evento "send_form" cuando se envia un form, creado para GTM.

---

## validateContacts.ts

Estado:

- ✅

Responsabilidad:

Validacion frotend para los inputs del formulario.

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

- ✅

Proyectos destacados.

---

## Home4

Estado:

- ✅

CV.

---

---

## Home5

Estado:

- ✅

Form.

---

# Contacto

## Contacto1

Estado:

- 🚧

Form.

---

# Componentes futuros

- 🚧

-

-
