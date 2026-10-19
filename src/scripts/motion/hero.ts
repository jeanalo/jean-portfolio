// Entrada del hero (máximo 1,5 s) y la línea que se escribe sola.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Lo que se crea después de la entrada (fuera del contexto de matchMedia) se limpia a mano.
let stopTyping: (() => void) | null = null;

export function initHero() {
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  if (!hero) return;

  const disciplines = hero.querySelector('[data-hero-disciplines]');
  const firstLine = hero.querySelector<HTMLElement>('[data-hero-line]');
  const firstInner = firstLine?.querySelector('.line-inner');
  const box = hero.querySelector('[data-hero-box]');
  const move = hero.querySelector('[data-hero-move]');
  const typedWrap = hero.querySelector('.typed');
  const sub = hero.querySelector('[data-hero-sub]');
  const rig = hero.querySelector('[data-badge-rig]');

  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

  // 1. La fila de disciplinas aparece
  tl.from(disciplines, { autoAlpha: 0, y: 12, duration: 0.45 }, 0);

  // 2. La primera línea sube con máscara
  if (firstLine && firstInner) {
    gsap.set(firstLine, { overflow: 'clip' });
    tl.from(firstInner, { yPercent: 105, duration: 0.7, onComplete: () => gsap.set(firstLine, { clearProps: 'overflow' }) }, 0.1);
  }

  // 3. La caja de STUFF cae hasta su rotación de -2°
  tl.from(box, { yPercent: -100, rotation: -12, autoAlpha: 0, duration: 0.6, ease: 'power3.out' }, 0.4);

  // 4. "move." entra deslizándose
  tl.from(move, { x: 70, autoAlpha: 0, duration: 0.55 }, 0.62);

  // 5. La escarapela baja colgada del lanyard (el balanceo lo pone badge.ts al terminar)
  tl.from(rig, { y: () => -window.innerHeight * 0.85, duration: 0.95, ease: 'power3.out' }, 0.15);
  tl.call(() => hero.dispatchEvent(new CustomEvent('badge:landed')), [], 1.0);

  // 6. La línea de abajo y la subline
  tl.from(typedWrap, { autoAlpha: 0, duration: 0.3, ease: 'power1.out' }, 0.95);
  tl.from(sub, { autoAlpha: 0, y: 10, duration: 0.45 }, 1.0);

  // Los estados iniciales ya están aplicados: se puede mostrar sin parpadeo.
  document.documentElement.classList.remove('motion-ok');

  // Después de la entrada, la línea se escribe sola
  tl.call(() => startTyping(hero), [], 1.3);

  return () => {
    stopTyping?.();
    stopTyping = null;
  };
}

function startTyping(hero: HTMLElement) {
  const el = hero.querySelector<HTMLElement>('[data-typed]');
  const caret = hero.querySelector<HTMLElement>('[data-caret]');
  if (!el) return;
  const phrases: string[] = JSON.parse(el.dataset.phrases || '[]');
  if (!phrases.length) return;

  const proxy = { n: 0 };
  let current = phrases[0];
  const render = () => {
    el.textContent = current.slice(0, Math.round(proxy.n));
  };

  // En loop para siempre (pedido de Jean, 2026-10-19): escribe, sostiene, borra y sigue con la
  // siguiente, y al terminar la vuelta arranca de nuevo. Solo corre mientras el hero está a la vista.
  const typing = gsap.timeline({ repeat: -1 });
  phrases.forEach((phrase) => {
    typing
      .call(() => {
        current = phrase;
        proxy.n = 0;
        render();
      })
      .to(proxy, { n: phrase.length, duration: phrase.length * 0.055, ease: 'none', onUpdate: render })
      .to({}, { duration: 1.8 })
      .to(proxy, { n: 0, duration: phrase.length * 0.025, ease: 'none', onUpdate: render })
      .to({}, { duration: 0.25 });
  });

  const blink = caret
    ? gsap.fromTo(caret, { opacity: 1 }, { opacity: 0, duration: 0.5, ease: 'steps(1)', repeat: -1, yoyo: true })
    : null;

  // Solo trabaja mientras el hero está a la vista
  const watch = ScrollTrigger.create({
    trigger: hero,
    start: 'top bottom',
    end: 'bottom top',
    onToggle: (self) => {
      typing.paused(!self.isActive);
      blink?.paused(!self.isActive);
    },
  });

  stopTyping = () => {
    typing.kill();
    blink?.kill();
    watch.kill();
    el.textContent = phrases[0];
    if (caret) caret.style.opacity = '';
  };
}
