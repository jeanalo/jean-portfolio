// Mide el vacío entre el final del contenido de una sección y el comienzo de la siguiente.
// Uso: node scripts/measure-gaps.mjs [url]   (servidor de desarrollo corriendo)
// Mide en 1280 × 529 y 1440 × 900, con movimiento reducido para ver el layout final.
// Objetivo (CLAUDE.md): ningún vacío pasa de un cuarto del alto de la pantalla.
import { spawn } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const url = process.argv[2] || 'http://localhost:4321/';
const chrome = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const probe = `(() => {
  const sections = [...document.querySelectorAll('main > section, body > footer')];
  // El campo Klein cuenta como contenido: es color, no hueco
  const skip = '.ghost, .strap, dialog, .sr-only, .skip';
  const extent = (sec) => {
    let top = Infinity, bottom = -Infinity;
    // Si la sección recorta su contenido (la cinta del video), solo cuenta lo que se ve
    const box = sec.getBoundingClientRect();
    const clips = ['clip', 'hidden'].includes(getComputedStyle(sec).overflowY);
    sec.querySelectorAll('*').forEach((el) => {
      if (el.closest(skip)) return;
      const leaf = el.children.length === 0 || ['IMG', 'SVG', 'VIDEO', 'BUTTON'].includes(el.tagName.toUpperCase());
      if (!leaf) return;
      const r = el.getBoundingClientRect();
      if (r.width < 1 || r.height < 1) return;
      if (getComputedStyle(el).visibility === 'hidden') return;
      top = Math.min(top, (clips ? Math.max(r.top, box.top) : r.top) + scrollY);
      bottom = Math.max(bottom, (clips ? Math.min(r.bottom, box.bottom) : r.bottom) + scrollY);
    });
    return { top, bottom };
  };
  const name = (s) => s.id || s.className.split(' ').find((c) => !c.startsWith('astro')) || s.tagName;
  const ext = sections.map(extent);
  return sections.slice(1).map((s, i) => ({
    from: name(sections[i]),
    to: name(s),
    gap: Math.round(ext[i + 1].top - ext[i].bottom),
    limit: Math.round(innerHeight / 4),
  }));
})()`;

for (const [width, height] of [[1280, 529], [1440, 900]]) {
  const port = 9400 + Math.floor(Math.random() * 400);
  const proc = spawn(chrome, ['--headless=new', `--remote-debugging-port=${port}`,
    `--user-data-dir=${mkdtempSync(join(tmpdir(), 'gap-'))}`, '--hide-scrollbars', `--window-size=${width},${height}`, 'about:blank'], { stdio: 'ignore' });
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
  await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false });
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await send('Page.navigate', { url });
  await sleep(2500);
  const r = await send('Runtime.evaluate', { expression: probe, returnByValue: true });
  console.log(`\n${width} × ${height}`);
  for (const g of r.result.result.value) console.log(`  ${g.from} → ${g.to}: ${g.gap}px (límite ${g.limit}px) ${g.gap <= g.limit ? 'ok' : 'PASA'}`);
  ws.close(); proc.kill();
}
process.exit(0);
