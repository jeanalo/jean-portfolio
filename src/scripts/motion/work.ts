// Selected work.
// Con 3 casos o más (y en escritorio), la lista se fija y gira como un tambor en 3D con el scroll.
// Es la única sección fijada de la página. El caso que pasa por el centro de la ventana es el activo
// y su portada se muestra al lado (HomeWork.astro escucha work:active).
// Con menos casos, o en móvil, las filas entran inclinadas y se enderezan.
import { gsap } from 'gsap';

const DRUM_TILT = 58; // grados de rotationX en el borde del tambor

export function initWork({ desktop }: { desktop: boolean }) {
  const sec = document.querySelector<HTMLElement>('#work');
  const list = sec?.querySelector<HTMLElement>('.work-list');
  if (!sec || !list) return;
  const rows = gsap.utils.toArray<HTMLElement>('.work-row', list);
  const cleanups: (() => void)[] = [];

  const win = sec.querySelector<HTMLElement>('[data-drum-window]');
  if (sec.hasAttribute('data-drum') && desktop && win) {
    sec.classList.add('is-drum');
    sec.dispatchEvent(new CustomEvent('work:drum', { detail: true }));
    cleanups.push(() => {
      sec.classList.remove('is-drum');
      sec.dispatchEvent(new CustomEvent('work:drum', { detail: false }));
    });
    gsap.set(list, { perspective: 1100, transformStyle: 'preserve-3d' });
    gsap.set(rows, { transformOrigin: '50% 50% -120px' });

    // Cada fila pasa por el centro de la ventana: de la primera a la última
    const center = (row: HTMLElement) => row.offsetTop + row.offsetHeight / 2;
    const startY = () => win.clientHeight / 2 - center(rows[0]);
    const endY = () => win.clientHeight / 2 - center(rows[rows.length - 1]);

    // Centros y alto de la ventana se miden solo en cada refresh; por frame no se lee layout
    let centers: number[] = [];
    let half = 1;
    let active = -1;
    const measure = () => {
      centers = rows.map(center);
      half = win.clientHeight / 2;
    };
    measure();
    const renderDrum = () => {
      const y = Number(gsap.getProperty(list, 'y'));
      let nearest = 0;
      let best = Infinity;
      rows.forEach((row, i) => {
        const off = gsap.utils.clamp(-1, 1, (centers[i] + y - half) / half);
        if (Math.abs(off) < best) {
          best = Math.abs(off);
          nearest = i;
        }
        gsap.set(row, { rotationX: -off * DRUM_TILT, opacity: 1 - Math.abs(off) * 0.6 });
      });
      if (nearest !== active) {
        active = nearest;
        sec.dispatchEvent(new CustomEvent('work:active', { detail: active }));
      }
    };

    gsap.fromTo(
      list,
      { y: startY },
      {
        y: endY,
        ease: 'none',
        onUpdate: renderDrum,
        scrollTrigger: {
          trigger: sec,
          start: 'top top',
          end: () => `+=${rows.length * window.innerHeight * 0.4}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
          onRefresh: () => {
            measure();
            renderDrum();
          },
        },
      },
    );
  } else {
    // Menos de 3 casos, o móvil: entran inclinadas y se enderezan
    rows.forEach((row, i) => {
      gsap.fromTo(
        row,
        { rotation: i % 2 ? -2 : -3, transformOrigin: '0% 50%' },
        { rotation: 0, ease: 'none', scrollTrigger: { trigger: row, start: 'top bottom', end: 'top 60%', scrub: 0.5 } },
      );
    });
  }

  return () => cleanups.forEach((fn) => fn());
}
