// Genera las portadas de los casos como una familia (node scripts/covers/build.mjs).
// Una plantilla, cuatro variaciones: campo negro con grano, el filete offwhite adentro, la fila de
// datos arriba (PROJECT / TYPE / YEAR), el título con la firma (caja azul + itálica fina con punto
// naranja) abajo a la izquierda, y la pieza de cada caso a la derecha, rotada -2°.
// Renderiza con Chrome headless a 2400 × 1350 y escribe public/work/<caso>/cover.jpg.
// Los insumos viven en scripts/covers/art/ (ver ART abajo); si falta alguno, el script lo dice.
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const chrome = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const root = resolve(import.meta.dirname, '..', '..');
const art = (f) => resolve(import.meta.dirname, 'art', f);
const pub = (f) => resolve(root, 'public', f);
const fonts = resolve(root, 'node_modules', '@fontsource');
const fileUrl = (p) => 'file:///' + p.replace(/\\/g, '/');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const CASES = [
  {
    out: 'work/global-virtuoso/cover.jpg',
    project: 'Global Virtuoso',
    type: 'Branding',
    year: '2026',
    lead: 'Global',
    boxed: 'Virtuoso',
    accent: 'rebrand',
    art: `
      <div class="gv-stack">
        <img class="paper gv-old" src="${fileUrl(pub('work/global-virtuoso/manual-2018.jpg'))}" alt="" />
        <img class="paper gv-new" src="${fileUrl(pub('work/global-virtuoso/manual-2026.png'))}" alt="" />
      </div>`,
  },
  {
    out: 'work/tripsync/cover.jpg',
    project: 'TripSync',
    type: 'UX & Web',
    year: '2026',
    lead: '',
    boxed: 'TripSync',
    accent: 'all in one place',
    art: `
      <div class="ts-stage">
        <span class="glow electric"></span>
        <span class="mac">
          <span class="mac-screen"><span class="mac-cam"></span><img src="${fileUrl(art('ts-desktop-dashboard.png'))}" alt="" /></span>
          <span class="mac-deck"><span class="mac-notch"></span></span>
        </span>
        <span class="phone-mock"><img src="${fileUrl(art('ts-phone-dashboard.jpg'))}" alt="" /></span>
      </div>`,
  },
  {
    out: 'work/mentta/cover.jpg',
    project: 'Mentta',
    type: 'UX & Web',
    year: '2026',
    lead: '',
    boxed: 'Mentta',
    accent: 'where to eat',
    art: `
      <div class="fan">
        <img class="phone p1" src="${fileUrl(art('mentta-phone2.png'))}" alt="" />
        <img class="phone p2" src="${fileUrl(art('mentta-phone3.png'))}" alt="" />
        <img class="phone p3" src="${fileUrl(art('mentta-phone5.png'))}" alt="" />
      </div>`,
  },
  {
    out: 'work/video-editing/cover.jpg',
    project: 'Selected edits',
    type: 'Video & Motion',
    year: '2024-26',
    lead: 'Selected',
    boxed: 'edits',
    accent: 'frame by frame',
    art: `
      <div class="strip">
        <div class="holes left">${'<i></i>'.repeat(26)}</div>
        <div class="frames">
          <figure><img src="${fileUrl(pub('work/video-editing/interactive-media-design.jpg'))}" alt="" /><figcaption>00:00:14<i class="tick"></i></figcaption></figure>
          <figure><img src="${fileUrl(pub('work/video-editing/puerta-abierta.jpg'))}" alt="" /><figcaption>00:01:47<i class="tick"></i></figcaption></figure>
          <figure><img src="${fileUrl(pub('work/video-editing/pedro-el-escamoso.jpg'))}" alt="" /><figcaption>00:03:05<i class="tick"></i></figcaption></figure>
        </div>
        <div class="holes right">${'<i></i>'.repeat(26)}</div>
      </div>`,
  },
];

