import fs from 'node:fs';
import path from 'node:path';

// Lee el tamaño real de un PNG o JPEG de /public al generar el sitio.
// Sirve para poner width y height en la etiqueta: el navegador reserva el espacio exacto
// y la página no salta mientras la imagen carga (las imágenes de los casos van con loading lazy).
const cache = new Map<string, { width: number; height: number } | undefined>();

export function imageSize(src: string): { width: number; height: number } | undefined {
  if (cache.has(src)) return cache.get(src);
  let size: { width: number; height: number } | undefined;
  try {
    const file = path.join(process.cwd(), 'public', src.replace(/^\//, ''));
    const b = fs.readFileSync(file);
    if (b.length > 24 && b.readUInt32BE(0) === 0x89504e47) {
      // PNG: el bloque IHDR trae ancho y alto
      size = { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
    } else if (b.length > 4 && b[0] === 0xff && b[1] === 0xd8) {
      // JPEG: se recorren los segmentos hasta el marcador SOF, que trae las medidas
      let i = 2;
      while (i + 9 < b.length) {
        if (b[i] !== 0xff) {
          i++;
          continue;
        }
        const marker = b[i + 1];
        const isSOF = marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;
        if (isSOF) {
          size = { height: b.readUInt16BE(i + 5), width: b.readUInt16BE(i + 7) };
          break;
        }
        if (marker === 0xd8 || (marker >= 0xd0 && marker <= 0xd9)) {
          i += 2;
          continue;
        }
        i += 2 + b.readUInt16BE(i + 2);
      }
    }
  } catch {
    size = undefined;
  }
  cache.set(src, size);
  return size;
}
