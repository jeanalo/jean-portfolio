// Llavero del footer: cuelga de su cadena por debajo de SAY, en la sangría de HEY.
// Misma familia que la escarapela (excepción de motion en CLAUDE.md): péndulo amortiguado que
// siempre vuelve a quedar quieto y derecho, colgando de la cadena.
// Entra cayendo cuando aparece el footer, se inclina hacia el cursor y se mece con el scroll.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const REST = 0; // grados: en reposo cuelga derecho
const STIFFNESS = 24;
const DAMPING = 2.6;
const CURSOR_MAX = 5; // grados hacia el cursor
const SCROLL_PUSH = 0.004;

export function initCharm({ finePointer }: { finePointer: boolean }) {
  const charm = document.querySelector<HTMLElement>('[data-charm]');
  const body = charm?.querySelector<HTMLElement>('[data-charm-body]');
  const footer = charm?.closest<HTMLElement>('footer');
  if (!charm || !body || !footer) return;

  const state = { a: 0, v: 0, target: 0 }; // a: grados respecto al reposo
  let awake = false;
  const setRotation = gsap.quickSetter(body, 'rotation', 'deg');
  const render = () => setRotation(REST + state.a);

  const tick = (_t: number, deltaMs: number) => {
    const dt = Math.min(deltaMs, 40) / 1000;
    const acc = -STIFFNESS * (state.a - state.target) - DAMPING * state.v;
    state.v += acc * dt;
    state.a += state.v * dt;
    render();
    if (Math.abs(state.v) < 0.05 && Math.abs(state.a - state.target) < 0.02) sleep();
  };
  const wake = () => {
    if (awake) return;
    awake = true;
    gsap.ticker.add(tick);
  };
  const sleep = () => {
    awake = false;
    gsap.ticker.remove(tick);
    state.a = state.target;
    state.v = 0;
    render();
  };

  // Entra cayendo colgado de la cadena y se balancea hasta quedar quieto
  const drop = gsap.from(body, {
    yPercent: -8, // corto: así el arranque de la cadena no asoma por encima de la S
    autoAlpha: 0,
    duration: 0.6,
    ease: 'power3.out',
    paused: true,
    onComplete: () => {
      state.v += 55;
      wake();
    },
  });
  const enter = ScrollTrigger.create({ trigger: footer, start: 'top 85%', once: true, onEnter: () => drop.play() });

  // Se inclina hacia el cursor mientras está en el footer
  const onPointer = (e: PointerEvent) => {
    const r = body.getBoundingClientRect();
    const pivotX = r.left + r.width / 2;
    state.target = gsap.utils.clamp(-CURSOR_MAX, CURSOR_MAX, -(e.clientX - pivotX) * 0.012);
    wake();
  };
  const onLeave = () => {
    state.target = 0;
    wake();
  };
  if (finePointer) {
    footer.addEventListener('pointermove', onPointer);
    footer.addEventListener('pointerleave', onLeave);
  }

  // Con el scroll se mece según la velocidad
  const sway = ScrollTrigger.create({
    trigger: footer,
    start: 'top bottom',
    end: 'bottom top',
    onUpdate: (self) => {
      state.v = gsap.utils.clamp(-90, 90, state.v + gsap.utils.clamp(-12, 12, self.getVelocity() * SCROLL_PUSH));
      wake();
    },
  });

  return () => {
    sleep();
    enter.kill();
    sway.kill();
    footer.removeEventListener('pointermove', onPointer);
    footer.removeEventListener('pointerleave', onLeave);
    gsap.set(body, { clearProps: 'transform,opacity,visibility' });
  };
}
