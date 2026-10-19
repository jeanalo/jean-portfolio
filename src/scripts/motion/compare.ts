// Wireframe a final (WireCompare.astro). La primera vez que la fila entra a la vista, el barrido se
// abre hasta casi la mitad y vuelve al wireframe: comunica "esto se arrastra" y deja ver la final un
// momento. Una sola vez, menos de 1 s por tramo, y si la persona ya lo tocó no corre. El barrido es
// transform (lo mueve el CSS con --p).
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initCompare() {
  const triggers: ScrollTrigger[] = [];
  gsap.utils.toArray<HTMLElement>('[data-compare]').forEach((root) => {
    let touched = false;
    root.addEventListener('compare:touched', () => (touched = true), { once: true });
    const p = { v: 0 };
    const send = () => root.dispatchEvent(new CustomEvent('compare:set', { detail: p.v }));
    const tl = gsap.timeline({ paused: true, onUpdate: () => !touched && send() });
    tl.to(p, { v: 46, duration: 0.8, ease: 'power3.out' })
      .to(p, { v: 0, duration: 0.6, ease: 'power3.out' }, '+=0.3');
    triggers.push(
      ScrollTrigger.create({
        trigger: root,
        start: 'top 65%',
        once: true,
        onEnter: () => !touched && tl.play(),
      }),
    );
  });
  return () => triggers.forEach((t) => t.kill());
}
