=== DATOS ===
TITLE: TripSync
SHORT TITLE: TripSync
CLIENT: Universidad Icesi, Web Programming course
LOCATION: Cali, Colombia
YEAR: 2026
ROLE: Fullstack developer and UI designer
DISCIPLINES: UX & Web design
DELIVERABLES:
  React web app with 2 profiles, traveler and admin, and 9 core features
  53 screens designed in Figma, 30 desktop and 23 mobile, fully prototyped
  Benchmark of 5 travel apps, 18-week route map and code of conduct
  Persona, user journey, flow chart, component and database diagrams
  Public deployment on Vercel and a GitHub repository with 246 commits
  Lighthouse audit, 93 in Accessibility and 100 in Best Practices
STACK: React 19, TypeScript, Vite, React Router, Tailwind CSS, React Context API, React Hook Form, Recharts, Motion, Lucide, Supabase (Auth, database, Realtime), Express, Socket.IO, REST Countries API, Unsplash API, qrcode.react, ESLint, Prettier
URL: https://tripsync-xoxn.vercel.app/ (desplegada, pero pide cuenta y no hay usuario de prueba)
LIVE: No para el visitante. En la página va el prototipo de Figma incrustado, escritorio y móvil.

El texto final de cada sección vive en src/content/projects/tripsync.md (es la fuente de la página).

=== RESPUESTAS DE JEAN (2026-10-18) ===
1. Año: 2026.
2. Rol: fullstack. Diseñó las pantallas de escritorio y móvil.
3. Sin usuario de prueba: la página usa el prototipo de Figma.
4. Stack: el profesor permitió Context API y Supabase en vez de Redux y Firebase.
5. Jet Lag: usa la diferencia horaria entre países.
6. Trip Sharing: un amigo se une a tu viaje con un QR y ve la misma información.
7. Sin nota ni feedback de la presentación final, y no se incluye.
8. La versión vieja está en la página "Draft UI Desktop" del Figma. Va chica, como antes y después del dashboard.

=== CAMBIOS EN EL FIGMA (2026-10-18) ===
- La página "UI Mobile" se recoloreó con la paleta del rediseño de escritorio: fondo blanco, títulos azules, formularios en panel menta con campos blancos de borde teal, botones azules, paneles blancos de borde azul, tarjetas de experiencias azules con "See details" mostaza, menú lateral blanco.
- Respaldo: la página "UI Mobile (backup old colors)" se borró a pedido de Jean. La versión anterior sigue en el historial de versiones de Figma.
- Prototipo móvil reparado: Home en la barra inferior abría el menú en 14 pantallas (ahora va al Dashboard); la X cerraba solo 1 de los 7 menús (ahora vuelve atrás en todos); "Back to Schedule" no estaba conectado; las tarjetas de los filtros no abrían su detalle (26 conexiones nuevas); el detalle de Sunset Kayaking no tenía barra inferior (se agregó); encabezado y barra inferior quedan fijos al hacer scroll en 20 pantallas.
- Verificado: 279 conexiones, ninguna rota, todas las pantallas alcanzables desde el inicio.

=== CAMBIOS EN EL FIGMA (2026-10-19) ===
Pedido de Jean: que en los dos prototipos se pueda elegir todo, con los datos por defecto puestos para quien solo quiera ver el flujo.
- Colección de variables "Prototype" (modo Default). Valores: Trip/From "Cali, Colombia", Trip/To "Tokio, Japan", Trip/Depart "21-02-2026", Trip/Arrive "27-02-2026", Trip/Status "No trip scheduled", Jet Lag/Departure Time "14:30", Jet Lag/Arrival Time "22:45", Expense/Category "Food", Expense/Date "27-02-2026", Activity/Date "28-02-2026", Activity/Time "10:00", Activity/Category "Free Tour". Más un booleano Open/... por selector, Calendar/February y Calendar/March, y Push/Seen.
- Selectores dentro de cada pantalla (no overlays: la API no deja ubicar un overlay junto al campo). Cada uno es un panel bajo su campo con visibilidad atada a su Open/..., más una capa casi transparente detrás que lo cierra al tocar afuera. Los campos llevan un chevron a la derecha.
  - País: lista de 10 ciudades con scroll (Cali, Bogotá, Medellín, Tokio, Seúl, París, Madrid, Londres, Nueva York, Ciudad de México).
  - Fecha: calendario de febrero y marzo de 2026, con flechas entre los dos meses. Guarda "DD-MM-2026".
  - Hora: lista de 12 horas con scroll. Categoría de gasto: Food, Accommodation, Transport, Activities, Shopping. Categoría de actividad: Free Tour, Cultural, Adventure, Chill.
  - Cada pantalla con selectores los cierra todos al abrirse (After delay de 1 ms).
