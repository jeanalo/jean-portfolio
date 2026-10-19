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
