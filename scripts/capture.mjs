// Capturas de revisión con Chrome headless (sin dependencias). Ver la sección "Revisión" de CLAUDE.md.
//
//   node scripts/capture.mjs
//     desktop.png (1440, página completa) y mobile.png (390, página completa) en .impeccable/review/.
//     Se toman con prefers-reduced-motion para mostrar el layout final, sin estados intermedios.
//
//   node scripts/capture.mjs --frame hero:[data-hero]:2600 --frame work:#work:900:600
//     Además, frames de motion a 1440 × 900: motion-<nombre>.png con la página llevada con scroll
//     hasta el selector (más un desplazamiento opcional en px) y la espera indicada en ms.
//
//   node scripts/capture.mjs --viewport first-screen:1280x530
//     Además, una captura de la primera pantalla en ese tamaño (viewport-<nombre>.png).
//
//   node scripts/capture.mjs --url http://localhost:4321/work/video-editing/ --full video-1440:1440x900 --only
//     Además, la página completa en ese tamaño (<nombre>.png), con el layout final. Hasta 760 px de ancho
//     se emula un teléfono. --only salta desktop.png y mobile.png.
//
// Opciones: --url (por defecto http://localhost:4321/), --out (por defecto .impeccable/review),
// CHROME_PATH para usar otro Chrome.
import { spawn } from 'node:child_process';
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : fallback;
};
const all = (name) => args.flatMap((a, i) => (a === `--${name}` ? [args[i + 1]] : []));

const url = opt('url', 'http://localhost:4321/');
const out = opt('out', '.impeccable/review');
const chrome = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
mkdirSync(out, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function session({ width, height, mobile = false, reduce = false, hoverFine = false }) {
  const port = 9300 + Math.floor(Math.random() * 600);
  const proc = spawn(chrome, [
    '--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), 'cap-'))}`,
    '--hide-scrollbars', '--no-first-run', `--window-size=${width},${height}`, 'about:blank',
  ], { stdio: 'ignore' });

  let wsUrl;
  for (let i = 0; i < 60 && !wsUrl; i++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
      wsUrl = list.find((t) => t.type === 'page')?.webSocketDebuggerUrl;
    } catch {}
    if (!wsUrl) await sleep(200);
  }
  const ws = new WebSocket(wsUrl);
  await new Promise((r) => (ws.onopen = r));
  let id = 0;
  let loaded = false;
  const pending = new Map();
  const errors = [];
  ws.onmessage = (m) => {
    const msg = JSON.parse(m.data);
    if (msg.id && pending.has(msg.id)) return pending.get(msg.id)(msg), pending.delete(msg.id);
    if (msg.method === 'Page.loadEventFired') loaded = true;
    if (msg.method === 'Runtime.exceptionThrown') errors.push(msg.params.exceptionDetails.exception?.description);
  };
  const send = (method, params = {}) =>
    new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile });
  if (mobile) await send('Emulation.setTouchEmulationEnabled', { enabled: true });
  const features = [];
  if (reduce) features.push({ name: 'prefers-reduced-motion', value: 'reduce' });
  if (hoverFine) features.push({ name: 'hover', value: 'hover' }, { name: 'pointer', value: 'fine' });
  if (features.length) await send('Emulation.setEmulatedMedia', { features });
  await send('Page.navigate', { url });
  for (let i = 0; i < 100 && !loaded; i++) await sleep(100);
  await send('Runtime.evaluate', { expression: 'document.fonts.ready.then(() => true)', awaitPromise: true });
  // La barra de herramientas del servidor de desarrollo no es parte del sitio: fuera de la foto
  // (con CSS y no con remove(): la barra se vuelve a montar sola después de quitarla)
  await send('Runtime.evaluate', { expression: "document.querySelector('astro-dev-toolbar')?.remove(); document.head.insertAdjacentHTML('beforeend', '<style>astro-dev-toolbar{display:none!important}</style>')" });
  await sleep(700);

  const evaluate = async (expression) =>
    (await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })).result.result?.value;
  const shot = async (file, fullPage) => {
    let clip;
    if (fullPage) {
      // La página completa no se recorre con scroll: las imágenes diferidas se cargan antes de la foto
      await evaluate(`Promise.all([...document.querySelectorAll('img[loading="lazy"]')].map((i) => {
        i.loading = 'eager';
        return i.decode().catch(() => {});
      }))`);
      // Los iframes diferidos (la app incrustada de un caso) también, con tiempo para que la app pinte
      const frames = await evaluate(`[...document.querySelectorAll('iframe[loading="lazy"]')].map((f) => (f.loading = 'eager')).length`);
      if (frames) await sleep(4000);
      const m = await send('Page.getLayoutMetrics');
      const cs = m.result.cssContentSize || m.result.contentSize;
      clip = { x: 0, y: 0, width, height: Math.ceil(cs.height), scale: 1 };
    }
    const r = await send('Page.captureScreenshot', { format: 'png', ...(clip && { clip, captureBeyondViewport: true }) });
    writeFileSync(join(out, file), Buffer.from(r.result.data, 'base64'));
    console.log('wrote', join(out, file));
  };
  const close = () => { ws.close(); proc.kill(); };
  return { evaluate, shot, close, errors };
}

// Páginas completas con el layout final
const pages = args.includes('--only') ? [] : [['desktop.png', 1440, 900, false], ['mobile.png', 390, 844, true]];
for (const v of all('full')) {
  const [name, size] = v.split(':');
  const [width, height] = size.split('x').map(Number);
  pages.push([`${name}.png`, width, height, width <= 760]);
}
for (const [file, width, height, mobile] of pages) {
  const s = await session({ width, height, mobile, reduce: true });
  await s.shot(file, true);
  s.close();
}

// Primeras pantallas en tamaños puntuales
for (const v of all('viewport')) {
  const [name, size] = v.split(':');
  const [width, height] = size.split('x').map(Number);
  const s = await session({ width, height });
  await sleep(3500); // la entrada del hero dura 1,5 s; en desarrollo los módulos tardan en cargar
  await s.shot(`viewport-${name}.png`, false);
  s.close();
}

// Frames de motion a 1440 × 900
const frames = all('frame');
if (frames.length) {
  const s = await session({ width: 1440, height: 900, hoverFine: true });
  for (const f of frames) {
    const [name, selector, wait = '900', offset = '0'] = f.split(':');
    await s.evaluate(`(() => { const e = document.querySelector(${JSON.stringify(selector)}); if (e) window.scrollTo(0, e.getBoundingClientRect().top + scrollY + ${Number(offset)}); })()`);
    await sleep(Number(wait));
    await s.shot(`motion-${name}.png`, false);
  }
  if (s.errors.length) console.log('console errors:', s.errors);
  s.close();
}
process.exit(0);