- Escritorio: Trip Setup, Jet Lag 1 y 2, Add Expense (Budget 2) y Add Activity (Schedule 2). Móvil: TripSetup, Jetlag y Jetlag2, los dos Add New Expense y Add New Activity. Los países de Jet Lag usan los mismos datos que Trip Setup.
- Móvil: los campos vacíos o con placeholder ("e.g. USA", "Origin") quedaron con los mismos valores por defecto del escritorio. Los textos libres, que un prototipo no deja escribir, quedaron llenos: Tokio Skytree, 1 Chome-1-2 Oshiage, Amazing experience., Dinner at local market, 45.00 y un presupuesto de 3,500.
- Save Trip Details guarda el destino en Trip/Status: la tarjeta Trip Setup del dashboard (escritorio y móvil) muestra el destino elegido en vez de "No trip scheduled".
- Escritorio, enlaces arreglados: Add Expense (Budget 1 y alerta) abría el dashboard con QR, ahora abre Add Expense; Add Activity igual, ahora abre Add Activity; Details del itinerario abre el detalle del Free Tour; Sign Out va al login; Save Trip Details va al dashboard; Save Expense muestra la alerta de presupuesto y Got it! vuelve a Budget; Save Activity vuelve al itinerario; Budget Tracker en Add Activity abría Jet Lag; las tarjetas Schedule y Budget del dashboard abren su sección; Share Trip en el dashboard con QR lo cierra; los filtros de Experiences (36 chips en 6 pantallas) abrían el dashboard con QR y ahora abren su lista.
- Escritorio, tiempo real: la recomendación "New Experience Available" ya no aparece sola (pedido de Jean). Arriba a la derecha del dashboard, encima de Share Trip, hay un aviso mostaza "● 1 new recommendation →" (el color del botón del aviso) que la abre con un clic. Al verla, el aviso se va (variable Push/New, antes Push/Seen). View Details abre Experiences; tocar afuera la cierra.
- Probado en el prototipo incrustado: país, calendario con cambio de mes, Save Trip Details, la recomendación (llega una sola vez) y en móvil la lista de horas con scroll.
- Sin cambiar: Edit Profile (los campos del perfil son texto libre, no hay nada que guardar; Jean decidió dejarlo sin acción) y Generate Plan en Jet Lag 2 (ya es la pantalla del plan).

=== WIREFRAMES PIXEL PERFECT (2026-10-19) ===
- El Figma no tenía wireframes (revisadas todas las páginas, también las dos de Behance). Pedido de Jean: calcarlos sobre 5 pantallas móviles y hacer la comparación arrastrable, como en Mentta.
- Página nueva "Wireframes pixel perfect": arriba "Wireframe 01" a "05", abajo "Final 01" a "05". Cada final es una copia de la pantalla móvil armada como la vista de un teléfono de 440 × 956: el encabezado arriba, la barra de abajo al pie y el resto recortado. Pantallas: Dashboard mobile, Budget2 Mobile, Jetlag Mobile, Experiences mobile y Schedule Mobile (Add New Activity), con los valores por defecto del prototipo.
- Los wireframes se generaron desde las capas de cada final: cada texto es una barra del ancho real de sus líneas, cada campo o tarjeta un rectángulo con su mismo radio, los botones de color en gris oscuro, las imágenes una caja con X, los íconos un cuadrado y el gráfico de Budget dos anillos. Por eso calzan exacto.
- En la web: Result, con `public/work/tripsync/screens/`. Se borró `mobile.jpg`.
