---
title: Mentta
boxed: Mentta
accent: where to eat
client: Universidad Icesi, Investigación en Diseño and HCI courses
location: Cali, Colombia
year: 2026
role: UX designer, product researcher, and front-end developer
team: 4 people
disciplines:
  - UX & Web design
deliverables:
  - High-fidelity React web app, 2 user profiles (student and admin), fully navigable
  - Arduino/ESP32 physical people-counting sensor with Arduino Cloud integration
  - Research report following Okoli and Schabram (2010) systematic review protocol
  - Primary survey, 85 Icesi community members
  - SUS evaluation with 5 real users, average score 95 out of 100
  - Adaptive queue threshold table across 12 cafeterias
summary: >-
  Mentta is a mobile-first web app that centralizes the gastronomic offer of all
  12 cafeterias at Universidad Icesi in Cali. I led the UX design and front-end
  development of a system that lets students check real-time queue data from an
  Arduino sensor, browse menus with AI-generated food photos, and reserve meals
  with upfront payment before leaving the classroom. The project was built for
  two simultaneous university courses and produced a research-backed prototype
  that scored 95 out of 100 on the System Usability Scale with real Icesi users.
# Portada: las 5 pantallas clave (Figma, nodo 1:690) recortadas sobre Klein plano. A color: es interfaz.
cover: /work/mentta/cover.jpg
opening: /work/mentta/opening.jpg
coverColor: true
order: 3
draft: false
embed:
  src: https://icesi-come.vercel.app/login
  title: Mentta, live prototype
  boxed: Try
  accent: it live
  text: |
    This is the deployed prototype, not a recording. Choose Estudiante for the
    student flow or Administrador for the cafeteria panel, then type any email
    and password. Login and payment are simulated, so nothing you type leaves
    your browser.

    As a student, run the full reservation: pick a cafeteria, add a dish, choose
    a pickup time, pay and get your QR turn. The interface is in Spanish, as it
    was built for the Icesi community.

    As an admin, you get the other side of the same order: the order list, menu
    editing and the live queue monitor fed by the sensor.
figures:
  title: Research and testing
  items:
    - value: "85"
      label: Icesi community members surveyed
    - value: "12"
      label: Cafeterias observed and timed at peak and off-peak hours
    - value: "10"
      label: International studies in the systematic literature review
    - value: "3"
      label: Evaluators in the heuristic review, 4 issues fixed before testing
    - value: "5"
      label: Real users in Think Aloud testing across 4 tasks
    - value: "95"
      label: Average SUS score out of 100, in the Excellent tier
    - value: "100%"
      label: Task completion across all users
    - value: "39.2 s"
      label: To reserve and pay, against a target of under 45 s
spotlight:
  after: process
  title: The sensor
  text: |
    Mentta reads its queue data from a physical people counter. We installed it
    on the queue posts at Isabela and outdoors on campus. An ultrasonic sensor
    detects people coming in and going out, an Arduino with an ESP32 module counts
    entries minus exits, and Arduino Cloud syncs the result in real time. The web
    app reads that count through Arduino Cloud's REST API and turns it into the
    traffic light for that cafeteria.

    Pablo built the hardware, programmed the ESP32 and configured Arduino Cloud.
    I integrated that live data into the web app and the admin queue monitor.
  steps:
    - A person enters or leaves the queue
    - The ultrasonic sensor detects the movement
    - The ESP32 counts entries minus exits
    - Arduino Cloud syncs the count in real time
    - Mentta updates the traffic light for that cafeteria
  detail:
    src: /work/mentta/sensor-isabela.jpg
    alt: Close-up of the sensor housing on a queue post in front of the Isabela counter
    caption: The sensor in place at Isabela, on the queue post in front of the counter.
  photos:
    - src: /work/mentta/sensor-1.jpg
      alt: The prototype sensor on top of a queue post, outdoors on campus
    - src: /work/mentta/sensor-2.jpg
      alt: The sensor mounted on a queue post in front of the Isabela counter
    - src: /work/mentta/sensor-3.jpg
      alt: The queue posts with the sensor at Isabela, seen from the side
    - src: /work/mentta/sensor-4.jpg
      alt: The sensor on a queue post outdoors, next to the planters
  caption: The prototype sensor, mounted on queue posts at Isabela and outdoors on campus.
