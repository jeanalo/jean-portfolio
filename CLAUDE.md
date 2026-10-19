# Portafolio de Jean Alomia

Sitio personal de portafolio. Jean es diseñador de medios interactivos, vive en Cali, Colombia, y trabaja con clientes internacionales. Todo el contenido visible del sitio va en INGLÉS.

## Prioridad de este archivo

Si una skill (Impeccable, GSAP o Emil Kowalski) sugiere algo que contradice este archivo, gana este archivo.

## Stack

- Astro con salida estática
- GSAP con ScrollTrigger y SplitText para animación
- CSS propio con variables (tokens). Sin Tailwind, sin librerías de componentes, sin shadcn. Los defaults de esas herramientas (bordes redondeados, sombras) chocan con este sistema.
- Proyectos como content collection en `src/content/projects/`

## Sistema de diseño

### Tipografía

Las fuentes van alojadas en el propio sitio con Fontsource (`@fontsource/libre-franklin` y `@fontsource/urbanist`), importadas en `src/layouts/Base.astro`. No agregar links a Google Fonts.

- Display y titulares: Libre Franklin 900 (Black)
- Cuerpo, etiquetas y datos: Urbanist 300 Italic, 400, 600 y 700
- Display con line-height entre 0.85 y 0.92 y tracking entre -0.03em y -0.04em
- Etiquetas en mayúsculas, Urbanist 600, tracking entre +0.12em y +0.16em
- Salto mínimo de 4x entre el titular de una sección y su cuerpo en escritorio. En móvil el mínimo es 3x. El salto se mide entre el titular de la sección y su texto corrido, no en filas de contenido: las filas de What I do o de Selected work pueden quedar más cerca de su descripción.
- Máximo 3 tamaños tipográficos por sección
- Recurso firma: Libre Franklin Black en mayúsculas dentro de una caja azul, junto a Urbanist Light Italic en minúsculas. Ejemplo: "STUFF move."

### Color

```css
--black: #0A0A0A;     /* fondo principal */
--klein: #002FA7;     /* azul dominante en bloques */
--electric: #0047FF;  /* cajas, resaltados, acentos digitales */
--offwhite: #F2F2F0;  /* texto pequeño y fondos claros */
--white: #FFFFFF;     /* titulares sobre oscuro */
--orange: #FF4D00;    /* acento */
--yellow: #FFE500;    /* acento escaso */
```

- El azul sigue siendo la voz principal. Se usa en cajas, bloques, en el hover de textos grandes y en los titulares de los casos (Problem, My role..., los títulos de las piezas de video): azul eléctrico, que a ese tamaño (52 px o más, Black) pasa el contraste de texto grande sobre negro (3,15:1; el detector de Impeccable lo marca porque no resuelve el `clamp()`, es un falso positivo). Sobre Klein, el titular va en blanco. El H1 del caso sigue en blanco con su caja azul.
- Naranja: hasta el 5% de cada vista. Va en puntos finales, separadores, flechas y en el hover y los estados activos de textos pequeños (5,9:1 sobre negro; el azul se queda en 3,15:1 y no alcanza en texto chico). Nunca en párrafos.
- Amarillo #FFE500: acento nuevo, más escaso que el naranja, máximo un elemento por vista. Viene del destello del banner. Hoy es la línea que se escribe sola del hero (texto y cursor). Por eso el destello de la escarapela pasó a azul eléctrico.
- El lanyard de la escarapela es naranja: cuenta dentro del 5% de la vista.
- El naranja y el amarillo nunca se tocan: la flecha de la línea que se escribe sola va en blanco.
- Los separadores en línea son siempre ■ naranja, nunca comas.
- Sobre Klein (el bloque de What I do), los textos pequeños activos y el foco van en blanco: el naranja y el azul eléctrico no alcanzan contraste de texto sobre Klein.
- Sobre vidrio, el texto va en blanco en todos sus estados: sobre un video claro el vidrio queda gris y el naranja no alcanza contraste. En los controles del video, el hover oscurece el vidrio; en el nav de vidrio, el enlace se subraya.

### Reglas duras

- `border-radius: 0` en todo el sitio
- Sin sombras, sin degradados, sin glassmorphism, sin desenfoque de fondo, salvo dentro de los elementos de la capa de vidrio (ver abajo)
- Sin líneas horizontales decorativas. Si hay una línea, es estructural y va de borde a borde. No se ponen líneas entre las secciones de un caso.
- Sin íconos de librería. Se usan símbolos tipográficos: * → / ■
- Nada de texto centrado, salvo una palabra sola ocupando la pantalla
- Composición asimétrica (proporciones 7/5 u 8/4), nunca 6/6
- Grano sutil y estático sobre los fondos oscuros (overlay alrededor del 15%, con pointer-events: none)
- El espacio entre secciones depende del ancho y del alto (`--section-pad` usa `vw` y `svh`). El vacío entre el final de una sección y el comienzo de la siguiente no pasa de un cuarto del alto de la pantalla, en 1280 × 529 y en 1440 × 900. Se mide con `node scripts/measure-gaps.mjs`.
- Cada sección arranca con su titular: si hay dos columnas, se alinean arriba.
- Sin vacíos negros dentro de la grilla (pasada de layout del 2026-10-19). Cuando dos columnas miden distinto, la corta acompaña a la larga con `position: sticky` a `--travel-top` (debajo del nav): el titular de cada sección del caso junto a su texto, el marco o la ficha de una pieza de video (el que sea más corto, desde 1101 px) y el primer plano de la banda Klein. No es un pin de ScrollTrigger. Ojo: un sticky dentro de una grilla no se queda en su fila, viaja por todo el contenedor. Por eso el titular y su texto van juntos en `.sec-top` y la imagen de la banda con su texto en `.spread` (subgrillas): así no pasan por encima de las imágenes que vienen después. Las listas largas no van en una columna angosta al lado de un texto corto: van en una franja a todo el ancho. Se mide con `node scripts/measure-voids.mjs [url] [ancho]x[alto]`: lista los rectángulos vacíos de más de un sexto de la pantalla, con la sección donde caen. Los vacíos de las columnas que acompañan salen en la medición (es estática) pero no al bajar.

### Dos capas: póster y vidrio

