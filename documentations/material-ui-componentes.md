# Componentes de Material UI usados
Página oficial: https://mui.com/material-ui/

## Container

**Descripción:** Un componente que limita el ancho del contenido dentro de él y lo centra horizontalmente.

**Parámetros importantes:**
- `maxWidth`: Define el ancho máximo del contenedor (por defecto es `lg`).
- Otros parámetros como `className` para agregar estilos de Tailwind.

## Typography

**Descripción:** Un componente para aplicar estilos tipográficos como encabezados, párrafos, etc.

**Parámetros importantes:**
- `variant`: Define el estilo del texto (ej., `h3`, `body1`).
- `component`: Define el elemento HTML a usar (ej., `h1`, `p`).
- `gutterBottom`: Añade un margen inferior.
- `align`: Define la alineación del texto (ej., `center`).

**Aclaración:** La diferencia entre `variant` y `component` es que el primero es el estilo del texto, lo que incluye el tamaño, mientras que el segundo es cómo se renderizará en el HTML. Entonces yo puedo usar un h3 pero renderizado como h1.

## Box

**Descripción:** Un componente contenedor flexible que puede ser usado para aplicar espaciado, márgenes, bordes, etc.

**Parámetros importantes:**
- `mb`: Define el margen inferior (ej., `mb={4}` para un margen inferior de 4 unidades de espacio).

## Card

**Descripción:** Un contenedor para contenido y acciones sobre un solo tema.

**Parámetros importantes:**
- Se puede usar `className`, `style` para darle estilo.
- Es comun que se use con un CardContent y CardMedia en su interior.

## CardMedia

**Descripción:** Un componente que puede ser usado para mostrar medios, como imágenes, en una tarjeta.

**Parámetros importantes:**
- `component`: Define el tipo de medio (`img` en este caso).
- `alt`: Texto alternativo para la imagen.
- `image`: La fuente de la imagen.
- `title`: Título de la imagen.

## CardContent

**Descripción:** Un contenedor para el contenido textual de una tarjeta.

**Parámetros importantes:**
- No tiene parámetros específicos en este ejemplo, pero puede aceptar `className`, `style`, entre otros.
