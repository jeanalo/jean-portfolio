// El cierre: el campo Klein del footer sube desde arriba atado al scroll, como el barrido de What I do
// (la página termina como empezó esa sección: negro, azul). A mitad del barrido los colores cambian al
// estado azul (la caja HEY se invierte, los apagados suben a blanco) con la clase is-blue; al subir se
// devuelven. Solo transform y color. Sin motion este módulo no corre: el footer ya viene azul del HTML.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initFooter() {
  const footer = document.querySelector<HTMLElement>('.site-footer');
  const field = footer?.querySelector<HTMLElement>('[data-footer-field]');
  if (!footer || !field) return;

  // Con motion, el footer arranca negro y el campo escondido
  footer.classList.remove('is-blue');

  const tween = gsap.fromTo(
    field,
    { scaleY: 0 },
    {
      scaleY: 1,
      ease: 'none',
      scrollTrigger: { trigger: footer, start: 'top 92%', end: 'top 55%', scrub: 0.4 },
    },
  );

  const toggle = ScrollTrigger.create({
    trigger: footer,
    start: 'top 72%',
    onEnter: () => footer.classList.add('is-blue'),
    onLeaveBack: () => footer.classList.remove('is-blue'),
  });

  return () => {
    tween.scrollTrigger?.kill();
    tween.kill();
    toggle.kill();
    gsap.set(field, { clearProps: 'transform' });
    footer.classList.add('is-blue');
  };
}
