# Development & Strategy Log

This document tracks major updates, architectural decisions, and strategic positioning across the repository branches.

---

## Main Branch (Coming Soon Site)
### SEO & Indexing Infrastructure
- **Sitemap & Robots**: Deployed `sitemap.xml` and `robots.txt` to enable immediate crawling and priority indexing via Google Search Console.
- **Structured Data (JSON-LD)**: Injected `ProfessionalService` and `OfferCatalog` schema to establish entity authority for web consulting, troubleshooting, and bespoke development.
- **Social Previews**: Added comprehensive Open Graph (`og:image`, `og:title`) and Twitter Card meta tags to ensure premium, rich link previews across WhatsApp, LinkedIn, and iOS.
- **Positioning**: Refined visible copy and metadata to position as a premium "Web Developer & Designer", rather than a generic coder.

### Bug Fixes & UX
- **Mobile Touch Cursor Bug**: Resolved a critical interaction bug on touch devices (phones/tablets) where the custom cursor would get permanently stuck on the screen after a tap. Fixed by implementing a 1000ms threshold to safely ignore synthetic `mousemove` and `mouseenter` events triggered by mobile browsers post-tap.

---

## Responsive Branch (Next.js Portfolio V1)
### Layout & Architecture
- **Hero Section**: Refined vertical rhythm and grounding utilizing the Bezier Fluid Scaling engine (`17vh` top padding) to perfectly balance the main headline and subtext without disrupting the CSS grid architecture.
- **Services Component**: Unified typography and restructured grid alignment for clean, seamless mobile viewport scaling.
- **Transition Engineering**: Researched and documented the complete technical specification for implementing seamless, GSAP-driven page transitions between the portfolio index and individual project case studies (stored in `concepts/seamless-page-transitions.md`).
