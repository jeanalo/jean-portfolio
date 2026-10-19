---
title: TripSync
boxed: TripSync
accent: all in one place
client: Universidad Icesi, Web Programming course
location: Cali, Colombia
year: 2026
role: Fullstack developer and UI designer
team: 3 people
repo: https://github.com/jeanalo/TRIPSYNC
disciplines:
  - UX & Web design
deliverables:
  - React web app with 2 profiles, traveler and admin, and 9 core features
  - 53 screens designed in Figma, 30 desktop and 23 mobile, fully prototyped
  - Benchmark of 5 travel apps, 18-week route map and code of conduct
  - Persona, user journey, flow chart, component and database diagrams
  - Public deployment on Vercel and a GitHub repository with 246 commits
  - Lighthouse audit, 93 in Accessibility and 100 in Best Practices
summary: >-
  TripSync is a travel planning web app that keeps the essentials of a trip in
  one place: budget, daily schedule, jet lag and local experiences. I designed
  every desktop and mobile screen and worked as a fullstack developer on the
  Budget Tracker, Experiences, Trip Sharing and the real-time features. We built
  it as a team of three for the Web Programming course at Universidad Icesi.
# Portada: el dashboard de escritorio y el de móvil sobre Klein plano. A color: es interfaz.
cover: /work/tripsync/cover.jpg
opening: /work/tripsync/opening.jpg
coverColor: true
order: 2
draft: false
prototype:
  boxed: Click
  accent: through it
  link: https://www.figma.com/proto/x4FlfAaWsLxNKsLzg0qT5L/Web---Eco-Project?node-id=703-1919&starting-point-node-id=703%3A1919
  text: |
    The app is deployed, but it asks for an account, so this is the Figma
    prototype I designed, with every screen connected. It opens on sign up:
    from there you can set up a trip, add an expense, plan a day, get a jet lag
    plan or save an experience.

    The forms come filled in, so you can click straight through. Every choice
    can still be changed: pick a country from the list, a date from the
    calendar or the time of your flight.

    The mobile prototype sits next to it: the same flows on a phone, with the
    bottom bar and the side menu.
  views:
    - label: Desktop
      src: https://embed.figma.com/proto/x4FlfAaWsLxNKsLzg0qT5L/Web---Eco-Project?node-id=703-1919&starting-point-node-id=703%3A1919&scaling=contain&content-scaling=fixed&embed-host=share&hide-ui=1&bg-color=0a0a0a
      ratio: 16 / 10
      link: https://www.figma.com/proto/x4FlfAaWsLxNKsLzg0qT5L/Web---Eco-Project?node-id=703-1919&starting-point-node-id=703%3A1919
    - label: Mobile
      src: https://embed.figma.com/proto/x4FlfAaWsLxNKsLzg0qT5L/Web---Eco-Project?node-id=246-11082&starting-point-node-id=246%3A11082&scaling=contain&content-scaling=fixed&embed-host=share&hide-ui=1&bg-color=0a0a0a
      ratio: 10 / 16
      mobile: true
      link: https://www.figma.com/proto/x4FlfAaWsLxNKsLzg0qT5L/Web---Eco-Project?node-id=246-11082&starting-point-node-id=246%3A11082
figures:
  title: Design and build
  items:
    - value: "9"
      label: Core features working end to end
    - value: "53"
      label: Screens I designed, 30 desktop and 23 mobile
    - value: "5"
      label: Travel apps benchmarked across 15 criteria
    - value: "100"
      label: Commits of mine, out of 246 across the team
    - value: "67+"
      label: Merged pull requests
    - value: "24"
      label: Branches, one per feature plus develop and main
    - value: "93"
      label: Lighthouse score in Accessibility
    - value: "100"
      label: Lighthouse score in Best Practices
spotlight:
  after: role
  title: Travel together
  text: |
    We rarely travel alone, so I built Trip Sharing. The person who plans the
    trip shares it from the dashboard with an invite link or a QR code. A friend
    scans it, joins the same trip and sees the same information.

    Each invitation carries its own token, so only the people you invite can
    join your trip.
  steps:
    - You plan the trip
    - You share an invite link or a QR code
    - Your friend scans it and joins
    - You both see the same trip
  detail:
    src: /work/tripsync/share-qr.jpg
    alt: TripSync dashboard with the Share Trip window open, showing the invite QR code
    caption: Share Trip, opened from the dashboard.
    color: true
