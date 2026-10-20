// Entradas con el scroll, una sola vez, como cortes y barridos (no fundidos genéricos):
// títulos de sección del home y textos suben por líneas con máscara (la hoja de datos de About entra como un
// solo bloque: títulos y valores en orden de lectura, con un solo disparador);
// las imágenes de los casos y la foto de About aparecen con opacidad y una escala leve.
// La caja HEY del cierre cae como la de STUFF.
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';

export function initReveals() {
  const splits: SplitText[] = [];

  // Títulos de sección del home (los de los casos entran con el barrido de wipes.ts)
  gsap.utils.toArray<HTMLElement>('[data-reveal-title]').forEach((title) => {
    const split = SplitText.create(title, { type: 'lines', mask: 'lines', linesClass: 'reveal-line' });
    splits.push(split);
    gsap.from(split.lines, {
      yPercent: 105,
      duration: 0.7,
      stagger: 0.08,
      scrollTrigger: { trigger: title, start: 'top 85%', once: true },
    });
  });

  // Textos: entran una sola vez, línea por línea con máscara (nunca letra por letra)
  gsap.utils.toArray<HTMLElement>('[data-reveal-text], .sec-body').forEach((block) => {
    // Los dt que son títulos (data-reveal-title) tienen su propia entrada. Un párrafo suelto con el
    // atributo entra él mismo (antes se buscaban solo párrafos adentro y no entraba nada).
    const parts = block.matches('p, li')
      ? [block]
      : [...block.querySelectorAll<HTMLElement>('p, li, dt:not([data-reveal-title])')];
    if (!parts.length) return;
    // aria: 'none' deja el texto tal cual para el lector de pantalla (aria-label no aplica a p, dt ni li)
    const split = SplitText.create(parts, { type: 'lines', mask: 'lines', aria: 'none' });
    splits.push(split);
    gsap.from(split.lines, {
      yPercent: 100,
      duration: 0.5,
      stagger: 0.03,
      scrollTrigger: { trigger: block, start: 'top 88%', once: true },
    });
  });

  // Imágenes de los casos y la foto de About
  gsap.utils.toArray<HTMLElement>('.case-media .frame, .cover, [data-reveal-media]').forEach((media) => {
    gsap.from(media, {
      autoAlpha: 0,
      scale: 0.96,
      duration: 0.7,
      scrollTrigger: { trigger: media, start: 'top 90%', once: true },
    });
  });

  // Cierre: la caja HEY cae hasta su -2°, como STUFF en el hero
  const hey = document.querySelector('[data-hey-box]');
  if (hey) {
    gsap.from(hey, {
      yPercent: -100,
      rotation: -12,
      autoAlpha: 0,
      duration: 0.55,
      ease: 'power3.out',
      scrollTrigger: { trigger: hey, start: 'top 85%', once: true },
    });
  }

  return () => splits.forEach((s) => s.revert());
}