El sistema tiene dos capas.

- **Abajo, el póster impreso:** tipografía, bloques Klein y fotos en blanco y negro. Sigue plano, duro y sin sombras.
- **Arriba, la capa interactiva de vidrio (liquid glass), que flota.** El vidrio solo se usa en lo que flota o se toca: el nav, la funda plástica de la escarapela, el botón del video (Play intro / Pause) y los botones. Nunca en bloques de contenido ni en secciones completas (la portada de Selected work es póster, no vidrio).
- Siempre va sobre algo con color o movimiento detrás (video, la forma azul, bloques Klein, fotos). Sobre negro plano no se ve, así que ahí no va.
- Implementación: `backdrop-filter` con blur y saturación, un borde de luz de 1px y un brillo especular interno. Es la única excepción a no usar sombras ni degradados, y solo dentro de los elementos de vidrio. Esquinas rectas.
- La refracción con filtro SVG de desplazamiento solo funciona en Chrome y Edge. En Safari y Firefox cae a blur simple sin romperse.
- Máximo 3 elementos de vidrio visibles a la vez. El texto sobre vidrio cumple contraste de 4,5:1.
- La funda de la escarapela es `src/components/GlassSleeve.astro`, con borde de luz, brillo especular y refracción en el anillo del borde. El aire alrededor de lo que guarda se da con `--sleeve-pad`. (La foto de About ya no lleva funda.)
- Con `prefers-reduced-transparency`, el vidrio pasa a fondo sólido.

### Transparencias

- Palabras gigantes en blanco al 6% detrás de algunas secciones, como capa de fondo que se mueve con parallax. Son decorativas: `aria-hidden`, sin interacción y nunca compiten con el titular de la sección.

### Nav

- Nav flotante de vidrio con esquinas rectas: transparente arriba del todo y de vidrio cuando haces scroll.
- Compacto: mide lo que mide su contenido (nombre y enlaces), no todo el ancho. Va arriba a la izquierda, para dejar libre el lanyard de la escarapela.

### Fotografía

- Blanco y negro de alto contraste: `filter: grayscale(100%) contrast(1.25)`. Es para fotografía (personas, escenas): el retrato de la escarapela, la foto de About, las fotos de un caso.
- El trabajo de diseño va a color, no en blanco y negro: las páginas de un manual, las pantallas de una interfaz, un logo. Ahí el color es el contenido (una paleta en gris no dice nada). En los casos, cada imagen lleva `color: true` y la portada del caso `coverColor: true` (ver el esquema). El blanco y negro queda por defecto para que una foto no se pase de color sin querer.
- Sujeto recortado sobre azul plano, o rectángulo duro
- Nunca círculos, nunca bordes redondeados, nunca marcos
- El llavero 3D de Jean (`public/images/jean-keychain.webp`, render con fondo negro puro) va a color: es un objeto, no una fotografía. Vive en el footer: SAY va en la primera línea y HEY. en la segunda, con sangría; el llavero cuelga de su cadena, que sale por debajo de SAY, y la cabeza, grande (más de una vez y media el alto de la caja HEY), queda en esa sangría, a la izquierda de la caja, y baja por debajo de ella. Su fondo se funde con `mix-blend-mode: lighten`.
- El retrato de Jean (`public/images/jean-portrait.jpg`) aparece en la escarapela (blanco y negro) y, si falta el video, en el póster de desarrollo de la sección de video (duotono Klein).
- About lleva la foto de Jean como póster (`src/components/home/AboutPoster.astro`, elegido por Jean el 2026-10-19 entre tres opciones): la foto entera en blanco y negro duro, JEAN gigante en azul eléctrico DETRÁS de la cabeza (la capa de encima es Jean recortado con rembg, `public/images/jean-about-cut.webp`; el script del recorte quedó en el chat, isnet-general-use) y ALOMIA en contorno (text-stroke offwhite) por DELANTE. Etiquetas INTERACTIVE MEDIA DESIGNER arriba y CALI, CO ■ WORLDWIDE abajo, el cuadrado naranja en la esquina. Todo en cqi del marco. Sin marco, sin funda.

## Motion: animado, pero no demasiado

- Solo se animan `transform` y `opacity`
- Respetar `prefers-reduced-motion`. Sin animación, el sitio tiene que verse completo y bien.
- Microinteracciones de 150 a 250 ms. Entradas de 400 a 700 ms. Nada pasa de 1 s salvo la intro del hero, que dura como máximo 1,5 s.
- Entradas con ease-out. Sin rebotes ni efectos elásticos.
- Máximo una sección fijada (pin) con ScrollTrigger por página
- El texto de cuerpo entra una sola vez, sin efectos letra por letra
- Única excepción: una sola línea corta del hero puede escribirse letra por letra. Con `prefers-reduced-motion` se muestra completa, y los lectores de pantalla leen el texto entero.
- Rotaciones permitidas solo entre -2 y -3 grados, como firma visual
- Excepción 1: la escarapela se mueve con física de péndulo amortiguado. Se inclina hacia el cursor, se puede arrastrar y al soltarla vuelve a su lugar balanceándose; con el scroll se mece según la velocidad. Siempre termina quieta.
- El llavero 3D del footer usa la misma física (sin arrastre): cae colgado de su cadena cuando aparece el footer, se inclina hacia el cursor, se mece con el scroll y queda en reposo colgando derecho.
- Excepción 2: la sección de video se mueve con el scroll. Primero el telón: un bloque Klein con "HI" recortado; la palabra se lee un buen rato y después la cámara entra por la I con un zoom en curva expo.in (solo transform) y el video revienta por la letra. Después la línea (DrawSVG), en dos tiempos para que cada parte se dibuje a la vista: el arco de arriba apenas sale el telón, y la vuelta de abajo cuando el pie del marco sube por la pantalla. Telón y línea nunca coinciden. Al subir, todo se devuelve. Con `prefers-reduced-motion` no hay telón y la línea queda dibujada.
- Excepción 3: las piezas de la selección de video entran con una cortinilla atada al scroll. El marco llega tapado por un bloque Klein que se barre hacia el borde de afuera (el lado del zigzag), mientras el marco se endereza de -2° a 0° y la línea de tiempo de debajo se dibuja. Comunica "entra el plano", como un corte de edición. Sin pin. Al subir se devuelve. Después la ficha entra una vez, en orden de lectura. Con `prefers-reduced-motion` no hay cortinilla y el marco queda derecho. Al darle Play, la cortinilla de esa pieza se va para siempre.
- Antes de agregar una animación, preguntar qué comunica. Si no comunica nada, no va.
- Casos (`/work/[slug]`), desde 2026-10-19:
  - La apertura entra con el mismo corte del hero del home (`motion/caseHero.ts`): el kicker aparece, la primera línea sube por su máscara, la caja cae hasta su -2° como STUFF, la itálica entra deslizándose y después el resumen y los datos. Poco más de 1 s.
  - Los titulares de sección, de las piezas de video y de la banda Klein entran con un barrido (`motion/wipes.ts`): un bloque del color del texto cruza cada línea desde la izquierda, la tapa y al irse hacia la derecha deja el titular. Comunica "empieza otra escena". Una vez, línea por línea, 0,75 s. Al terminar el titular vuelve a su HTML.
  - Los titulares con la firma (caja + itálica, como CLICK through it.) entran como la apertura: la caja cae y la itálica se desliza.
  - Las cifras son rodillos de contador (`CaseFigures.astro` y `motion/figures.ts`): cada dígito gira desde 0 hasta su cifra, como el contador de una línea de tiempo. 0,9 s por número. El CSS deja el número quieto en su cifra; el lector de pantalla lee el valor.