const html = (c) => `<!doctype html>
<meta charset="utf-8">
<style>
  @font-face { font-family: 'Libre Franklin'; font-weight: 900; src: url('${fileUrl(join(fonts, 'libre-franklin/files/libre-franklin-latin-900-normal.woff2'))}') format('woff2'); }
  @font-face { font-family: 'Urbanist'; font-weight: 300; font-style: italic; src: url('${fileUrl(join(fonts, 'urbanist/files/urbanist-latin-300-italic.woff2'))}') format('woff2'); }
  @font-face { font-family: 'Urbanist'; font-weight: 600; src: url('${fileUrl(join(fonts, 'urbanist/files/urbanist-latin-600-normal.woff2'))}') format('woff2'); }
  * { margin: 0; box-sizing: border-box; }
  body {
    width: 2400px; height: 1350px; overflow: hidden; position: relative;
    background: #0a0a0a; color: #f2f2f0; font-family: Urbanist, sans-serif;
  }
  /* El filete: el marco de la familia */
  .edge { position: absolute; inset: 56px; border: 2px solid rgb(242 242 240 / 0.22); pointer-events: none; z-index: 4; }
  .edge::after { content: ""; position: absolute; top: -2px; right: -2px; width: 18px; height: 18px; background: #ff4d00; }
  /* La fila de datos, como la hoja de créditos */
  .meta { position: absolute; top: 108px; left: 110px; display: flex; gap: 110px; z-index: 3; }
  .meta div { display: grid; gap: 14px; }
  .meta dt { font-size: 22px; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; color: rgb(242 242 240 / 0.6); }
  .meta dd { font-size: 30px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: #fff; }
  /* El título con la firma de la casa */
  .title { position: absolute; left: 110px; bottom: 120px; z-index: 3; font-family: 'Libre Franklin'; font-weight: 900; text-transform: uppercase; line-height: 0.86; letter-spacing: -0.04em; color: #fff; }
  .title .line { display: block; font-size: ${'{FS}'}px; }
  .box { display: inline-block; padding: 0.04em 0.14em 0.02em; background: #0047ff; transform: rotate(-2deg); transform-origin: left center; }
  .accent { display: block; padding-left: 0.6em; margin-top: 0.08em; font-family: Urbanist; font-weight: 300; font-style: italic; text-transform: none; letter-spacing: -0.02em; font-size: ${'{AS}'}px; color: #f2f2f0; }
  .dot { color: #ff4d00; }
  .ghost { position: absolute; right: -40px; top: -60px; z-index: 0; font-family: 'Libre Franklin'; font-weight: 900; font-size: 760px; line-height: 0.8; letter-spacing: -0.04em; text-transform: uppercase; color: rgb(255 255 255 / 0.05); }
  .art { position: absolute; inset: 0; z-index: 1; }
  .grain { position: absolute; inset: 0; z-index: 5; opacity: 0.14; pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.6 0'/%3E%3C/filter%3E%3Crect width='240' height='240' filter='url(%23n)'/%3E%3C/svg%3E"); }

  /* GV: la página 2026 en papel, la 2018 asoma detrás en blanco y negro */
  .gv-stack { position: absolute; right: 170px; top: 170px; transform: rotate(-2deg); }
  .paper { display: block; border: 14px solid #f2f2f0; }
  .gv-new { width: 1080px; position: relative; z-index: 1; }
  .gv-old { position: absolute; width: 920px; right: -110px; top: 190px; transform: rotate(-5deg); filter: grayscale(100%) contrast(1.15); }
  /* TripSync: el portátil con el dashboard y el celular delante, sobre un halo azul eléctrico */
  .ts-stage { position: absolute; inset: 0; }
  .glow { position: absolute; display: block; }
  .glow.electric { right: -380px; top: -520px; width: 2300px; height: 1900px;
    background: radial-gradient(closest-side, rgb(20 100 255 / 0.95), rgb(0 71 255 / 0.5) 42%, transparent 70%); }
  .mac { position: absolute; display: block; right: 150px; top: 170px; width: 1230px; transform: rotate(-2deg); filter: drop-shadow(0 46px 90px rgb(0 0 0 / 0.65)); }
  .mac-screen { position: relative; display: block; margin: 0 56px; padding: 26px 26px 30px; background: #101014; border: 2px solid #2a2a30; border-radius: 34px 34px 0 0; }
  .mac-cam { position: absolute; top: 10px; left: 50%; width: 10px; height: 10px; margin-left: -5px; border-radius: 50%; background: #000; box-shadow: 0 0 0 3px #1c1c22; }
  .mac-screen img { display: block; width: 100%; border-radius: 10px; }
  .mac-deck { position: relative; display: block; height: 34px; background: linear-gradient(#9aa0ab, #7c828d 55%, #5d636d); border-radius: 0 0 22px 22px; }
  .mac-deck::after { content: ""; position: absolute; left: 0; right: 0; bottom: 0; height: 7px; border-radius: 0 0 22px 22px; background: rgb(0 0 0 / 0.35); }
  .mac-notch { position: absolute; display: block; left: 50%; top: 0; width: 200px; height: 14px; margin-left: -100px; border-radius: 0 0 12px 12px; background: #6b707a; }
  .phone-mock { position: absolute; display: block; right: 1180px; top: 430px; width: 310px; aspect-ratio: 470 / 986; border-radius: 46px;
    border: 12px solid #16161a; background: #16161a; overflow: hidden; transform: rotate(-5deg);
    box-shadow: 0 40px 90px rgb(0 0 0 / 0.72), 0 0 0 2px rgb(242 242 240 / 0.14); }
  .phone-mock img { display: block; width: 100%; height: 100%; object-fit: cover; border-radius: 32px; }
  /* Mentta: tres pantallas en abanico, como un mazo de cartas */
  .fan { position: absolute; right: 230px; top: 130px; }
  .fan::before { content: ""; position: absolute; right: -620px; top: -560px; width: 2100px; height: 1800px;
    background: radial-gradient(closest-side, rgb(20 100 255 / 0.9), rgb(0 71 255 / 0.45) 42%, transparent 70%); }
  .phone { position: absolute; height: 1080px; filter: drop-shadow(0 34px 70px rgb(0 0 0 / 0.6)); }
  .p1 { right: 560px; top: 60px; transform: rotate(-8deg); }
  .p2 { right: 300px; top: 10px; transform: rotate(-2deg); }
  .p3 { right: 0; top: 70px; transform: rotate(4deg); }
  /* Video: la tira de cine, cortada arriba y abajo */
  .strip { position: absolute; right: 95px; top: -80px; bottom: -80px; width: 950px; background: #f2f2f0; transform: rotate(-2deg); display: flex; padding: 0 10px; }
  .holes { display: flex; flex-direction: column; justify-content: space-around; padding: 20px 0; width: 74px; align-items: center; }
  .holes i { display: block; width: 40px; height: 54px; background: #0a0a0a; }
  .frames { flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 34px; padding: 30px 6px; }
  .frames figure { background: #0a0a0a; padding: 18px 18px 12px; }
  .frames img { display: block; width: 100%; height: 400px; object-fit: cover; }
  .frames figcaption { display: flex; align-items: center; gap: 14px; margin-top: 10px; font-size: 24px; font-weight: 600; letter-spacing: 0.16em; color: rgb(242 242 240 / 0.75); font-variant-numeric: tabular-nums; }
  .tick { display: block; width: 12px; height: 12px; background: #ff4d00; }
</style>
<body>
  <div class="ghost">${c.ghostWord}</div>
  <div class="art">${c.art}</div>
  <div class="edge"></div>
  <dl class="meta">
    <div><dt>Project</dt><dd>${c.project}</dd></div>
    <div><dt>Type</dt><dd>${c.type}</dd></div>
    <div><dt>Year</dt><dd>${c.year}</dd></div>
  </dl>
  <h1 class="title">
    ${c.lead ? `<span class="line">${c.lead}</span>` : ''}
    <span class="line"><span class="box">${c.boxed}</span></span>
    <span class="accent">${c.accent}<span class="dot">.</span></span>
  </h1>
  <div class="grain"></div>
</body>`;

