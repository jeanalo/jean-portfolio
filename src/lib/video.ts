// Archivos del video de la sección de intro en public/video/. Se revisan al generar el sitio.
import fs from 'node:fs';
import path from 'node:path';

const dir = path.join(process.cwd(), 'public', 'video');
const has = (file: string) => fs.existsSync(path.join(dir, file));

export const introVideo = {
  src: has('hero.mp4') ? '/video/hero.mp4' : undefined,
  // El póster es un cuadro del propio video
  poster: has('hero-poster.jpg') ? '/video/hero-poster.jpg' : undefined,
  captions: has('hero.vtt') ? '/video/hero.vtt' : undefined,
};

// El clip de baile de Off the clock: mudo y en loop. public/video/offclock-dance.mp4 es el corte final de
// Jean (baile-FINAL-26s.mp4: 848 × 480, 26 s, H.264, ya en blanco y negro, sin audio), copiado sin
// recomprimir, solo con faststart. Su póster, offclock-dance.jpg, es el cuadro del segundo 3,7 (la figura
// entre las piernas), no el primero. Si falta el .mp4, la sección deja su hueco armado (solo en desarrollo).
export const danceClip = {
  src: has('offclock-dance.mp4') ? '/video/offclock-dance.mp4' : undefined,
  poster: has('offclock-dance.jpg') ? '/video/offclock-dance.jpg' : undefined,
};
