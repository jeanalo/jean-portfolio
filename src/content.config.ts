import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Imagen dentro de una sección. Sin `src` se muestra un bloque Klein con su etiqueta de pendiente.
// layout: full (todo el ancho), 8/4 o 7/5 (imagen a la izquierda, pie de foto a la derecha).
const media = z.object({
  src: z.string().optional(), // ruta dentro de /public
  alt: z.string().optional(),
  caption: z.string().optional(),
  layout: z.enum(['full', '8/4', '7/5']).default('full'),
  // Por defecto las imágenes van en blanco y negro (fotografía). Las de trabajo de diseño
  // (pantallas, páginas de manual donde el color es el contenido) van a color.
  color: z.boolean().default(false),
  // Del wireframe a la final, arrastrando (WireCompare.astro): las pantallas en fila, cada una con su
  // wireframe calcado debajo. Reemplaza a `src`. Los dos archivos de cada pantalla miden lo mismo.
  screens: z.array(z.object({ name: z.string(), wire: z.string(), final: z.string() })).optional(),
});

const section = z.object({
  text: z.string(),
  media: z.array(media).default([]),
});

// Una sección acepta texto suelto o un objeto { text, media }.
const sectionField = z
  .union([z.string(), section])
  .transform((v) => (typeof v === 'string' ? { text: v, media: [] } : v));

// Una pieza de video de una selección (perfil C de PEDIR-INFO-PROYECTOS.md): video incrustado y ficha corta.
// La duración y el formato no se escriben: se leen del archivo al generar el sitio (src/lib/videoMeta.ts).
const piece = z.object({
  title: z.string(),
  accent: z.string().optional(), // segunda parte del título en itálica fina, por ejemplo "dubbing exercise"
  client: z.string(),
  type: z.enum(['Educational', 'Institutional', 'UGC', 'Promo', 'Event', 'Personal']),
  year: z.number(),
  role: z.string(),
  language: z.string(),
  purpose: z.string(), // para qué se hizo
  standout: z.string(), // qué tiene de particular
  video: z.string(), // ruta dentro de /public, .mp4 H.264 con faststart
  poster: z.string(), // un cuadro fuerte del propio video, a su tamaño original
  note: z.string().optional(), // nota de derechos o de créditos, en chico bajo el video
});

// El producto real incrustado: la app desplegada, en un marco de teléfono que se puede usar ahí mismo.
// Va justo después de la portada. El sitio embebido tiene que permitir iframes (sin X-Frame-Options).
const embed = z.object({
  src: z.string().url(),
  title: z.string(), // nombre accesible del iframe
  boxed: z.string(), // palabra del titular en la caja azul
  accent: z.string(), // palabra en itálica fina al lado
  text: z.string(), // cómo entrar y qué probar; párrafos separados por una línea en blanco
  width: z.number().default(390), // tamaño lógico del teléfono en el que se dibuja la app
  height: z.number().default(844),
});

// El prototipo de Figma incrustado, cuando la app real no se puede abrir (pide cuenta). Una vista por
// dispositivo (escritorio, móvil), lado a lado. `mobile: true` marca la vista que va primero en teléfonos.
const prototype = z.object({
  boxed: z.string(),
  accent: z.string(),
  text: z.string(),
  link: z.string().url().optional(), // abrir el prototipo en otra pestaña
  views: z.array(
    z.object({
      label: z.string(),
      src: z.string().url(),
      ratio: z.string(), // proporción del marco, por ejemplo "16 / 10"
      mobile: z.boolean().default(false),
      link: z.string().url().optional(), // abrir esta vista en Figma; sin él, se arma desde `src`
    }),
  ),
});

// Cifras de investigación y pruebas: el número grande sobre su etiqueta, como la hoja de datos de About.
const figures = z.object({
  title: z.string(),
  items: z.array(z.object({ value: z.string(), label: z.string() })),
});

// Una banda propia para la pieza que diferencia el caso (en Mentta, el sensor físico):
// fotos en blanco y negro, el texto y el recorrido de los datos paso a paso.
const spotlight = z.object({
  after: z.enum(['problem', 'role', 'process', 'decisions', 'result']), // va después de esa sección
  title: z.string(),
  text: z.string(),
  steps: z.array(z.string()).default([]),
  // Un primer plano del objeto en su lugar real (en Mentta, el sensor frente al mostrador): va grande, al
  // lado del recorrido de los datos. Es la prueba de que existe.
  // `color`: una pantalla de interfaz, entera y a color, en vez de una foto en blanco y negro.
  detail: z
    .object({ src: z.string(), alt: z.string(), caption: z.string().optional(), color: z.boolean().default(false) })
    .optional(),
  photos: z.array(z.object({ src: z.string(), alt: z.string() })).default([]),
  caption: z.string().optional(),
});

// Cada caso de estudio es un archivo .md en src/content/projects/.
// Los textos de cada sección van en el frontmatter; los párrafos se separan con una línea en blanco.
// Un párrafo que empieza con [PENDIENTE] se muestra como "■ Pending" y no sale en producción.
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    shortTitle: z.string().optional(), // nombre corto de una línea para las filas de trabajo
    boxed: z.string().optional(), // palabra del título que va en la caja azul; por defecto la última
    accent: z.string().optional(), // palabra en itálica fina que acompaña el título
    client: z.string().optional(),
    location: z.string().optional(),
    deliverables: z.array(z.string()).default([]),
    year: z.number().optional(),
    years: z.string().optional(), // rango de una selección, por ejemplo "2024 to 2026"; gana sobre `year`
    role: z.string().optional(),
    tools: z.array(z.string()).default([]),
    disciplines: z.array(z.string()).default([]),
    summary: z.string(), // puede empezar con [PENDIENTE]
    cover: z.string().optional(), // ruta dentro de /public, por ejemplo /work/global-virtuoso/cover.jpg
    coverColor: z.boolean().default(false), // la portada va a color (trabajo de diseño, no fotografía)
    // La imagen con la que abre la página del caso, cuando no es la portada del home (la portada es un
    // póster con el título, y repetirlo debajo del H1 sería redundante).
    opening: z.string().optional(),
    // Comparación antes/después en la apertura del caso. Si está, reemplaza la portada.
    compare: z
      .object({
        before: z.string(),
        beforeLabel: z.string(),
        after: z.string(),
        afterLabel: z.string(),
        note: z.string(),
      })
      .optional(),
    order: z.number().default(99),
    draft: z.boolean().default(false), // true: el caso no se publica en producción
    // Una selección de video no es un caso largo: lleva piezas y puede no tener secciones.
    pieces: z.array(piece).default([]),
    team: z.string().optional(), // tamaño del equipo, por ejemplo "4 people"
    repo: z.string().url().optional(), // repositorio público del código; sale como "Code" en la columna de datos
    embed: embed.optional(),
    prototype: prototype.optional(),
    figures: figures.optional(),
    spotlight: spotlight.optional(),
    sections: z
      .object({
        problem: sectionField,
        role: sectionField,
        process: sectionField,
        decisions: sectionField,
        result: sectionField,
      })
      .partial()
      .default({}),
  }),
});

export const collections = { projects };
