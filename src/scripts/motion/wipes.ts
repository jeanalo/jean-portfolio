// Titulares de los casos (secciones, piezas de video y la banda Klein) en azul: entran con un barrido,
// como un corte de edición. Un bloque del color del texto cruza cada línea desde la izquierda, la tapa
// entera y, al irse hacia la derecha, deja el titular escrito. Comunica "empieza otra escena".
// Una sola vez, línea por línea, en menos de 1 s. Solo transform y opacity.
// Al terminar, el titular vuelve a su HTML original: sin restos si la pantalla cambia de tamaño.
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';

export function initWipes() {
  const splits: SplitText[] = [];

  gsap.utils.toArray<HTMLElement>('[data-wipe]').forEach((title) => {
    const split = SplitText.create(title, { type: 'lines', linesClass: 'wipe-line' });
    splits.push(split);

    const tl = gsap.timeline({
      scrollTrigger: { trigger: title, start: 'top 85%', once: true },
      onComplete: () => split.revert(),
    });

    split.lines.forEach((line, i) => {
      // El texto de la línea se esconde aparte, para que el bloque (su hermano) sí se vea
      const text = document.createElement('span');
      text.className = 'wipe-text';
      text.append(...line.childNodes);
      const block = document.createElement('span');
      block.className = 'wipe-block';
      block.setAttribute('aria-hidden', 'true');
      line.append(text, block);

      gsap.set(text, { autoAlpha: 0 });
      gsap.set(block, { scaleX: 0, transformOrigin: 'left center' });

      const at = i * 0.07;
      const cover = 0.3;
      tl.to(block, { scaleX: 1, duration: cover, ease: 'power3.out' }, at)
        .set(text, { autoAlpha: 1 }, at + cover)
        .set(block, { transformOrigin: 'right center' }, at + cover)
        .to(block, { scaleX: 0, duration: 0.45, ease: 'expo.out' }, at + cover);
    });
  });

  // Los titulares con la firma (caja azul + itálica fina, como "CLICK through it."): la caja cae hasta
  // su -2° como STUFF en el hero y la itálica entra deslizándose detrás, cuando el titular aparece.
  gsap.utils.toArray<HTMLElement>('[data-box-title]').forEach((title) => {
    const box = title.querySelector('.box');
    const soft = title.querySelector('.soft');
    const tl = gsap.timeline({ scrollTrigger: { trigger: title, start: 'top 85%', once: true } });
    if (box) tl.from(box, { yPercent: -100, rotation: -12, autoAlpha: 0, duration: 0.6, ease: 'power3.out' }, 0);
    if (soft) tl.from(soft, { x: 50, autoAlpha: 0, duration: 0.55 }, 0.22);
  });

  return () => splits.forEach((s) => s.revert());
}
