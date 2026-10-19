// Banda de un caso (Spotlight.astro). Las fotos entran en orden y los pasos del recorrido de los datos
// se encienden de izquierda a derecha: comunica que la cuenta viaja del sensor a la app.
// Una sola vez. Solo transform y opacity.
import { gsap } from 'gsap';

export function initSpotlight() {
  gsap.utils.toArray<HTMLElement>('[data-spotlight]').forEach((sec) => {
    const photos = sec.querySelectorAll<HTMLElement>('[data-spotlight-photo]');
    const steps = sec.querySelectorAll<HTMLElement>('[data-spotlight-step]');

    if (photos.length) {
      gsap.from(photos, {
        y: 32,
        autoAlpha: 0,
        duration: 0.7,
        stagger: 0.08,
        scrollTrigger: { trigger: photos[0], start: 'top 85%', once: true },
      });
    }

    if (steps.length) {
      gsap.from(steps, {
        x: -16,
        autoAlpha: 0,
        duration: 0.5,
        stagger: 0.14,
        scrollTrigger: { trigger: steps[0], start: 'top 88%', once: true },
      });
    }
  });
}
