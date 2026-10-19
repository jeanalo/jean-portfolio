// Sección de video, atada al scroll. Primero el telón y después la línea: nunca coinciden.
// 1. El telón: un bloque Klein con "HI" recortado cubre el video; a través de las letras se ve el póster.
//    Al bajar, la cámara entra por la I: el telón crece desde el centro de la letra y el video revienta
//    por ella hasta llenar el marco (text matte zoom). La curva es expo.in: la palabra se lee un buen rato
//    y el empujón llega al final. Comunica "entrar al video", como un corte de edición.
// 2. La línea (excepción 2 de Motion en CLAUDE.md), en dos tiempos para que cada parte se dibuje a la vista:
//    el arco de arriba, apenas sale el telón; la vuelta de abajo, cuando el pie del marco sube por la pantalla.
// Al subir, todo se devuelve. Con movimiento reducido no corre nada de esto: no hay telón y la línea queda dibujada.
import { gsap } from 'gsap';

const CURTAIN = 0.6; // parte del primer tramo que le toca al telón; el resto es del arco de la línea
const ZOOM = 14; // escala final del telón: para entonces la I ya cubre todo el marco

export function initVideo() {
  const sec = document.querySelector<HTMLElement>('[data-video-sec]');
  if (!sec) return;
  const frame = sec.querySelector<HTMLElement>('[data-video-frame]');
  const curtain = sec.querySelector<HTMLElement>('[data-curtain]');
  if (!frame) return;

  // Se usan las piezas que están a la vista (escritorio o móvil).
  // gsap.matchMedia vuelve a crear esto al cruzar el corte de 760px.
  sec.classList.add('has-curtain');
  const visible = (el: Element) => el.getBoundingClientRect().width > 0;
  const art = gsap.utils.toArray<SVGSVGElement>('[data-curtain-art]', sec).find(visible);
  // La línea va en dos trazos que se unen escondidos detrás del marco: el arco y la vuelta.
  // Cada uno tiene su propia animación, así no se pisan.
  const onScreen = (sel: string) =>
    gsap.utils.toArray<SVGPathElement>(sel, sec).find((p) => visible(p.closest('svg')!));
  const head = onScreen('[data-ribbon-head]');
  const tail = onScreen('[data-ribbon-tail]');

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    // Termina cuando el centro del marco llega al 42% de la pantalla: con el marco centrado en la pantalla
    // (en escritorio y en móvil) el telón ya salió.
    scrollTrigger: { trigger: frame, start: 'top 64%', end: 'center 42%', scrub: 0.5 },
  });

  if (curtain && art) {
    // El zoom sale del centro de la I (la segunda letra), medido en el propio SVG
    const word = art.querySelector<SVGTextElement>('[data-curtain-word]');
    const box = word?.getExtentOfChar(1);
    const vb = art.viewBox.baseVal;
    if (box) {
      const ox = ((box.x + box.width / 2) / vb.width) * 100;
      const oy = ((box.y + box.height * 0.55) / vb.height) * 100;
      gsap.set(art, { transformOrigin: `${ox}% ${oy}%` });
    }
    tl.fromTo(art, { scale: 1 }, { scale: ZOOM, ease: 'expo.in', duration: CURTAIN }, 0);
    tl.to(curtain, { autoAlpha: 0, duration: 0.04 }, CURTAIN - 0.04);
  }

  if (head) {
    tl.fromTo(head, { drawSVG: '0%' }, { drawSVG: '100%', ease: 'power1.out', duration: 1 - CURTAIN }, CURTAIN);
  }

  // La vuelta de abajo: sale de debajo del marco y regresa al borde izquierdo
  if (tail) {
    gsap.fromTo(
      tail,
      { drawSVG: '0%' },
      {
        drawSVG: '100%',
        ease: 'none',
        scrollTrigger: { trigger: frame, start: 'bottom 70%', end: 'bottom 35%', scrub: 0.5 },
      },
    );
  }

  return () => sec.classList.remove('has-curtain');
}
