// Motion del sitio con GSAP. Reglas en CLAUDE.md (sección Motion).
// Todo vive dentro de gsap.matchMedia: con prefers-reduced-motion el sitio queda completo y quieto.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';

import { initHero } from './hero';
import { initCaseHero } from './caseHero';
import { initBadge } from './badge';
import { initVideo } from './video';
import { initDisciplines } from './disciplines';
import { initWork } from './work';
import { initPieces } from './pieces';
import { initFigures } from './figures';
import { initSpotlight } from './spotlight';
import { initCompare } from './compare';
import { initReveals } from './reveals';
import { initWipes } from './wipes';
import { initParallax } from './parallax';
import { initCharm } from './charm';
import { initFooter } from './footer';
import { initAbout } from './about';
import { initOffClock } from './offclock';

gsap.registerPlugin(ScrollTrigger, SplitText, Draggable, InertiaPlugin, DrawSVGPlugin);
gsap.defaults({ ease: 'expo.out', duration: 0.6 });

(window as Window & { __motion?: boolean }).__motion = true;

const mm = gsap.matchMedia();

document.fonts.ready.then(() => {
  mm.add(
    {
      motion: '(prefers-reduced-motion: no-preference)',
      desktop: '(min-width: 761px)',
      finePointer: '(hover: hover) and (pointer: fine)',
    },
    (ctx) => {
      const { motion, desktop, finePointer } = ctx.conditions as Record<string, boolean>;
      if (!motion) return; // Sin motion: todo queda en su estado final, visible.

      // En orden de la página, de arriba a abajo. Cada módulo puede devolver su limpieza.
      const cleanups = [
        initHero(),
        initCaseHero(),
        initBadge({ finePointer: Boolean(finePointer) }),
        initVideo(),
        initWork({ desktop: Boolean(desktop) }),
        initPieces(),
        initFigures(),
        initSpotlight(),
        initCompare(),
        initDisciplines(),
        initWipes(),
        initReveals(),
        initParallax(),
        initAbout({ finePointer: Boolean(finePointer) }),
        initOffClock(),
        initCharm({ finePointer: Boolean(finePointer) }),
        initFooter(),
      ];

      ScrollTrigger.sort();
      ScrollTrigger.refresh();

      return () => cleanups.forEach((fn) => fn?.());
    },
  );

  // Si el motion no aplica, la entrada del hero no se queda oculta.
  if (!matchMedia('(prefers-reduced-motion: no-preference)').matches) {
    document.documentElement.classList.remove('motion-ok');
  }
});
