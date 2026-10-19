// Piezas de una selección de video (VideoPiece.astro). Un solo momento por pieza, como un corte de edición:
// 1. Atado al scroll: el marco llega tapado por un bloque Klein que se barre hacia el borde de afuera
//    (el lado del zigzag), mientras el marco se endereza de -2° a 0° y la línea de tiempo se dibuja de
//    izquierda a derecha. Comunica "entra el plano": la pieza se monta frente a ti. Al subir se devuelve.
// 2. Una vez: la ficha entra en orden de lectura, datos y después textos.
// Solo transform y opacity. Con movimiento reducido no corre: sin cortinilla, marco derecho, todo visible.
import { gsap } from 'gsap';

export function initPieces() {
  const pieces = gsap.utils.toArray<HTMLElement>('[data-piece]');
  if (!pieces.length) return;

  pieces.forEach((piece) => {
    const screen = piece.querySelector<HTMLElement>('[data-piece-screen]');
    const shutter = piece.querySelector<HTMLElement>('[data-shutter]');
    const rail = piece.querySelector<HTMLElement>('[data-pv-rail]');
    const blocks = piece.querySelectorAll<HTMLElement>('[data-piece-block]');
    const card = piece.querySelector<HTMLElement>('[data-piece-card]');
    if (!screen) return;

    piece.classList.add('has-shutter');
    const outward = piece.dataset.side === 'right' ? '100% 50%' : '0% 50%';

    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: screen, start: 'top 90%', end: 'top 40%', scrub: 0.5 },
    });
    tl.fromTo(screen, { rotation: -2 }, { rotation: 0, ease: 'power2.out', duration: 1 }, 0);
    if (shutter) {
      tl.fromTo(shutter, { scaleX: 1, transformOrigin: outward }, { scaleX: 0, ease: 'power3.inOut', duration: 0.7 }, 0.1);
    }
    if (rail) {
      tl.fromTo(rail, { scaleX: 0 }, { scaleX: 1, ease: 'power2.out', duration: 0.6 }, 0.4);
    }

    if (blocks.length && card) {
      gsap.from(blocks, {
        y: 24,
        autoAlpha: 0,
        duration: 0.6,
        stagger: 0.05,
        scrollTrigger: { trigger: card, start: 'top 85%', once: true },
      });
    }
  });

  return () => pieces.forEach((p) => p.classList.remove('has-shutter'));
}
