// Entrada de la apertura de un caso: el mismo corte del hero del home, en poco más de 1 s.
// El kicker aparece, la primera línea sube por su máscara, la caja cae hasta su -2° como STUFF,
// la itálica entra deslizándose como "move." y después el resumen y los datos.
// Solo transform y opacity. Sin motion, la apertura se ve completa desde el principio.
import { gsap } from 'gsap';

export function initCaseHero() {
  const hero = document.querySelector<HTMLElement>('[data-case-hero]');
  if (!hero) return;

  const kicker = hero.querySelector('[data-case-kicker]');
  const lead = hero.querySelector('[data-case-lead] .line-inner');
  const box = hero.querySelector('[data-case-box]');
  const accent = hero.querySelector('[data-case-accent]');
  const info = hero.querySelector('[data-case-info]');

  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  tl.from(kicker, { autoAlpha: 0, y: 12, duration: 0.45 }, 0);
  if (lead) tl.from(lead, { yPercent: 105, duration: 0.7 }, 0.08);
  tl.from(box, { yPercent: -100, rotation: -12, autoAlpha: 0, duration: 0.6, ease: 'power3.out' }, lead ? 0.3 : 0.12);
  if (accent) tl.from(accent, { x: 70, autoAlpha: 0, duration: 0.55 }, '<0.22');
  tl.from(info, { autoAlpha: 0, y: 16, duration: 0.5 }, '<0.2');

  // Los estados iniciales ya están puestos: se puede mostrar sin parpadeo.
  document.documentElement.classList.remove('motion-ok');
}