async function shoot(url, outPath) {
  const port = 9500 + Math.floor(Math.random() * 300);
  const proc = spawn(chrome, ['--headless=new', `--remote-debugging-port=${port}`,
    `--user-data-dir=${mkdtempSync(join(tmpdir(), 'cov-'))}`, '--hide-scrollbars', '--window-size=2400,1350', '--allow-file-access-from-files', 'about:blank'], { stdio: 'ignore' });
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
  await send('Emulation.setDeviceMetricsOverride', { width: 2400, height: 1350, deviceScaleFactor: 1, mobile: false });
  await send('Page.enable');
  await send('Page.navigate', { url });
  await sleep(2200);
  const shot = await send('Page.captureScreenshot', { format: 'jpeg', quality: 93 });
  writeFileSync(outPath, Buffer.from(shot.result.data, 'base64'));
  ws.close();
  proc.kill();
}

const tmp = mkdtempSync(join(tmpdir(), 'covers-'));
for (const c of CASES) {
  // Palabra fantasma: la caja, sin espacios
  c.ghostWord = c.boxed.replace(/\s/g, '');
  const sizes = { 'Global Virtuoso': [218, 120], TripSync: [286, 148], Mentta: [296, 150], 'Selected edits': [218, 120] };
  const [fs, as] = sizes[c.project];
  const page = html(c).replace('{FS}', String(fs)).replace('{AS}', String(as));
  const file = join(tmp, c.out.replace(/[\\/]/g, '_') + '.html');
  writeFileSync(file, page);
  const out = pub(c.out);
  mkdirSync(resolve(out, '..'), { recursive: true });
  await shoot(fileUrl(file), out);
  console.log('wrote', c.out);
}