sections:
  problem: |
    Traveling is exciting, but managing budgets, schedules, time zones and
    activities across several apps becomes overwhelming. Travelers use one app
    for budgeting, another for schedules, another for jet lag and others to find
    activities or free tours. That fragmentation creates stress and
    disorganization during the trip.

    Our benchmark showed the same pattern in the market. Current travel apps work
    in silos: some focus on logistics, others on money, others on well-being.
    None of the 5 apps we compared covered planning, money and time adaptation
    together.

    The course asked for a real React application, not a mockup. It had to solve
    a real problem with at least three core features, include authentication,
    connect to external data, update in real time, be accessible and responsive,
    and be deployed publicly.
  role: |
    I designed the interface, every desktop and mobile screen in Figma, and
    worked as a fullstack developer. In code I owned the Budget Tracker, the
    Experiences module, Trip Sharing and the real-time recommendations, along
    with part of the architecture: 100 of the team's 246 commits.

    We were a team of three. Valentina Barreiro worked on the frontend, the UI
    components and features like Jet Lag, Schedule and Admin Experiences, with
    111 commits. María José Castro built the backend, the Express REST API and
    the database, with 35 commits.
  process:
    text: |
      We started with research and planning. We wrote the project argument,
      benchmarked 5 travel apps across 15 criteria in three groups (planning,
      money and well-being), defined a persona and mapped a 13-step user
      journey. From that came the route map: 18 weeks in four phases,
      Foundation, Core Expansion, Consolidation and Finalization.

      I took the design from wireframes to high fidelity in Figma, for desktop
      and mobile. After feedback from our target audience, I redesigned the
      interface to make navigation more intuitive. The first version put white
      cards on a full blue background; the redesign moved to a white layout with
      teal feature cards and outlined panels.

      Before writing code we agreed on a code of conduct: commit convention,
      branching model, setup instructions and the libraries we would use. Each
      delivery had to ship working software, not just designs.

      In the MVP we had navigation, authentication, the trip setup and the first
      budget logic running and deployed. In the consolidation stage we moved
      authentication and data to Supabase, added the administrator role and set
      up one branch per feature. The final delivery closed the 9 features, the
      real-time recommendations and the admin panel, and we compared the main
      screens side by side with the Figma design.
    media:
      - src: /work/tripsync/redesign.jpg
        alt: The dashboard before and after the redesign, side by side
        caption: The dashboard, first version on the left and the redesign on the right.
        layout: 8/4
        color: true
  decisions: |
    **Stack.** The course required a React application, so React was given, not
    chosen. Our planning listed Redux Toolkit and Firebase; with the professor's
    approval, the final app uses React Context with custom providers (Auth,
    Trip, Expenses, Realtime) and Supabase. Supabase gave us authentication, the
    database and realtime channels in one service.

    **Performance.** The country list from the REST Countries API is fetched
    once and cached at module level, so no screen fetches it again. Saving an
    experience updates the UI instantly and reverts if the Supabase write fails,
    and React.memo with useCallback keeps large lists from re-rendering in
    cascade. The final Lighthouse audit scored 85 in Performance.

    **Accessibility.** We used semantic HTML (nav, main, section, header,
    button, form, label, input), linked every form field to its label, wrote
    descriptive alt text for every image and made the whole app work with the
    keyboard. The final Lighthouse audit scored 93 in Accessibility.

    **Content.** Experiences are not hardcoded: administrators create them from
    their own panel and they are stored in Supabase. When an admin publishes a
    recommendation, it reaches every traveler going to the same destination
    country in real time through Supabase Realtime channels.
  result:
    text: |
      The app is deployed on Vercel and covers the full traveler flow: sign up,
      trip setup, a jet lag assistant that turns the time difference between
      countries into sleep, light and caffeine recommendations, a budget tracker
      with charts and alerts at 30, 50, 70, 90 and 100% of the budget, a daily
      schedule, experiences, profile and trip sharing. Admins get their own
      panel for users, experiences, trips and analytics, and their
      recommendations reach travelers in real time.

      The Figma file holds 53 screens, 30 for desktop and 23 for mobile, all
      connected in the prototype above. The repository closed with 246 commits,
      24 branches and more than 67 merged pull requests across three developers.
    media:
      - caption: Five of the 23 mobile screens, from wireframe to final interface. Drag across them.
        layout: full
        color: true
        screens:
          - name: Dashboard
            wire: /work/tripsync/screens/wire-1.png
            final: /work/tripsync/screens/final-1.jpg
          - name: Budget tracker
            wire: /work/tripsync/screens/wire-2.png
            final: /work/tripsync/screens/final-2.jpg
          - name: Jet lag assistant
            wire: /work/tripsync/screens/wire-3.png
            final: /work/tripsync/screens/final-3.jpg
          - name: Experiences
            wire: /work/tripsync/screens/wire-4.png
            final: /work/tripsync/screens/final-4.jpg
          - name: New activity
            wire: /work/tripsync/screens/wire-5.png
            final: /work/tripsync/screens/final-5.jpg
---
