// Póster de About (AboutPoster.astro): JEAN entra desde la izquierda y ALOMIA desde la derecha,
// atadas al scroll, y se cruzan sobre el retrato: el nombre se imprime frente a ti. Al subir se
// devuelven. Con puntero fino, las dos palabras derivan unos píxeles con el cursor, en direcciones
// opuestas: profundidad de capas, como un multiplano. Solo transform.
// Con movimiento reducido no corre: el póster queda compuesto (el CSS no trae offsets).
import { gsap } from 'gsap';

const DRIFT = 8; // px máximos de deriva por capa con el cursor

export function initAbout({ finePointer }: { finePointer: boolean }) {
  const poster = document.querySelector<HTMLElement>('[data-about-poster]');
  if (!poster) return;
  const jean = poster.querySelector<HTMLElement>('[data-poster-jean]');
  const alomia = poster.querySelector<HTMLElement>('[data-poster-alomia]');
  const cleanups: (() => void)[] = [];

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger: poster, start: 'top 95%', end: 'top 30%', scrub: 0.6 },
  });
  if (jean) tl.fromTo(jean, { xPercent: -45 }, { xPercent: 0 }, 0);
  if (alomia) tl.fromTo(alomia, { xPercent: 40 }, { xPercent: 0 }, 0);
  cleanups.push(() => {
    tl.scrollTrigger?.kill();
    tl.kill();
  });

  if (finePointer && jean && alomia) {
    // La deriva va en `x` (px): no pisa el xPercent de la entrada
    const toJ = gsap.quickTo(jean, 'x', { duration: 0.6, ease: 'power3.out' });
    const toA = gsap.quickTo(alomia, 'x', { duration: 0.6, ease: 'power3.out' });
    const onMove = (e: PointerEvent) => {
      const r = poster.getBoundingClientRect();
      if (e.clientY < r.top - 160 || e.clientY > r.bottom + 160) return;
      const n = gsap.utils.clamp(-1, 1, ((e.clientX - (r.left + r.width / 2)) / r.width) * 2);
      toJ(n * DRIFT);
      toA(-n * DRIFT);
    };
    const onLeave = () => {
      toJ(0);
      toA(0);
    };
    const sec = poster.closest<HTMLElement>('section') ?? poster;
    sec.addEventListener('pointermove', onMove);
    sec.addEventListener('pointerleave', onLeave);
    cleanups.push(() => {
      sec.removeEventListener('pointermove', onMove);
      sec.removeEventListener('pointerleave', onLeave);
      gsap.set([jean, alomia], { x: 0 });
    });
  }

  return () => cleanups.forEach((fn) => fn());
}
