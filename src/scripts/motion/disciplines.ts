// What I do.
// El bloque Klein entra como un barrido de edición: la capa escala desde arriba atada al scroll.
// Cada fila entra rotada entre -2 y -3° y se endereza con el scroll.
import { gsap } from 'gsap';

export function initDisciplines() {
  const sec = document.querySelector<HTMLElement>('[data-disciplines]');
  const field = sec?.querySelector<HTMLElement>('[data-field]');
  if (sec && field) {
    // La capa mide una pantalla y el recorrido media pantalla: su borde baja visible por la pantalla
    // y la cubre antes de que la primera fila llegue a la mitad. Al subir, se devuelve.
    gsap.fromTo(
      field,
      { scaleY: 0 },
      { scaleY: 1, ease: 'none', scrollTrigger: { trigger: sec, start: 'top 80%', end: 'top 30%', scrub: true } },
    );
  }

  const rows = gsap.utils.toArray<HTMLElement>('[data-discipline]');
  rows.forEach((row, i) => {
    gsap.fromTo(
      row,
      { rotation: i % 2 ? -2 : -3, xPercent: i % 2 ? 5 : -5, transformOrigin: i % 2 ? '100% 50%' : '0% 50%' },
      {
        rotation: 0,
        xPercent: 0,
        ease: 'none',
        scrollTrigger: { trigger: row, start: 'top bottom', end: 'top 55%', scrub: 0.5 },
      },
    );
  });
}