### Dirección de motion

- El sitio se siente hecho por alguien que edita video y hace motion. Las transiciones son cortes y barridos con tiempos precisos, no fundidos genéricos, y cada una comunica algo.
- Barrido de What I do: una capa Klein escala desde arriba atada al scroll (solo transform), termina antes de que las filas lleguen a la mitad de la pantalla y se devuelve al subir.

## Estructura del sitio

- Home, en este orden: hero con la escarapela, sección de video, Selected work, What I do, About y contacto. El nav de vidrio flota encima. El marco del video asoma en la primera bajada desde el hero, nunca antes.
- Selected work: en escritorio, la lista va en 7 columnas y la portada del caso que pasa por el centro de la pantalla se muestra grande al lado, en 5 columnas. El tambor 3D fijado se activa solo cuando hay 3 casos publicados (desde Mentta hay 3: Global Virtuoso, Mentta y Video, así que ya está activo); con menos, lista simple. Todas las portadas van en 16:9, el formato de la casa, y se ven enteras: una portada no se recorta. En móvil, cada fila lleva la suya visible. Sin imagen, bloque Klein con "■ Pending cover". El trabajo se ve sin depender del hover.
- What I do: bloque Klein a todo el ancho con los textos en blanco (negro, azul, negro en la página). Cuatro filas en `--display-s`, un paso por debajo de los títulos de Selected work (`--display-m`), con su descripción en Urbanist 400, offwhite, a tamaño de cuerpo. Detrás, la palabra fantasma MAKE en blanco al 6%.
- About, en dos grupos que se leen en orden:
  - Quién soy (7/5): "ABOUT me.", la bio y debajo la hoja corta (Availability y Languages lado a lado, Education a lo ancho) en las 7 columnas de la izquierda; el póster en las 5 de la derecha. La hoja corta llena el espacio bajo la bio: las dos columnas terminan casi a la misma altura sin achicar la foto. La bio va al tamaño del cuerpo (`--body`), en un solo peso: los dos párrafos iguales, blancos, Urbanist 400.
  - El kit (Tools, Code, AI tools) va a todo el ancho, debajo: tres columnas (1 a 4, 5 a 7, 8 a 12) con la lista en VERTICAL, una herramienta por línea (en línea con ■ se veía mal, pedido de Jean); AI tools, la más larga, lleva la lista en dos columnas. Entre 761 y 1100 px cada kit es una fila de hoja de rodaje (título 1 a 4, lista en dos columnas 5 a 12); en móvil, columnas de a una con la lista en dos. Solo Languages sigue en línea con ■.
  - Los títulos de los datos: Libre Franklin Black en mayúsculas, en blanco, en `--display-xs`, más grandes que su valor. La sección usa 3 tamaños: el titular, `--display-xs` y el cuerpo.
  - La foto se ve entera desde 1280 × 529, alineada al borde derecho de la grilla, con su borde de papel a la altura de las mayúsculas del titular.
  - En móvil: titular, foto, bio (a tamaño de cuerpo, para que el titular siga 3 veces más grande) y datos, cada título sobre su valor.
  - Motion del póster (`motion/about.ts`): JEAN entra desde la izquierda y ALOMIA desde la derecha, atadas al scroll, y se cruzan sobre el retrato; al subir se devuelven. Con puntero fino las dos palabras derivan hasta 8px en direcciones opuestas (multiplano). Solo transform; con movimiento reducido el póster queda compuesto. Los datos entran como un solo bloque, en orden de lectura.
- CV descargable: sí, cuando exista el PDF en inglés; dónde va se decide al revisar el footer. Sin link de agenda.
- Referencia de estructura: tegadesigns.tiiny.co. Se toma: el orden de secciones, la escarapela con lanyard (rediseñada con este sistema), la línea que se escribe sola, las filas de disciplinas gigantes que entran rotadas y se acomodan con el scroll, y el carrusel de trabajos inclinado en 3D. No se toma: el marquee (se quitó; las herramientas viven en About), el giro de la escarapela, la paleta rosa y morada, sus fuentes, su copy, las cuatro palabras alrededor del hero, la sección de estadísticas ni el botón de WhatsApp.
- `/work/[slug]`: plantilla de caso de estudio con problema, rol, proceso, decisiones y resultado
- Apertura de un caso: el resumen en las columnas 1 a 7 y, al lado, solo los datos cortos (Client, Location, Role, Team, Code, y Tools en una línea con ■ naranja). Los entregables van donde dejan menos hueco: debajo del resumen en dos columnas, al lado de los datos (TripSync), o en una franja de créditos a todo el ancho en tres columnas (Global Virtuoso, Mentta). La plantilla lo decide sola estimando el alto de cada columna por la cantidad de caracteres (medido en 1440 px).
- Contacto (el footer, en todas las páginas): CONTACT arriba; SAY HEY. con el llavero en las columnas 1 a 6 y, al lado (7 a 12), alineada arriba con SAY, una ficha ordenada como los datos de About: Email (el correo y Copy email), Elsewhere (LinkedIn → y Behance →) y Availability (Open to freelance projects now.), cada título en etiqueta sobre su valor en `--display-xs`. El pie (© año Jean Alomia) va abajo a la izquierda, debajo de la cabeza del llavero. En móvil, todo en una columna.

