// Busca los vacíos negros dentro de la grilla: los rectángulos más grandes sin contenido que quedan
// entre bloques (al lado de una columna corta, debajo de un texto que termina antes que su imagen).
// No cuenta los márgenes de la página ni el aire que separa secciones (eso lo mide measure-gaps.mjs).
//
//   node scripts/measure-voids.mjs [url] [ancho]x[alto]
//
// Contenido = líneas de texto, imágenes, video, iframes, SVG y cualquier caja con fondo propio (un
// bloque Klein no es vacío). Se mide con movimiento reducido, el layout final. Imprime los vacíos de
// más de un sexto del alto de la pantalla, del más grande al más chico.
import { spawn } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const url = process.argv[2] || 'http://localhost:4321/';
const [width, height] = (process.argv[3] || '1440x900').split('x').map(Number);
const chrome = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const probe = `(() => {
  const boxes = [];
  const add = (r, why) => { if (r.width >= 2 && r.height >= 2) boxes.push([r.left, r.top + scrollY, r.right, r.bottom + scrollY, why]); };
  const page = getComputedStyle(document.body).backgroundColor;
  const skip = (el) => el.closest('.ghost, .grain, .sr-only, .skip, [aria-hidden="true"].strap, dialog') ;
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const t = walker.currentNode;
    if (!t.textContent.trim() || !t.parentElement || skip(t.parentElement)) continue;
    const cs = getComputedStyle(t.parentElement);
    if (cs.visibility === 'hidden' || cs.opacity === '0') continue;
    const range = document.createRange();
    range.selectNodeContents(t);
    for (const r of range.getClientRects()) add(r, 'text');
  }
  document.querySelectorAll('img, video, iframe, svg, canvas, picture, [data-surface]').forEach((el) => {
    if (skip(el)) return;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden') return;
    add(el.getBoundingClientRect(), el.tagName.toLowerCase());
  });
  document.querySelectorAll('body *').forEach((el) => {
    if (skip(el)) return;
    const cs = getComputedStyle(el);
    const bg = cs.backgroundColor;
    if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent' && bg !== page) add(el.getBoundingClientRect(), 'block');
  });
  const margin = parseFloat(getComputedStyle(document.querySelector('.wrap') || document.body).paddingLeft) || 0;
  // Los titulares, para decir en qué sección cae cada vacío
  const heads = [...document.querySelectorAll('h1, h2, .label.heading, .next-label, footer')].map((h) => [h.getBoundingClientRect().top + scrollY, (h.textContent || h.tagName).trim().replace(/\\s+/g, ' ').slice(0, 28)]);
  return { boxes, heads, docH: document.documentElement.scrollHeight, margin, vw: document.documentElement.clientWidth };
})()`;

const port = 9400 + Math.floor(Math.random() * 400);
const proc = spawn(chrome, ['--headless=new', `--remote-debugging-port=${port}`,
  `--user-data-dir=${mkdtempSync(join(tmpdir(), 'void-'))}`, '--hide-scrollbars', `--window-size=${width},${height}`, 'about:blank'], { stdio: 'ignore' });
let wsUrl;
for (let i = 0; i < 60 && !wsUrl; i++) {
  try { wsUrl = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find((t) => t.type === 'page')?.webSocketDebuggerUrl; } catch {}
  if (!wsUrl) await sleep(200);
}
const ws = new WebSocket(wsUrl);
await new Promise((r) => (ws.onopen = r));
let id = 0; const pending = new Map();
ws.onmessage = (m) => { const msg = JSON.parse(m.data); if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id); } };
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width <= 760 });
await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
await send('Page.enable');
await send('Page.navigate', { url });
await sleep(3500);
const res = await send('Runtime.evaluate', { expression: probe, returnByValue: true });
const { boxes, heads, docH, margin, vw } = res.result.result.value;
const where = (y) => (heads.filter(([t]) => t <= y + 40).pop() || [0, 'arriba'])[1];
ws.close();
proc.kill();

// Rejilla de celdas de 8 px: ocupada si la toca algún contenido
const cell = 8;
const cols = Math.ceil(vw / cell);
const rows = Math.ceil(docH / cell);
const occ = Array.from({ length: rows }, () => new Uint8Array(cols));
for (const [l, t, r, b] of boxes) {
  for (let y = Math.max(0, Math.floor(t / cell)); y < Math.min(rows, Math.ceil(b / cell)); y++)
    for (let x = Math.max(0, Math.floor(l / cell)); x < Math.min(cols, Math.ceil(r / cell)); x++) occ[y][x] = 1;
}
// Solo dentro de la grilla (sin los márgenes)
const x0 = Math.ceil(margin / cell);
const x1 = Math.floor((vw - margin) / cell);
// Un vacío cuenta si tiene contenido al lado (izquierda o derecha) en su franja: así no se mide el aire
// entre secciones, que va de borde a borde.
const found = [];
const used = Array.from({ length: rows }, () => new Uint8Array(cols));
for (let pass = 0; pass < 12; pass++) {
  // Rectángulo vacío máximo (histogramas por fila)
  const h = new Int32Array(cols);
  let best = { area: 0 };
  for (let y = 0; y < rows; y++) {
    for (let x = x0; x < x1; x++) h[x] = occ[y][x] || used[y][x] ? 0 : h[x] + 1;
    const stack = [];
    for (let x = x0; x <= x1; x++) {
      const cur = x === x1 ? 0 : h[x];
      let start = x;
      while (stack.length && stack[stack.length - 1][1] >= cur) {
        const [sx, sh] = stack.pop();
        const w = x - sx;
        const area = w * sh;
        if (area > best.area && w < (x1 - x0) - 2) best = { area, x: sx, y: y - sh + 1, w, h: sh };
        start = sx;
      }
      stack.push([start, cur]);
    }
  }
  if (!best.area) break;
  const px = { x: best.x * cell, y: best.y * cell, w: best.w * cell, h: best.h * cell };
  for (let y = best.y; y < best.y + best.h; y++) for (let x = best.x; x < best.x + best.w; x++) used[y][x] = 1;
  if (px.h >= height / 6 && px.w >= 160) found.push(px);
}
console.log(`${url} ${width} × ${height} (pantalla/6 = ${Math.round(height / 6)} px)`);
found.sort((a, b) => b.w * b.h - a.w * a.h).forEach((v) =>
  console.log(`  vacío ${v.w} × ${v.h} px en x ${v.x}, y ${v.y}  (${(v.h / height).toFixed(2)} pantallas de alto, ${Math.round((v.w / (vw - 2 * margin)) * 12)} columnas)  ← ${where(v.y)}`),
);
