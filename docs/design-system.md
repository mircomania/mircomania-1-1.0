# Design System

## Filosofía visual

El sitio busca transmitir una imagen tecnológica, elegante y minimalista.

Toda la experiencia gira en torno a la temática del espacio exterior, utilizando un cielo nocturno como escenario principal.

La prioridad es generar una experiencia limpia, inmersiva y moderna sin sobrecargar la interfaz con efectos innecesarios.

---

## Colores

### Base

```css
--color-white
--color-black
--color-dark

--color-space-dark
--color-space-blue
```

---

### Texto

```css
--text-primary
--text-secondary
--text-muted
```

---

### Estrellas

```css
--star-core
--star-glow-soft
--star-glow-strong
```

---

### Constelaciones

```css
--constellation-line
--constellation-glow
```

---

### Sombras

```css
--text-glow-soft
--space-glow-blue
```

---

## Tipografía

### Títulos

Montserrat

Uso:

- H1
- H2
- títulos importantes

---

### Texto

Inter

Uso:

- párrafos
- botones
- formularios

---

### Tipografía espacial

Space Grotesk

Uso:

- elementos decorativos
- constelaciones
- etiquetas especiales

---

## Estilo general

- Mucho espacio en blanco.
- Animaciones suaves.
- Fondos oscuros.
- Iluminación sutil.
- Glassmorphism únicamente cuando aporte valor.
- Evitar colores saturados.
- Evitar sombras exageradas.

---

## Responsive

Siempre Mobile First.

Desktop adapta el layout pero mantiene la misma identidad visual.

---

## Animaciones

Las animaciones deben:

- aportar información
- mejorar la navegación
- nunca distraer

Siempre respetar:

```
prefers-reduced-motion
```
