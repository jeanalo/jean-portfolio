import { getCollection } from 'astro:content';

const PENDING = '[PENDIENTE]';

// En producción no salen los casos en borrador ni el contenido pendiente.
export const showPending = !import.meta.env.PROD;

export async function getProjects() {
  const all = await getCollection('projects', (p) => showPending || !p.data.draft);
  return all.sort((a, b) => a.data.order - b.data.order);
}

// Para el home: también los borradores, que en producción salen como filas sin enlace.
export async function getAllProjects() {
  const all = await getCollection('projects');
  return all.sort((a, b) => a.data.order - b.data.order);
}

export const pad = (n: number) => String(n).padStart(2, '0');

// El año que se muestra en filas y etiquetas: el rango de una selección gana sobre un año suelto.
export const yearLabel = (d: { year?: number; years?: string }) => d.years ?? d.year;

export type Paragraph = { pending: boolean; text: string; lead?: string };

// Un párrafo que empieza con **Algo.** saca ese rótulo a la columna de la izquierda del caso,
// al lado de su texto. Sirve para una sección que es una lista de puntos (Color, Type, Icons…).
const LEAD = /^\*\*(.+?)\*\*\s+/;

export function paragraphs(text: string): Paragraph[] {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => {
      if (p.startsWith(PENDING)) return { pending: true, text: p.slice(PENDING.length).trim() };
      const m = p.match(LEAD);
      // El punto cierra la frase, no el rótulo: en mayúsculas sobraría
      return m
        ? { pending: false, text: p.slice(m[0].length), lead: m[1].replace(/\.$/, '') }
        : { pending: false, text: p };
    })
    .filter((p) => showPending || !p.pending);
}
