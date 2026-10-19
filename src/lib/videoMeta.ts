import fs from 'node:fs';
import path from 'node:path';

// Lee la duración y el formato reales de un .mp4 de /public al generar el sitio, como imageSize.ts
// con las imágenes: la ficha nunca dice una duración o un formato que el archivo no tiene.
// Recorre las cajas del MP4 sin cargar el video: mvhd trae la duración y el tkhd de la pista de
// video trae el ancho, el alto y la matriz (un video rotado 90° intercambia ancho y alto).
export type VideoMeta = {
  seconds: number;
  duration: string; // 1:14
  iso: string; // PT1M14S
  width: number;
  height: number;
  ratio: string; // 16:9
  orientation: 'Horizontal' | 'Vertical' | 'Square';
};

const CONTAINERS = new Set(['moov', 'trak', 'mdia']);

type Box = { type: string; start: number; size: number; header: number };

function readBoxes(fd: number, from: number, to: number): Box[] {
  const boxes: Box[] = [];
  const head = Buffer.alloc(16);
  let pos = from;
  while (pos + 8 <= to) {
    fs.readSync(fd, head, 0, 16, pos);
    let size = head.readUInt32BE(0);
    const type = head.toString('latin1', 4, 8);
    let header = 8;
    if (size === 1) {
      size = Number(head.readBigUInt64BE(8));
      header = 16;
    } else if (size === 0) {
      size = to - pos;
    }
    if (size < header) break;
    boxes.push({ type, start: pos, size, header });
    pos += size;
  }
  return boxes;
}

const read = (fd: number, box: Box) => {
  const b = Buffer.alloc(box.size - box.header);
  fs.readSync(fd, b, 0, b.length, box.start + box.header);
  return b;
};

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);

export function formatDuration(seconds: number) {
  const s = Math.round(seconds);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

const cache = new Map<string, VideoMeta | undefined>();

export function videoMeta(src: string): VideoMeta | undefined {
  if (cache.has(src)) return cache.get(src);
  let meta: VideoMeta | undefined;
  let fd: number | undefined;
  try {
    const file = path.join(process.cwd(), 'public', src.replace(/^\//, ''));
    fd = fs.openSync(file, 'r');
    const end = fs.fstatSync(fd).size;
    const moov = readBoxes(fd, 0, end).find((b) => b.type === 'moov');
    if (!moov) throw new Error('sin moov');

    let seconds = 0;
    let width = 0;
    let height = 0;
    for (const box of readBoxes(fd, moov.start + moov.header, moov.start + moov.size)) {
      if (box.type === 'mvhd') {
        const b = read(fd, box);
        const v1 = b[0] === 1;
        const timescale = b.readUInt32BE(v1 ? 20 : 12);
        const duration = v1 ? Number(b.readBigUInt64BE(24)) : b.readUInt32BE(16);
        seconds = duration / timescale;
      }
      if (box.type === 'trak') {
        const kids = readBoxes(fd, box.start + box.header, box.start + box.size);
        const mdia = kids.find((k) => k.type === 'mdia');
        const hdlr = mdia && readBoxes(fd, mdia.start + mdia.header, mdia.start + mdia.size).find((k) => k.type === 'hdlr');
        if (!hdlr || read(fd, hdlr).toString('latin1', 8, 12) !== 'vide') continue;
        const tkhd = kids.find((k) => k.type === 'tkhd');
        if (!tkhd) continue;
        const b = read(fd, tkhd);
        const v1 = b[0] === 1;
        const m = v1 ? 52 : 40; // la matriz de 3 × 3
        const w = b.readUInt32BE(m + 36) / 65536;
        const h = b.readUInt32BE(m + 40) / 65536;
        const turned = b.readInt32BE(m) === 0 && b.readInt32BE(m + 16) === 0;
        width = Math.round(turned ? h : w);
        height = Math.round(turned ? w : h);
      }
    }
    if (!seconds || !width || !height) throw new Error('sin duración o sin pista de video');

    const k = gcd(width, height);
    const s = Math.round(seconds);
    meta = {
      seconds,
      duration: formatDuration(seconds),
      iso: `PT${Math.floor(s / 60)}M${s % 60}S`,
      width,
      height,
      ratio: `${width / k}:${height / k}`,
      orientation: width > height ? 'Horizontal' : width < height ? 'Vertical' : 'Square',
    };
  } catch {
    meta = undefined;
  } finally {
    if (fd !== undefined) fs.closeSync(fd);
  }
  cache.set(src, meta);
  return meta;
}
