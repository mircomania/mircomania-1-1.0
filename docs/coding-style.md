# Coding Style

## Filosofía

El código debe priorizar la claridad por sobre la complejidad.

Siempre es preferible escribir código fácil de entender que una solución demasiado ingeniosa.

---

## TypeScript

- Nunca utilizar any.
- Preferir type antes que interface.
- Tipar todas las funciones.
- Tipar props y retornos.

---

## React

- Componentes pequeños.
- Una responsabilidad por componente.
- No utilizar React.FC.
- Extraer lógica compleja a hooks.
- Evitar estados innecesarios.
- Preferir composición antes que componentes gigantes.

---

## Next.js

- Server Components por defecto.
- Client Components únicamente cuando sean necesarios.
- Obtener datos desde Server Components siempre que sea posible.
- Mantener page.tsx limpio.

---

## CSS

- CSS Modules.
- Mobile First.
- Variables CSS para todos los colores reutilizables.
- Evitar valores mágicos repetidos.
- Agrupar estilos relacionados.

---

## Imports

Orden recomendado:

1. React / Next
2. Librerías
3. Components
4. Hooks
5. Services
6. Types
7. Styles

---

## Arquitectura

- Separación por responsabilidades.
- Componentes reutilizables.
- Hooks reutilizables.
- Services para acceso a datos.
- Types centralizados.

---

## Dependencias

Antes de instalar una librería preguntarse:

- ¿Existe una API nativa?
- ¿Realmente aporta valor?
- ¿Vale el peso adicional?

---

## Convenciones

- Variables descriptivas.
- Funciones descriptivas.
- Componentes en PascalCase.
- Hooks con prefijo use.
- Evitar comentarios innecesarios.
- Código autoexplicativo siempre que sea posible.
