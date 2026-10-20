// Off the clock (HomeOffClock.astro): el Then / Now alterna solo mientras está a la vista.
// Las dos fotos van encuadradas por la cabeza y el paso de una a otra es un barrido CSS (solo transform),
// atado a dos radios (los botones THEN y NOW). Aquí va solo el reloj: cada 3 s cambia de lado (ida y
// vuelta) y una barra fina, debajo del marco, se llena hasta el próximo cambio, como la línea de tiempo
// de una pieza de video. Comunica que la foto cambia y cuándo.
// - Se pausa fuera de la vista y con la pestaña oculta; sigue donde quedó al volver.
// - En cuanto la persona toca un botón (clic, toque o teclado), el reloj se detiene y manda ella.
// - Sin motion (movimiento reducido o sin JS) este módulo no corre: no hay cambio automático ni barra,
//   solo los botones.
import { gsap } from 'gsap';

const HOLD = 3000; // ms entre un cambio y el siguiente

// La tira del álbum (el clip, Tailandia y los perros) entra en secuencia, de izquierda a derecha, como planos
// que caen uno detrás de otro en una línea de tiempo. Una vez, solo transform y opacity.
function initStrip() {
  const strip = document.querySelector<HTMLElement>('[data-strip]');
  const items = strip ? [...strip.children] : [];
  if (!strip || !items.length) return;
  const tween = gsap.from(items, {
    x: 48,
    autoAlpha: 0,
    duration: 0.6,
    ease: 'expo.out',
    stagger: 0.12,
    scrollTrigger: { trigger: strip, start: 'top 85%', once: true },
  });
  return () => tween.scrollTrigger?.kill();
}

export function initOffClock() {
  const stripCleanup = initStrip();
  const era = document.querySelector<HTMLElement>('[data-era]');
  const thenInput = era?.querySelector<HTMLInputElement>('[data-era-then]');
  const nowInput = era?.querySelector<HTMLInputElement>('[data-era-now]');
  const frame = era?.querySelector<HTMLElement>('[data-era-frame]');
  const fill = era?.querySelector<HTMLElement>('[data-era-fill]');
  const controls = era?.querySelector<HTMLElement>('[data-era-controls]');
  if (!era || !thenInput || !nowInput || !frame || !fill || !controls) return stripCleanup;

  let manual = false;
  let inView = false;

  // La barra se llena con la Web Animations API: solo transform, y se puede pausar donde va
  const clock = fill.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], {
    duration: HOLD,
    easing: 'linear',
    fill: 'forwards',
  });
  clock.pause();

  const sync = () => {
    if (manual) return;
    if (inView && !document.hidden) clock.play();
    else clock.pause();
  };

  // Cambio de lado: Then pasa a Now y Now vuelve a Then (rebobina). checked no dispara change, así que
  // no se confunde con un toque de la persona.
  clock.onfinish = () => {
    if (manual) return;
    (nowInput.checked ? thenInput : nowInput).checked = true;
    clock.currentTime = 0;
    sync();
  };

  // La persona toma el control: se apaga el reloj y la barra se va
  const takeOver = () => {
    if (manual) return;
    manual = true;
    clock.cancel();
    era.classList.remove('is-auto');
  };
  // Solo las teclas que eligen (flechas, espacio, Enter); pasar con Tab no cuenta como elegir
  const KEYS = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' ', 'Enter'];
  const onKey = (e: KeyboardEvent) => {
    if (KEYS.includes(e.key)) takeOver();
  };
  controls.addEventListener('pointerdown', takeOver);
  controls.addEventListener('keydown', onKey);
  controls.addEventListener('change', takeOver);

  const io = new IntersectionObserver(
    ([entry]) => {
      inView = entry.isIntersecting;
      sync();
    },
    { threshold: 0.5 },
  );
  io.observe(frame);
  document.addEventListener('visibilitychange', sync);

  era.classList.add('is-auto');

  return () => {
    io.disconnect();
    document.removeEventListener('visibilitychange', sync);
    controls.removeEventListener('pointerdown', takeOver);
    controls.removeEventListener('keydown', onKey);
    controls.removeEventListener('change', takeOver);
    clock.cancel();
    era.classList.remove('is-auto');
    stripCleanup?.();
  };
}