## Estado del código (Fase 1 terminada)

- `src/styles/tokens.css`: todas las variables del sistema. Usar siempre estas variables, nunca valores sueltos.
- `src/styles/base.css`: reset, grilla de 12 columnas (`.wrap`, `.grid`), clases `.display`, `.label`, `.box`, `.soft`, `.dot`, `.sep`, `.prose`, `.bw` y el grano.
- `src/layouts/Base.astro` con `SiteHeader` y `SiteFooter` en `src/components/`.
- `src/content.config.ts`: colección `projects`. Los textos de cada sección van en el frontmatter y los párrafos se separan con una línea en blanco. Cada sección acepta texto o `{ text, media }`; `media` lleva src, alt, caption, layout (full, 8/4 o 7/5) y `color` (a color en vez de blanco y negro). Con `color`, la imagen se ve entera con la proporción real del archivo, que `src/lib/imageSize.ts` lee al generar el sitio y pasa como `width`, `height` y `--ar`: una pieza de diseño no se recorta. Ojo: declarar `aspect-ratio: auto` en el CSS borra la proporción que el navegador deduce de `width` y `height`, y la imagen diferida queda en cero de alto. Campos opcionales del caso: `boxed` (palabra de la caja azul), `location`, `deliverables`, `draft`, `coverColor` (portada a color) y `compare` (comparación antes/después).
- `compare` abre el caso con dos portadas lado a lado (antes y después), una flecha naranja en el medio y una nota. Reemplaza la portada normal. A color, no en blanco y negro. En móvil se apilan y la flecha apunta hacia abajo. Hoy lo usa Global Virtuoso (manual 2018 → 2026).
- Los párrafos que empiezan con [PENDIENTE] se muestran como "■ Pending" en desarrollo y no salen en producción, igual que las imágenes sin `src`. Un caso con `draft: true` no se publica.
- Un párrafo de un caso que empieza con `**Algo.**` saca ese rótulo a la columna de la izquierda, al lado de su texto, y la sección se abre con su titular solo arriba. Es para una sección que es una lista de puntos: hoy, Decisions de Global Virtuoso (Color, Type, Icons, Logo, Templates). El punto no se imprime en el rótulo. Sin rótulos, la sección mantiene el titular en las columnas 1 a 5 y el texto en la 6 a 12, alineados arriba.
- `src/lib/projects.ts`: `getProjects()` y `paragraphs()`. Componentes compartidos: `WorkRow`, `Seps`, `Pending` y `CaseMedia`.
- `src/pages/work/[slug].astro`: plantilla de caso de estudio. Los titulares de sección van en `--display-case`, un paso por debajo del H1 del caso, para que el salto al cuerpo siga siendo de 4x. El título del caso (H1) se lee entero en la primera pantalla, sin scroll, desde 1280 × 529: su tamaño es el menor entre `--display-xl`, el que deja entrar la línea más larga en el ancho de la grilla (`100cqi / --title-em`) y el que deja entrar todas sus líneas entre el kicker y el borde de abajo (svh). `--title-em` y `--title-lines` se calculan en el frontmatter estimando el ancho de cada línea por sus caracteres. El aire de arriba y el del kicker también dependen del alto. En un teléfono la itálica puede partirse; solo se cuida que la palabra más larga quepa.
- `src/pages/index.astro`: home. Secciones en `src/components/home/`.
- `src/scripts/motion/`: toda la animación con GSAP, cargada desde `Base.astro`. Cada módulo revisa si su sección existe y respeta `prefers-reduced-motion` con `gsap.matchMedia()`.
- Sección de video: `src/components/home/HomeVideo.astro` (marco, controles y reproducción), `src/scripts/motion/video.ts` (telón y línea, atados al scroll) y `src/lib/video.ts` (qué archivos de `public/video/` existen).
- Selección de video (caso 04): el campo `pieces` del caso lista las piezas y `src/components/VideoPiece.astro` dibuja cada una (titular, video incrustado y ficha). La duración y el formato no se escriben a mano: `src/lib/videoMeta.ts` los lee del .mp4 al generar el sitio (recorre las cajas mvhd y tkhd, como `imageSize.ts` con las imágenes). Las secciones del caso (problema, rol...) son opcionales; con `pieces`, el caso no muestra la portada grande (queda para el home). Otros campos opcionales del caso: `team` (sale en la columna de datos), `embed` (la app real incrustada, después de la portada), `figures` (cifras, después de la app) y `spotlight` (una banda Klein propia, después de la sección que diga `after`). Ver "Caso Mentta". Campos nuevos del caso: `years` (rango, gana sobre `year` en etiquetas y filas, con `yearLabel()` de `src/lib/projects.ts`) y `tools` (sale en la columna de datos del caso). Motion en `src/scripts/motion/pieces.ts`.

## Fases

1. Sistema base y plantilla de caso de estudio (hecho)
2. Home con hero de video (placeholder), disciplinas, trabajo, about y contacto
3. Pasada de motion con GSAP, siguiendo las reglas de Motion de este archivo
4. Revisión con `/impeccable audit`, `/impeccable quieter` y las skills de Emil
5. Publicar en Vercel

## Hero

