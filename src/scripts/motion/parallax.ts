// Palabras fantasma: se mueven más lento que la página (parallax).
import { gsap } from 'gsap';

export function initParallax() {
  gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
    gsap.fromTo(
      el,
      { yPercent: 30 },
      {
        yPercent: -30,
        ease: 'none',
        scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
      },
    );
  });
}
