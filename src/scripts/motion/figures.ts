// Cifras con rodillos de contador (CaseFigures.astro en los casos y las cifras de Off the clock en el home).
// Cada dígito es un rodillo que gira desde 0 hasta su cifra, como el contador de una línea de tiempo de
// edición: comunica "esto se contó". Los rodillos de un mismo número arrancan casi juntos, el de las
// unidades último, y los números van en orden de lectura. Las etiquetas aparecen detrás. Una sola vez,
// menos de 1 s por número. Solo transform y opacity.
//
// Siempre termina en el número real. Antes, si la pestaña quedaba atrás a mitad del giro (o la página
// cargaba con las cifras ya pasadas), los rodillos podían quedar trabados en la fila del 0 ("0 DACHSHUNDS",
// "00 MONTHS"). Ahora el giro se completa de golpe cuando la pestaña se oculta o vuelve, cuando las cifras
// salen por arriba, cuando la página ya arranca más abajo y, como respaldo, con un temporizador (que corre
// aunque la pestaña esté atrás).
import { gsap } from 'gsap';

export function initFigures() {
  const timelines: gsap.core.Timeline[] = [];
  const sections = new Map<gsap.core.Timeline, HTMLElement>();
  const timers: number[] = [];

  // Lleva el giro a su final: los rodillos quedan en su cifra y el CSS vuelve a mandar
  const finish = (tl: gsap.core.Timeline) => {
    if (tl.progress() < 1) tl.progress(1);
  };

  gsap.utils.toArray<HTMLElement>('[data-figures]').forEach((sec) => {
    const figures = sec.querySelectorAll<HTMLElement>('[data-figure]');
    if (!figures.length) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sec,
        start: 'top 75%',
        once: true,
        // Si la página ya está más abajo de las cifras, no hay nada que contar: quedan en su número
        onRefresh: (self) => {
          if (self.progress >= 1) finish(tl);
        },
        onLeave: () => finish(tl),
      },
      onStart: () => {
        timers.push(window.setTimeout(() => finish(tl), (tl.duration() + 1) * 1000));
      },
    });

    figures.forEach((fig, i) => {
      const reels = fig.querySelectorAll<HTMLElement>('[data-reel]');
      const label = fig.querySelector('[data-figure-label]');
      const at = i * 0.07;
      // El CSS deja cada rodillo en su cifra; se arranca desde la fila del 0 (y: 0). Al terminar se
      // borra el transform en px para que el CSS en em mande si cambia el tamaño de la pantalla.
      tl.from(reels, { y: 0, duration: 0.9, ease: 'expo.out', stagger: 0.05, clearProps: 'transform' }, at);
      if (label) tl.from(label, { y: 12, autoAlpha: 0, duration: 0.5 }, at + 0.2);
    });

    timelines.push(tl);
    sections.set(tl, sec);
  });

  if (!timelines.length) return;

  // Con la pestaña atrás el navegador deja de pintar y el giro se congela a mitad de camino: se completa
  // al ocultarse y otra vez al volver. Solo los que ya arrancaron; los que esperan su scroll siguen esperando.
  const onVisibility = () => {
    timelines.forEach((tl) => {
      if (tl.progress() > 0) finish(tl);
    });
  };
  document.addEventListener('visibilitychange', onVisibility);

  // Vigilante. Hay ventanas que dicen estar visibles pero no pintan (un panel de vista previa, una
  // captura): sin cuadros, el disparador del scroll nunca corre y los rodillos se quedaban en la fila del
  // 0 ("00 MONTHS", "0 DACHSHUNDS"). Un temporizador no depende de que se pinte: si las cifras ya están en
  // pantalla (o pasaron) y el giro no terminó a tiempo, quedan en su número.
  const seen = new Map<gsap.core.Timeline, number>();
  const watchdog = window.setInterval(() => {
    let open = 0;
    timelines.forEach((tl) => {
      if (tl.progress() >= 1) return;
      open++;
      const box = sections.get(tl)?.getBoundingClientRect();
      if (!box) return;
      if (box.bottom < 0) return finish(tl); // ya pasó por arriba
      // Cuenta desde que cruza la línea del disparador (75% de la pantalla), no desde que asoma
      if (box.top < window.innerHeight * 0.75) {
        const since = seen.get(tl) ?? performance.now();
        seen.set(tl, since);
        if (performance.now() - since > (tl.duration() + 1) * 1000) finish(tl);
      }
    });
    if (!open) window.clearInterval(watchdog);
  }, 500);

  return () => {
    document.removeEventListener('visibilitychange', onVisibility);
    timers.forEach((t) => window.clearTimeout(t));
    window.clearInterval(watchdog);
  };
}