- Headline a la izquierda (7 columnas) en dos líneas grandes: HEY. I MAKE / STUFF move. Arriba, la fila INTERACTIVE MEDIA DESIGNER ■ OPEN TO WORK ■ BASED IN COLOMBIA, WORKING WORLDWIDE: en dos líneas si no cabe, sin separadores sueltos al comienzo de una línea. En móvil, en columna y solo INTERACTIVE MEDIA DESIGNER y OPEN TO WORK: lo de Colombia y el mundo ya lo dicen la escarapela y la intro. Debajo, la línea que se escribe sola (en amarillo) y la subline.
- El hero completo, con la escarapela, cabe en la primera pantalla desde 1280 × 530 px: el headline y la escarapela se limitan también por el alto de la pantalla.
- El hero ocupa como mínimo la primera pantalla (`min-height: 100svh`), con su contenido centrado. Nada de la sección siguiente (ni el marco ni la cinta) asoma antes del primer scroll, bajo ninguna circunstancia.
- A la derecha (5 columnas), la escarapela colgando, con el lanyard saliendo por el borde superior de la pantalla. En móvil va debajo del headline y más pequeña.

### Escarapela (credencial de producción)

- Tarjeta vertical off-white #F2F2F0, esquinas rectas.
- Arriba, una banda Klein con "CREW PASS ■ 2026" en etiqueta blanca.
- El retrato de Jean en blanco y negro, en rectángulo duro, como foto de credencial.
- JEAN ALOMIA en Libre Franklin Black y, debajo, "Interactive media designer" en Urbanist.
- Sin fila de zonas de acceso: repetía las disciplinas.
- Los textos impresos de la tarjeta miden 11 px como mínimo, aunque la tarjeta se achique.
- Abajo, un código de barras de barras negras y "CALI, CO".
- El destello va como sticker en una esquina de la tarjeta, en azul eléctrico: el amarillo de la vista es la línea que se escribe sola.
- La foto queda limpia: sin botón de play. El video vive en su propia sección.
- La tarjeta va dentro de una funda de plástico transparente: ahí vive el liquid glass. La funda es un poco más grande que la tarjeta, con refracción en los bordes, brillo especular y borde de luz.
- Lanyard naranja #FF4D00 con "JEAN ALOMIA ■ STUFF move" impreso en negro y repetido. Clip negro de esquinas rectas.
- No es la de Tega: nada de esquinas redondeadas, nada rosado, y no gira para mostrar un reverso.

## Sección de video

- Va justo después del hero. El marco es lo primero que asoma en la primera bajada.
- Escritorio: marco 16:9 en 8 columnas, rotado -2°. Al lado, en las 4 columnas restantes y alineados arriba con el marco, "HI, I'M JEAN." y la línea de intro (no encima del marco).
- El video es el intro final: `public/video/hero.mp4` (1920 × 1080, 24 fps, 9,25 s, unos 5,8 MB, con audio), sin recomprimir, solo con faststart. Ya trae los emojis, los logos y los subtítulos quemados en la imagen. El póster `public/video/hero-poster.jpg` es su primer cuadro, con Jean mirando a cámara.
- No arranca solo: hay que darle Play. El clic lo arranca con sonido desde el primer momento; no hay botón de sonido ni opción de silencio. Se pausa si sale de la vista o si la pestaña se oculta, y no vuelve a sonar solo. Al terminar vuelve al póster.
- Un solo botón de vidrio arriba a la derecha: PLAY INTRO ■ 0:09 (la duración se lee del video) y, mientras suena, PAUSE. Pause se queda: WCAG 2.2.2 pide poder detener lo que se mueve más de 5 s. Al darle Play, el telón se va para siempre. Tocar el video también lo arranca o lo pausa. La franja de abajo queda libre para los subtítulos.
- Subtítulos: `public/video/hero.vtt`, sincronizados con la voz en 5 frases. La pista va en el video sin `default`, porque los subtítulos ya vienen quemados en la imagen y se verían dos veces.
- El telón y la línea, con el scroll (nunca coinciden: primero uno y después la otra):
  - El telón: un bloque Klein dentro del marco (gira con él) con "HI" recortado en Libre Franklin Black gigante; a través de las letras se ve el póster. Al bajar, la palabra se lee un buen rato (no completa, pero sí reconocible) y luego la cámara entra por la I: el telón crece desde el centro de la letra, acelerando al final, y el video revienta por ella hasta llenar el marco (un text matte zoom de motion). El botón de Play queda encima del telón.
  - Sin JS de motion o con movimiento reducido no hay telón: el video se ve desde el principio.
  - La línea: delgada, de azul eléctrico plano (3,3% del alto del marco, unos 16 px en 1440). Sale del borde izquierdo de la pantalla, hace un arco bajo por encima del marco y se mete detrás; reaparece por debajo del marco en una curva limpia y vuelve al borde izquierdo, arriba de Selected work. Nunca pasa por delante del video y sus dos puntas quedan fuera de la pantalla (el lazo y el cruce por delante se probaron y se quitaron).
  - El SVG de la línea y el del telón se miden en el marco, así que escalan con él sin deformarse. El marco es 16:9 en todos los tamaños, así que hay un solo trazo y un solo telón.
  - El zoom del telón termina cuando el centro del marco llega al 42% de la pantalla: con el marco centrado, en escritorio y en móvil, el telón ya salió.
  - Se probaron y descartaron: la culebra gruesa, el visor con timecode y la línea con lazo. Las alternativas de telón (cuenta regresiva 3, 2, 1 y persiana de cortes) quedaron como maquetas en `.impeccable/review/telones/`.
- En móvil, el mismo marco 16:9 a todo el ancho (en 4:5 se cortaban los emojis y los logos de los lados); el titular va debajo del marco. La línea usa el mismo trazo y su curva de la derecha queda dentro del marco.

## Caso Mentta (caso 03, `/work/mentta/`)

