// Cifras de un caso (CaseFigures.astro). Cada dígito es un rodillo de contador que gira desde 0 hasta su
// cifra, como el contador de una línea de tiempo de edición: comunica "esto se contó". Los rodillos de
// un mismo número arrancan casi juntos, el de las unidades último, y los números van en orden de
// lectura. Las etiquetas aparecen detrás. Una sola vez, menos de 1 s por número. Solo transform y opacity.
import { gsap } from 'gsap';

export function initFigures() {
  gsap.utils.toArray<HTMLElement>('[data-figures]').forEach((sec) => {
    const figures = sec.querySelectorAll<HTMLElement>('[data-figure]');
    if (!figures.length) return;

    const tl = gsap.timeline({ scrollTrigger: { trigger: sec, start: 'top 75%', once: true } });
    figures.forEach((fig, i) => {
      const reels = fig.querySelectorAll<HTMLElement>('[data-reel]');
      const label = fig.querySelector('[data-figure-label]');
      const at = i * 0.07;
      // El CSS deja cada rodillo en su cifra; se arranca desde la fila del 0 (y: 0). Al terminar se
      // borra el transform en px para que el CSS en em mande si cambia el tamaño de la pantalla.
      tl.from(reels, { y: 0, duration: 0.9, ease: 'expo.out', stagger: 0.05, clearProps: 'transform' }, at);
      if (label) tl.from(label, { y: 12, autoAlpha: 0, duration: 0.5 }, at + 0.2);
    });
  });
}
