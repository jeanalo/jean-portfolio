// Escarapela con física de péndulo amortiguado (excepción de motion en CLAUDE.md).
// Se simula el desplazamiento horizontal de la tarjeta en px y se convierte en rotación alrededor
// del pivote, que está arriba del todo, fuera de la pantalla. Siempre termina quieta.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';

const STIFFNESS = 26; // período cercano a 1,2 s
const DAMPING = 2.3; // amortiguado: se calma en unos 3 s
const CURSOR_PULL = 0.05; // cuánto se inclina hacia el cursor
const CURSOR_MAX = 26; // px
const DRAG_MAX = 220; // px: más allá, el arrastre tiene fricción
const SCROLL_PUSH = 0.018;

export function initBadge({ finePointer }: { finePointer: boolean }) {
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  const rig = document.querySelector<HTMLElement>('[data-badge-rig]');
  const card = document.querySelector<HTMLElement>('[data-badge-card]');
  if (!hero || !rig || !card) return;

  const state = { d: 0, v: 0, target: 0 };
  let dragging = false;
  let awake = false;
  let radius = 1;
  let pivotX = 0;

  const measure = () => {
    const r = rig.getBoundingClientRect();
    radius = Math.max(1, rig.offsetHeight - card.offsetHeight / 2);
    pivotX = r.left + r.width / 2;
  };
  measure();

  gsap.set(card, { transformOrigin: '50% 0%' });
  const setRig = gsap.quickSetter(rig, 'rotation', 'deg');
  const setCard = gsap.quickSetter(card, 'rotation', 'deg');

  const render = () => {
    // Desplazamiento a la derecha = la tarjeta se va a la derecha
    setRig((-Math.atan(state.d / radius) * 180) / Math.PI);
    // Segunda bisagra en el clip: la tarjeta va un poco atrasada respecto al lanyard
    setCard(gsap.utils.clamp(-6, 6, -state.v * 0.012));
  };

  const tick = (_time: number, deltaMs: number) => {
    const dt = Math.min(deltaMs, 40) / 1000;
    if (!dragging) {
      const a = -STIFFNESS * (state.d - state.target) - DAMPING * state.v;
      state.v += a * dt;
      state.d += state.v * dt;
    }
    render();
    if (!dragging && Math.abs(state.v) < 0.4 && Math.abs(state.d - state.target) < 0.2) sleep();
  };

  const wake = () => {
    if (awake) return;
    awake = true;
    gsap.ticker.add(tick);
  };
  const sleep = () => {
    awake = false;
    gsap.ticker.remove(tick);
    state.d = state.target;
    state.v = 0;
    render();
  };

  // Al llegar del lanyard en la entrada, un empujón para que se balancee y se asiente
  const onLanded = () => {
    state.v += 160;
    wake();
  };
  hero.addEventListener('badge:landed', onLanded);

  // Se inclina un poco hacia el cursor
  const onPointer = (e: PointerEvent) => {
    if (dragging) return;
    state.target = gsap.utils.clamp(-CURSOR_MAX, CURSOR_MAX, (e.clientX - pivotX) * CURSOR_PULL);
    wake();
  };
  const onLeave = () => {
    state.target = 0;
    wake();
  };
  if (finePointer) {
    hero.addEventListener('pointermove', onPointer);
    hero.addEventListener('pointerleave', onLeave);
  }

  // Arrastre: Draggable sobre un proxy; la tarjeta sigue con fricción en los extremos.
  // Al soltar, InertiaPlugin da la velocidad del gesto y el péndulo la toma.
  InertiaPlugin.track(state, 'd');
  card.setAttribute('data-draggable', '');
  let startD = 0;
  const proxy = document.createElement('div');
  const [drag] = Draggable.create(proxy, {
    trigger: card,
    type: 'x',
    allowNativeTouchScrolling: true,
    onPress() {
      measure();
      dragging = true;
      startD = state.d;
      gsap.set(proxy, { x: 0 });
      this.update();
      wake();
    },
    onDrag() {
      const raw = startD + this.x;
      state.d = Math.sign(raw) * DRAG_MAX * Math.tanh(Math.abs(raw) / DRAG_MAX);
    },
    onRelease() {
      dragging = false;
      state.v = gsap.utils.clamp(-1600, 1600, InertiaPlugin.getVelocity(state, 'd') || 0);
      state.target = 0;
      wake();
    },
  });

  // Con el scroll se mece según la velocidad
  const sway = ScrollTrigger.create({
    trigger: hero,
    start: 'top top',
    end: 'bottom top',
    onUpdate: (self) => {
      state.v = gsap.utils.clamp(-700, 700, state.v + gsap.utils.clamp(-60, 60, self.getVelocity() * SCROLL_PUSH));
      wake();
    },
  });

  const onResize = () => measure();
  window.addEventListener('resize', onResize);

  return () => {
    sleep();
    hero.removeEventListener('badge:landed', onLanded);
    hero.removeEventListener('pointermove', onPointer);
    hero.removeEventListener('pointerleave', onLeave);
    window.removeEventListener('resize', onResize);
    InertiaPlugin.untrack(state, 'd');
    drag.kill();
    card.removeAttribute('data-draggable');
    sway.kill();
    gsap.set([rig, card], { clearProps: 'transform' });
  };
}