- Contenido en `src/content/projects/mentta.md` (antes `kin.md`). Título MENTTA en la caja azul con la itálica "where to eat". 2026, UX & Web design, Cali. Cliente: Universidad Icesi, cursos Investigación en Diseño y HCI. Equipo de 4: Jean (UX, front-end, líder de investigación, integración con Arduino Cloud), Mariana (librería de componentes, UI, datos de campo, Behance), Valentina (pruebas con usuarios, SUS, documentación) y Pablo (hardware Arduino/ESP32, sensor físico, Arduino Cloud). Lo que Jean no hizo va dicho en My role.
- Fuente de los textos: el brief de Jean. Fuente visual: el archivo de Figma (página PRESENTACION; solo responde por id de nodo, la lista de páginas muestra solo PROTOTIPO). Nodos usados: 1:690 (las 5 pantallas, imagen cruda sin el texto del slide), 1:643 (wireframes), 1:740 "Arduino diagram" con las fotos 1:815 del sensor y su recorrido de datos, y 1:468 y 1:509 (las 12 cafeterías). El prototipo de Figma está incompleto: no se usa.
- Orden de la página: apertura, portada (las 5 pantallas recortadas sobre Klein plano, a color), la app en vivo, las cifras, Problem, My role, Process (del wireframe a la pantalla final, arrastrando, y la grilla de las 12 cafeterías en blanco y negro), la banda del sensor, Decisions (con rótulos al margen) y Result.
- Del wireframe a la final (`WireCompare.astro`, una `media` del caso con `screens`): las 5 pantallas clave en fila sobre Klein, cada una en un marco de papel de esquinas rectas, con su nombre en inglés debajo (Admin panel, Cafeterias, Cafeteria menu, Your order, Your turn). Debajo de cada final está su wireframe; al arrastrar sobre las pantallas (mouse) o con la línea de abajo (un range nativo, el cuadrado blanco como cabezal) la final se descubre de izquierda a derecha en las cinco a la vez, con una línea naranja en el borde. Arranca en el wireframe. Al entrar a la vista, una sola vez, el barrido se abre hasta casi la mitad y vuelve (`motion/compare.ts`): comunica que se arrastra. En móvil la fila se desliza con el dedo y el barrido va con la línea.
- Los wireframes de Figma (nodo 1:643) son una imagen hecha fuera de Figma, en perspectiva, que no calza con las pantallas. El 2026-10-19 se rehicieron en Figma, en la página "Wireframes pixel perfect" del archivo `M36BaYiD8Tdgpy9bgfh5U1`: 5 frames de 288 × 632 calcados sobre las pantallas finales (recortadas de la imagen original del nodo 1:699, sin el teléfono, la barra de estado ni la del navegador), con las 5 finales debajo como referencia. Cada caja cae sobre su elemento. Archivos en `public/work/mentta/screens/`: `wire-1.png` a `wire-5.png` (exportados de Figma a 2x, 576 × 1264) y `final-1.jpg` a `final-5.jpg` (la misma medida).
- La app en vivo (`embed`, `src/components/LiveEmbed.astro`): `https://icesi-come.vercel.app/login` en un iframe dentro de un teléfono de papel de esquinas rectas, rotado -2° (un objeto, como la escarapela). La app se dibuja a 390 × 844 y se escala para caber en 5 columnas y en el 84% del alto de la pantalla. El sitio no manda X-Frame-Options ni CSP, por eso se puede incrustar. El login y el pago de la app son simulados (verificado en su código: aceptan cualquier correo y contraseña no vacíos y la única llamada de red es `/api/personas`, la cuenta del sensor), y la página se lo dice al visitante. La interfaz de la app está en español. Al lado, cómo entrar y qué probar (estudiante y administrador) y el enlace para abrirla en otra pestaña, a la altura del pie del teléfono. No se usan los colores de Mentta (#5454E9, Satoshi): manda el sistema del portafolio.
- Las cifras (`figures`, `src/components/CaseFigures.astro`): 85, 12, 10, 3, 5, 95, 100% y 39.2 s, cada número en Libre Franklin Black sobre su etiqueta, 4 por fila (2 entre 761 y 1100 px y en móvil). La unidad va en la itálica fina. Cada dígito gira como rodillo de contador hasta su cifra (`src/scripts/motion/figures.ts`).
- El sensor (`spotlight`, `src/components/Spotlight.astro`): un campo Klein a todo el ancho después de Process. Con primer plano (`detail`), la banda es un pliego: la imagen grande en las columnas 1 a 7 (el sensor instalado frente al mostrador de Isabela, `sensor-isabela.jpg`, recortado de la foto original 4284 × 5712, sin retoque) y al lado, en la 8 a 12 y alineados arriba con ella, el titular THE SENSOR, el texto y el recorrido de los datos en 5 pasos; sin primer plano, titular y texto en 5/7 como las secciones; abajo, las 4 fotos del sensor en blanco y negro (3:4). Es la prueba de que el hardware existe. El sensor se instaló en Isabela y afuera en el campus (confirmado por Jean). Las reservas fantasma salieron del feedback de usuarios, no del profesor (confirmado por Jean). Las fotos entran en orden y los pasos se encienden de izquierda a derecha (`src/scripts/motion/spotlight.ts`).
- Archivos en `public/work/mentta/`: `cover.jpg`, `field.jpg` (la grilla de 12), `sensor-1.jpg` a `sensor-4.jpg`, `sensor-isabela.jpg` y `screens/` (wireframes y finales). Las fotos de las 12 cafeterías y las del sensor las tomó el equipo (confirmado por Jean).

## Caso TripSync (caso 02, `/work/tripsync/`)

- Contenido en `src/content/projects/tripsync.md`; datos y respuestas de Jean en `FICHA-TRIPSYNC.md`. Título TRIPSYNC en la caja azul con la itálica "all in one place" (el lema del propio proyecto). 2026, UX & Web design. Cliente: Universidad Icesi, curso de Programación Web. Equipo de 3: Jean (fullstack: Budget Tracker, Experiences, Trip Sharing, tiempo real y arquitectura, 100 commits; diseñó las pantallas de escritorio y móvil), Valentina Barreiro (frontend, componentes UI, Jet Lag, Schedule, Admin Experiences, 111 commits) y María José Castro (backend Express y base de datos, 35 commits).
- Fuente visual: el Figma `x4FlfAaWsLxNKsLzg0qT5L`. Escritorio en "UI Desktop" (sección User y Admin), móvil en "UI Mobile", versión vieja en "Draft UI Desktop", entregas en "Behance", "Behance Web 2" y "Behance Web 3". Las páginas "Behance" y "Behance Majo y Valen" son tan pesadas que solo se leen por id de nodo.
- El prototipo (`prototype`, `src/components/PrototypeEmbed.astro`): la app real pide cuenta, así que va el prototipo de Figma incrustado. Desde 2026-10-19 las dos vistas van lado a lado y a la misma altura, sin pestañas (cambiar de pestaña obligaba a esperar otra carga): Desktop (flujo desde Sign Up, nodo 703:1919) a la izquierda y Mobile (desde register mobile, nodo 246:11082) a la derecha. La altura sale del ancho de la grilla repartido entre las dos proporciones, sin pasar del 78% del alto de la pantalla. Cada vista lleva su nombre con el cuadrado naranja y su enlace "Open in Figma" (`views[].link`). Hasta 1100 px se apilan; en teléfonos va primero Mobile. Fondo negro (`bg-color=0a0a0a`) y sin controles de Figma (`hide-ui=1`); Figma dibuja su propio laptop o teléfono. El archivo está compartido por enlace: el embed carga sin iniciar sesión.
- El móvil del Figma se recoloreó el 2026-10-18 con la paleta del rediseño de escritorio, y su prototipo se reparó (ver `FICHA-TRIPSYNC.md`). La página de respaldo con los colores viejos se borró a pedido de Jean; la versión anterior queda en el historial de versiones de Figma.
- El 2026-10-19 los formularios de los dos prototipos quedaron interactivos con variables de Figma (colección "Prototype"): vienen llenos con datos por defecto y cada opción se puede cambiar (lista de países, calendario, lista de horas, categorías). Los selectores viven dentro de cada pantalla, con su visibilidad atada a un booleano. Se arreglaron además los enlaces rotos del escritorio. La recomendación en tiempo real no aparece sola: arriba a la derecha del dashboard hay un aviso mostaza, "● 1 new recommendation →", que la abre; después de verla, el aviso desaparece (variable Push/New). Detalle en `FICHA-TRIPSYNC.md`.
- La banda Klein (`spotlight`) es Trip Sharing, "Travel together": la pantalla del QR a color (`detail` con `color: true`, entera y con su proporción) y los 4 pasos.
- El repositorio público (`repo`, https://github.com/jeanalo/TRIPSYNC) sale como "Code" en la columna de datos de la apertura, con subrayado fino y flecha; se abre en otra pestaña. Ojo: el README del repo lista solo a Jean y Valentina como autores, falta María José.
- Result cierra con la misma comparación que Mentta (`WireCompare.astro`): 5 de las 23 pantallas móviles (Dashboard, Budget tracker, Jet lag assistant, Experiences, New activity), del wireframe a la final, arrastrando. Las pantallas son reales del Figma, así que los wireframes no se calcaron a ojo: se generaron desde la geometría de cada capa. Están en la página "Wireframes pixel perfect" del archivo: arriba los 5 wireframes y abajo las 5 finales, cada una armada como la vista de un teléfono de 440 × 956 (la pantalla real, con el encabezado arriba y la barra de abajo al pie). Si una pantalla cambia, se rearma la final y se vuelve a generar su wireframe.
- Archivos en `public/work/tripsync/`: `cover.jpg` (dashboard de escritorio y de móvil sobre Klein), `share-qr.jpg`, `redesign.jpg` (antes y después del dashboard, chico, 8/4) y `screens/` (`wire-1.png` a `wire-5.png` y `final-1.jpg` a `final-5.jpg`, 440 × 956, exportados del Figma). `mobile.jpg` se borró: lo reemplazó la comparación.

## Selección de video (caso 04, `/work/video-editing/`)

- Contenido en `src/content/projects/video-editing.md` (perfil C de PEDIR-INFO-PROYECTOS.md): una intro corta y una ficha por pieza. Título SELECTED EDITS, caja azul en EDITS, itálica "frame by frame". En la lista del home se llama VIDEO. Años 2024 to 2026. Disciplinas: Video editing y Motion. Herramientas: Premiere Pro ■ After Effects ■ CapCut.
- Las tres piezas, en este orden:
  1. Interactive Media Design: Universidad Icesi (atracción de estudiantes, Marketing), Institutional, 2024, en inglés. 1:14, vertical 9:16 (1080 × 1920).
  2. Puerta Abierta: Skema Promotora (proyecto académico, Universidad Icesi), Promo, 2026, voz en español sin subtítulos. 2:54, horizontal 16:9 (1920 × 1080, 60 fps).
  3. Pedro el Escamoso (dubbing exercise): personal y académico (Universidad Icesi), Personal, 2024, en español. 4:12, horizontal 16:9 (1280 × 720). Lleva bajo el video la nota de derechos: la escena y los personajes son de sus titulares, es un ejercicio de doblaje sin fines comerciales.
- Archivos en `public/work/video-editing/`: el video (`<pieza>.mp4`, H.264 High, `+faststart`, sin subir de resolución, el audio original copiado sin recomprimir) y su póster (`<pieza>.jpg`, un cuadro fuerte del propio video a su tamaño original, nunca el primero en negro). Los .mov originales quedan en la raíz del proyecto, fuera de `public/`: no se publican. Puerta Abierta ya venía en H.264: solo se le reordenó el archivo para el faststart, sin recomprimir.
- La portada del home es el póster de la familia (ver "Portadas"), con la tira de cine y los tres cuadros.
- Cada pieza: número (01 / 03) y titular a todo el ancho en `--display-case`; debajo, el marco y la ficha en zigzag (la primera con el marco a la izquierda, la segunda a la derecha...). Horizontal: marco en 8 columnas y ficha en 4. Vertical: marco en 5 (limitado al 78% del alto de la pantalla, se ve entero) y ficha en 7, desde la columna 6 como el cuerpo de los casos. Entre 761 y 1100 px la ficha baja debajo del marco; en móvil todo va en una columna.
- La ficha: grilla de créditos (Client, Type, Year, Duration, Format, Language) y después My role, What it was for y What makes it good. Tres tamaños: titular, cuerpo y etiqueta.
- Reproducción: como la intro del home. No arranca sola, Play la arranca con sonido, suena una sola pieza a la vez, se pausa si sale de la vista o si la pestaña se oculta, y al terminar vuelve a su póster. Botón de vidrio PLAY ■ duración / PAUSE arriba a la derecha. Debajo del marco, una línea de tiempo de edición (no es vidrio): barra con relleno azul eléctrico, el cuadrado naranja como cabezal (un range nativo, con teclado y lector de pantalla), tiempo y FULL SCREEN. En pantalla completa salen los controles del navegador. Sin JS, el video trae los controles del navegador. `preload="none"`: nada se descarga hasta darle Play.
- Sin enlaces externos: los tres videos van incrustados.

## Copy base

- Headline: HEY. I MAKE STUFF move.
- Subline: Loud enough to notice, clear enough to use.
- Disciplinas: BRANDING / VIDEO EDITING / UX & WEB DESIGN / MOTION
- Fila sobre el titular: INTERACTIVE MEDIA DESIGNER ■ OPEN TO WORK ■ BASED IN COLOMBIA, WORKING WORLDWIDE
- Titular de la sección de video: HI, I'M JEAN.
- Intro, al lado del titular: I help companies around the world look sharp and make sense: brand identities, websites and interfaces people actually enjoy using, and videos and motion that tell their story. From logo to screen, one language. Cabe al lado del marco sin pasar su alto; entre 761 y 1000 px va debajo del marco.
- Botón del video: PLAY INTRO ■ duración / PAUSE. Telón: HI.
- Línea que se escribe sola: Editing video / Building brand systems / Designing interfaces / Animating type
- Herramientas (en About), tres kits, podados por Jean el 2026-10-19: Tools (Premiere Pro ■ After Effects ■ DaVinci Resolve ■ CapCut ■ Figma ■ Illustrator ■ Photoshop ■ Lightroom ■ InDesign ■ Audition ■ Blender ■ Canva ■ Framer), Code (React ■ Astro ■ JavaScript ■ TypeScript ■ HTML ■ CSS ■ Tailwind CSS ■ Node.js ■ Firebase ■ Git ■ Arduino (C++); quitó GSAP y cambió Supabase por Firebase) y AI tools agrupadas por categoría en dos columnas: Assistants & agents (Claude, Claude Code, Claude Agents, ChatGPT, Gemini, NotebookLM), Video (Veo, Sora, Runway, Kling, Google Flow, Hedra), Image (Midjourney, Firefly) y Audio (ElevenLabs, Suno).
- Bio (About), dos párrafos: "I love audiovisual media and communication: editing, motion, and the moment a message finally clicks. I bring that into brands, videos, interfaces and websites, always with user experience at the center. If it looks great but is hard to use, it isn't finished." / "I use AI every day, and teach teams to use it well: it helps me move faster and explore further, but the final call is always mine as a designer."
- Education: Bachelor's in Interactive Media Design, Universidad Icesi, Cali. In progress. Availability: Open to freelance projects now. Languages: Spanish (native) ■ English (C1).
- Nunca usar em dashes (—) en el copy del sitio.
- Nunca inventar datos de proyectos, clientes, métricas ni testimonios. Si falta información, marcarla como [PENDIENTE].

## Revisión

Al terminar cada tarea:

1. Actualiza las capturas en `.impeccable/review/`:
   - `desktop.png`: página completa a 1440 px de ancho.
   - `mobile.png`: página completa a 390 px de ancho.
   - Si tocaste animación, frames de motion (`motion-*.png`) tomados a mitad de la animación o del scroll.
   - `node scripts/capture.mjs` las genera con Chrome headless (ver el archivo para opciones). El servidor de desarrollo tiene que estar corriendo en `localhost:4321`.
2. Escribe `.impeccable/review/REPORT.md`, reemplazando el anterior, con tres partes: lo que cambiaste, lo que quedó pendiente y tus preguntas para Jean.

## Proyectos (casos de estudio)

1. Global Virtuoso: rebrand y manual de marca (108 páginas) para una empresa con sedes en Manila y Dubái. Caso publicado, con texto real, la comparación 2018 → 2026 en la apertura y las páginas del manual a color. Imágenes en `public/work/global-virtuoso/`.
2. TripSync, `/work/tripsync/`, 2026: app web de planeación de viajes para el curso de Programación Web de la Universidad Icesi. Publicado. Ver "Caso TripSync".
3. Mentta (antes Kin), `/work/mentta/`, 2026: sistema de información de comida para las 12 cafeterías de la Universidad Icesi, para los cursos Investigación en Diseño y HCI. Publicado. Ver "Caso Mentta".
4. Selected edits (VIDEO en el home), 2024 a 2026: tres piezas de video incrustadas con su ficha (Interactive Media Design, Puerta Abierta y Pedro el Escamoso). Publicado, de último a pedido de Jean. Ver "Selección de video".

El orden del home es GV, TripSync, Mentta y Video (el campo `order` de cada caso).

## Portadas (la familia)

- Las cuatro portadas del home son una familia y se generan con `node scripts/covers/build.mjs` (insumos en `scripts/covers/art/`): campo negro con grano, un filete offwhite adentro (2px al 22%, con un cuadrado naranja en su esquina superior derecha), la fila de datos arriba a la izquierda (PROJECT / TYPE / YEAR, etiqueta apagada sobre valor blanco), el título con la firma de la casa abajo a la izquierda (caja azul rotada -2° + itálica fina con punto naranja), la palabra fantasma detrás y la pieza de cada caso a la derecha, rotada -2°. 2400 × 1350, `public/work/<caso>/cover.jpg`.
- La pieza de cada una: GV, la página del manual 2026 en papel con la de 2018 asomando detrás en blanco y negro; TripSync, el portátil con el dashboard (sacado de la portada del Behance en su Figma) y un celular con el dashboard móvil delante, en un marco de teléfono dibujado; Mentta, tres pantallas en abanico (al estilo del proyecto viejo KORA que Jean mandó de referencia). Los dispositivos de TripSync y Mentta van sobre un halo radial azul, no sobre un campo duro: el campo Klein plano se veía disruptivo. Video, una tira de cine offwhite cortada arriba y abajo, con un cuadro de cada pieza y su timecode.
- En la página del caso la portada no se repite (ya está el H1): Mentta y TripSync abren con `opening` (`/work/<caso>/opening.jpg`, sus portadas anteriores), GV abre con `compare` y Video con sus piezas.
- En el home, un clic en la portada grande también abre el caso (es un enlace con `tabindex="-1"` y `aria-hidden`: la fila ya es el enlace accesible); solo la portada activa recibe el clic.
5. Pendiente: caso UX del rediseño del sitio web de Global Virtuoso
