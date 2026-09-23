# Marmik Soni Portfolio – Master Plan & Git Strategy

This document serves as the historical record of our planning, the current state of the architecture, and the roadmap for migrating the pure HTML/CSS/JS portfolio to a full-scale Next.js application.

---

## 1. Context & Background

We started with a custom-built, highly polished pure HTML/CSS/JS template for a personal portfolio. It featured:
- **Trap Font** for editorial typography.
- **Fluid Scaling System**: A custom JavaScript implementation using a Bezier curve to dynamically compute a `--p` CSS variable based on viewport width. All sizing (margins, typography, grid gaps) was mathematically derived from `--p`.
- **GSAP & Lenis**: For smooth scrolling, stagger text reveals, and page loaders.
- **Dynamic Theming**: Light/Dark mode toggles with `localStorage` persistence.

The long-term goal is to migrate this into a **Next.js** application with a CMS, proper SEO/AEO/GEO optimization, and componentized architecture.

However, an initial Next.js migration attempt failed visually because the **Fluid Scaling (`--p`) JS logic was not wired up first**. Without `--p` computing dynamically, the entire CSS layout grid collapsed. 

To meet immediate job application needs, we decided to **pause the migration**, launch a functional "Coming Soon" page to production, and restructure our Git workflow to allow iterative, safe development.

---

## 2. Git Strategy & Branching Model

To ensure a professional and safe deployment pipeline, we established the following Git architecture:

- **`main`** ➔ Production (`marmiksoni.co`)
  - **Current State:** Hosts a lightweight, highly-optimized static HTML "Coming Soon" page.
  - **Rules:** Protected branch. No direct pushes. Merges only happen via PR from `staging` when a release is completely finalized.
  
- **`staging`** ➔ Staging/Dev (`staging.marmiksoni.co`)
  - **Current State:** Hosts the original pure HTML/CSS/JS portfolio template (our baseline reference).
  - **Rules:** Protected branch. Serves as the integration branch for all new features.

- **`feature/*`** ➔ Active Development
  - Day-to-day coding, including the Next.js migration, happens here. 
  - Branched off `staging`.
  - Merged into `staging` via PR for testing and QA.

---

## 3. Production ("Coming Soon") Optimizations Completed

Before freezing the `main` branch, we perfected the static "Coming Soon" page:
- **Clean Architecture:** Separated inline styles into an external `css/style.css` and removed unused legacy portfolio assets.
- **FOUT Prevention:** Eliminated Flash of Unstyled Text by injecting `<link rel="preload">` tags for critical Trap font weights and utilizing `font-display: block` in `@font-face` declarations.
- **Micro-interactions:** Added a smooth underline hover effect for the email and LinkedIn links, along with a custom JS toast notification for clipboard copying.

---

## 4. Next.js Migration Roadmap (Round 2)

When we resume the Next.js migration on a `feature/nextjs-migration` branch, we will strictly follow an **Infrastructure-First** approach to prevent layout collapse.

### Phase 1: Scaffold Next.js
- **Stack:** App Router, TypeScript, pnpm, Vanilla CSS (No Tailwind).
- Move existing legacy HTML/CSS/JS files to `public/legacy/` for exact reference.

### Phase 2: Global Foundation (CSS & Fonts)
- Port all `:root` design tokens and base element resets (`body`, `a`, `.page`, `.grid-12`) into `src/app/globals.css`.
- Map local `@font-face` declarations to the Trap font files.
- **Checkpoint:** Verify the browser renders the correct background color and Trap font system-wide before writing any components.

### Phase 3: The Fluid Scaling Engine (CRITICAL)
- **The Spine:** Port the bezier-based fluid scaling logic (`main.js`) into a custom React hook: `useFluidScale.ts`.
- Create a `<FluidScaleProvider />` client component that attaches a `ResizeObserver` and dynamically sets the `--p` variable on `document.documentElement`.
- **Checkpoint:** Open DevTools and verify `--p` scales smoothly on window resize. **Do not build UI until this works.**

### Phase 4: Theme System
- Implement `<ThemeProvider />` using `localStorage` to toggle `data-theme` on the `<html>` element.
- Ensure inline scripts are placed in `layout.tsx` to prevent theme-flash on page reload.

### Phase 5: Component Assembly & UI
- **Navbar:** Port the grid structure and integrate the theme toggle context.
- **Hero Section:** Integrate GSAP (`gsap.set`, `tl.to`) to handle the word stagger reveals and element fade-ins, ensuring `useRef` is properly scoped in client components.
- **Editorial/About:** Port parallax image logic via ScrollTrigger.
- **Contact:** Convert into a fully operational form endpoint with a GSAP page transition.
- **Rules:** One CSS file per component module. Limit `'use client'` strictly to components requiring GSAP, refs, or event handlers.

---

## 5. Next Steps

Currently awaiting the green light to branch off `staging` and initialize `pnpm create next-app`.
