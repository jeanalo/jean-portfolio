# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **International recruiters** looking for a designer for a role or a professional internship (práctica profesional). They skim several portfolios in a row and judge range and judgment quickly.
- **International clients** (founders, marketing teams) looking to hire someone for branding, video editing or UX/web design on a project or contract basis. They want proof that the work has shipped for real companies.

Both read the site in English, usually on a laptop between other tasks, and decide in a few minutes whether to reach out.

## Product Purpose

The personal portfolio of Jean Alomia, an interactive media designer based in Cali, Colombia, who works with international clients. Success is one of two outcomes:

1. A client writes to start a project or contract.
2. Jean gets hired, including landing the professional internship.

The main action is getting in touch (email, LinkedIn, Behance).

## Positioning

- **One person, end to end:** branding, video editing, UX/web design and motion from one person, with no handoffs between vendors.
- **AI with judgment:** works faster with AI tools without lowering the bar. Every AI output goes through a full design review and is corrected by hand.
- **Grounded in HCI:** a background in human-computer interaction backs UX decisions with method (see the Kin case).

## Operating Context

- Visitors arrive from LinkedIn, Behance, a CV link or a direct message, usually after a first conversation or an application.
- Recruiters compare portfolios side by side. Clients look for evidence of real deliverables and of working across time zones and cultures (Manila, Dubai, Colombia).
- The home page leads with a video of Jean speaking in English, so the visitor hears the person before reading the work.

## Capabilities and Constraints

- Static site: home (hero with video, intro, disciplines, selected work, about, contact) and case studies at `/work/[slug]` (problem, role, process, decisions, result).
- All visible copy is in English. No em dashes in site copy.
- Disciplines: BRANDING / VIDEO EDITING / UX & WEB DESIGN / MOTION.
- The hero video does not exist yet; a placeholder stands in until it is recorded.
- Deploy target: Vercel.
- `CLAUDE.md` holds the binding design system, motion rules and build phases. It wins over any skill suggestion.
- Undecided: whether there will be a booking link or a downloadable CV.

## Brand Commitments

- Name: Jean Alomia.
- Voice: direct, confident, young.
- Headline: "HEY. I MAKE STUFF move." Subline: "Loud enough to notice, clear enough to use."
- Signature device and full visual system are defined in `CLAUDE.md`.

## Evidence on Hand

- **Global Virtuoso** (`src/content/projects/global-virtuoso.md`): rebrand and a brand manual that grew to 90 pages for a company based in Manila and Dubai, presented in person in Manila. Includes applied templates (monthly newsletter, business cards, A4 letterhead) and coaching the team on AI image generation, video and Canva.
- **Kin, Wellness as a Service:** HCI project. Content not yet written.
- **Video editing selection:** educational, institutional and UGC work. Content not yet written.
- **Pending:** UX case for the Global Virtuoso website redesign.
- Absent and never to be fabricated: client testimonials, metrics, impact numbers, and the missing case-study sections. Mark them `[PENDIENTE]` until Jean supplies them.

## Product Principles

1. **Show the person, then the proof.** The video and the voice open the door; real, shipped work closes it.
2. **Real over impressive.** Every claim traces to an actual project. Missing information stays visibly pending instead of being filled in.
3. **Range with a spine.** Four disciplines read as one coherent way of working, not a scattered list.
4. **Two readers, one path.** Recruiters and clients both reach the evidence and the contact quickly, without separate tracks.