sections:
  problem: |
    Universidad Icesi has 12 cafeterias serving 8,026 students, faculty and
    staff. Despite the variety, 68% of users are only partially aware or
    completely unaware of what is available on campus. 39% go exclusively to
    Isabela, leaving 11 other locations underutilized.

    72% have abandoned a queue at least once due to excessive wait times. The
    overall cafeteria experience receives an average rating of 3.6 out of 5,
    with only 7% of users rating it excellent.

    The root cause is not the food, it is information asymmetry. There is no
    single place where a student can check menus, prices, queue lengths or
    occupancy before deciding where to eat.

    60% of users rely on word of mouth from classmates. 21% never find out about
    new options at all. Screens and posters inside cafeterias reach only 15% of
    users and rarely show real-time data.

    The consequence plays out every day between 1:00 and 1:45 PM, when most
    students have exactly one hour to eat before their next class. Without
    information, they default to the familiar.

    Isabela gets overwhelmed while other cafeterias sit empty. Students arrive
    at the counter only to find their dish is sold out. Some leave campus and
    use Rappi instead, a direct loss for the institution's own food ecosystem.
  role: |
    I was responsible for the end-to-end UX and front-end of the project. I
    defined the information architecture for both user profiles, student and
    cafeteria admin, built the full high-fidelity prototype in React with Vite
    and Tailwind, designed the dark-first visual system, and integrated the live
    Arduino sensor data into the web app via Arduino Cloud's REST API. I also led
    the systematic literature review, co-wrote the research report, and
    coordinated the data pipeline that connected field observations to design
    decisions.

    What I did not do: I did not build the Arduino hardware. Pablo handled all
    physical sensor construction, ESP32 programming and Arduino Cloud
    configuration. Mariana designed the component library in Figma and built the
    Behance case study with Valentina. Valentina conducted all user testing
    sessions and calculated the SUS results.
  process:
    text: |
      The project followed a Double Diamond structure across three weeks. In the
      discovery phase, we surveyed 85 Icesi community members and conducted timed
      field observations at all 12 cafeterias during peak and off-peak hours. We
      measured how long each queue took per person and photographed the spaces.

      That field data became the calibration source for the adaptive threshold
      system. The green, orange and red indicators are not universal, they are set
      per cafeteria based on actual measured capacity. Isabela's threshold for a
      long queue starts at 30 people. Café Quindío's starts at 7.

      Alongside the survey, we ran a systematic literature review following the
      Okoli and Schabram protocol, analyzing 10 international studies on digital
      cafeteria systems. The most significant finding was a gap: every prior study
      addressed a single cafeteria. None had designed for a multi-location
      ecosystem where the goal is behavioral routing, nudging users toward
      underutilized options. That gap became our original contribution.

      Before building, we evaluated four alternatives: physical screens at each
      cafeteria, a messaging channel bot, a native iOS/Android app, and a
      progressive web app. The first three were discarded for concrete reasons.
      Screens deliver information only after the user is already in line.

      A bot does not support payment or comparative browsing. A native app creates
      an adoption barrier through mandatory installation. We chose the PWA because
      it removes friction, works on any device, and supports all three required
      components: information, payment-backed reservation, and physical sensor
      data.

      Before user testing, we conducted an internal heuristic evaluation using
      Nielsen's 10 heuristics with 3 evaluators. This surfaced 4 issues, two at
      severity 3 and two at severity 2, all corrected before the Think Aloud
      sessions.

      After corrections, we ran usability testing with 5 real Icesi users across 4
      tasks using Think Aloud protocol plus SUS. The average score was 95 out of
      100. Task completion was 100% across all users. The main qualitative finding
      was that users expressed confidence in the payment flow and said the app
      would change which cafeteria they visit.
    media:
      - caption: The five key screens, from wireframe to final interface. Drag across them.
        layout: full
        color: true
        screens:
          - name: Admin panel
            wire: /work/mentta/screens/wire-1.png
            final: /work/mentta/screens/final-1.jpg
          - name: Cafeterias
            wire: /work/mentta/screens/wire-2.png
            final: /work/mentta/screens/final-2.jpg
          - name: Cafeteria menu
            wire: /work/mentta/screens/wire-3.png
            final: /work/mentta/screens/final-3.jpg
          - name: Your order
            wire: /work/mentta/screens/wire-4.png
            final: /work/mentta/screens/final-4.jpg
          - name: Your turn
            wire: /work/mentta/screens/wire-5.png
            final: /work/mentta/screens/final-5.jpg
      - src: /work/mentta/field.jpg
        alt: The 12 cafeterias of Universidad Icesi, from Caffesabor and Anthony Chef to Isabela and Wonka
        caption: The 12 cafeterias, photographed and timed by our team at peak and off-peak hours.
        layout: full
  decisions: |
    **Dark-first surfaces.** The interface uses a layered dark surface system,
    five shades from #0C0C0F to #2E2E3A, rather than pure black. The goal was to
    make food photography pop. Every food card is white, which makes the
    AI-generated dish photos the richest visual element on any screen. The
    dark-light hybrid was a deliberate inversion of the typical dark mode
    approach: here dark is operational, light is editorial.

    **Adaptive queue thresholds.** We measured actual queue speeds at each
    cafeteria. Isabela has 3 simultaneous queues and a high-volume kitchen, while
    Café Quindío has 1 queue and serves coffee. Applying the same green, orange and red
    thresholds to both would have made the indicator meaningless. Each
    cafeteria's threshold is calibrated to its real capacity, so the number that
    feeds the color is a count relative to that location's measured throughput.

    **Payment before reservation.** User feedback surfaced a structural risk: if
    a user can reserve without paying, the cafeteria holds inventory for a ghost
    order, and other users arriving in person cannot buy that item. Making payment mandatory before a reservation is confirmed
    eliminates this failure mode entirely. The QR code is generated only after
    payment and invalidates itself on first scan.

    **Single-use QR turn code.** Rather than a numbered ticket, each reservation
    generates a dynamic QR unique to that transaction. The admin scans it, the
    system marks it as claimed and renders it visually expired. This closes the
    full transaction loop and prevents duplication or forwarding of the code.

    **One Arduino sensor, honest architecture.** We had one physical sensor for
    the demo. Rather than pretend it covered all 12 locations, the system is
    architecturally honest. The live data feeds only the location where the
    sensor is installed (we deployed it at Isabela and outdoors on campus), and
    the rest use calibrated static values from our field measurements. The future work section explicitly calls for 24 independent
    sensor devices, two per cafeteria, to scale this properly.
  result: |
    The project was delivered on June 3, 2026. The prototype is live at
    icesi-come.vercel.app and includes the full student flow with campus list,
    cafeteria menu, cart, payment and QR turn, the admin panel with order
    management, menu editing and live queue monitor, global search across all 12
    cafeterias, a ratings and reviews system, and an Arduino sensor integration
    for real-time queue data.

    SUS average across 5 users was 95 out of 100, which falls in the Excellent
    tier. Task success rate was 100%. Task T3, completing the full reservation and
    payment flow, averaged 39.2 seconds, within the design target of under 45
    seconds.

    Two users explicitly said they would change which cafeteria they go to based
    on the queue information, which partially validates the hypothesis about
    traffic redistribution. Full validation of actual wait time reduction requires
    real-world deployment with sensors at all 12 locations, which was not in scope
    for the academic prototype.
---
