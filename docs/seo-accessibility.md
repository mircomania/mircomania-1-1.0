# SEO & Accessibility

## SEO

El sitio debe seguir las mejores prácticas modernas de SEO.

### Metadata

- Metadata API de Next.js.
- Titles únicos.
- Descriptions únicas.
- Open Graph.
- Twitter Cards.

---

### Contenido

- Un único H1 por página.
- Jerarquía correcta de headings.
- Contenido semántico.
- URLs limpias.

---

### Rendimiento

- Server Side Rendering.
- Next Image.
- Lazy Loading.
- Optimización de imágenes.
- Código dividido automáticamente.

---

### Imágenes

Todas las imágenes deben incluir:

- alt
- width
- height

---

### Accesibilidad

Todo elemento interactivo debe ser accesible mediante teclado.

Evitar:

```
div onClick
```

Preferir:

```
button
```

---

### Navegación

- Tab
- Shift + Tab
- Enter
- Space

deben funcionar correctamente.

---

### ARIA

Utilizar cuando aporte información adicional.

Ejemplos:

- aria-label
- aria-labelledby
- aria-hidden

No abusar de atributos ARIA cuando HTML semántico sea suficiente.

---

### Movimiento

Todas las animaciones deben respetar

```
prefers-reduced-motion
```

---

### Contraste

Mantener contraste suficiente entre texto y fondo.

---

### HTML Semántico

Preferir:

- header
- nav
- main
- section
- article
- footer
- button

antes que div genéricos.

---

### Lighthouse

Objetivos mínimos:

- Performance > 95
- Accessibility 100
- Best Practices 100
- SEO 100
