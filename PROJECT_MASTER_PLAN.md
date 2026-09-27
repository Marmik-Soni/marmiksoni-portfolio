# Marmik Soni Portfolio – Master Plan & Git Strategy

This document serves as the **single source of truth** for the project's planning, architecture decisions, current state, and roadmap. Any agent or collaborator picking up this project should read this document first.

---

## 1. Context & Background

We started with a custom-built, highly polished pure HTML/CSS/JS template for a personal portfolio. It featured:
- **Trap Font** for editorial typography.
- **Fluid Scaling System**: A custom JavaScript implementation using a Bezier curve to dynamically compute a `--p` CSS variable based on viewport width. All sizing (margins, typography, grid gaps) is mathematically derived from `--p`.
- **GSAP**: For smooth scrolling, stagger text reveals, and page loaders. *(GSAP is now fully free — acquired by Webflow, no licensing restrictions.)*
- **Dynamic Theming**: Light/Dark mode toggles with `localStorage` persistence.

The long-term goal is to migrate this into a **Next.js** application with a CMS (Sanity), proper SEO/AEO/GEO optimization, and componentized architecture.

An initial Next.js migration attempt **failed visually** because the **Fluid Scaling (`--p`) JS logic was not wired up first**. Without `--p` computing dynamically, the entire CSS layout grid collapsed.

To meet immediate job application needs, we **paused the migration**, launched a functional "Coming Soon" page to production, and restructured our Git workflow to allow iterative, safe development.

---

## 2. Git Strategy & Branching Model

- **`main`** ➔ Production (`marmiksoni.co`)
  - **Current State:** Hosts a lightweight, highly-optimized static HTML "Coming Soon" page with editorial layout, custom cursor, social links (Instagram, LinkedIn, Bluesky, Email copy-to-clipboard), responsive mobile/tablet layout, and CSS entrance animations.
  - **Rules:** Protected branch. No direct pushes. Merges only happen via PR from `staging` when a release is completely finalized.
  - **Hosting:** Currently serving `marmiksoni.co`. No Vercel integration — hosting is configured independently.

- **`staging`** ➔ Staging/Dev
  - **Current State:** Hosts the original pure HTML/CSS/JS portfolio template (our baseline reference).
  - **Rules:** Protected branch. Serves as the integration branch for all new features.
  - **Note:** No staging domain is currently configured. Will be set up during CI/CD phase.

- **`feature/*`** ➔ Active Development
  - Day-to-day coding, including the Next.js migration, happens here.
  - Branched off `staging`.
  - Merged into `staging` via PR for testing and QA.
  - **Active branch:** `feature/nextjs-migration`

---

## 3. Production ("Coming Soon") — Completed

The static "Coming Soon" page on `main` includes:
- **Clean Architecture:** External `css/style.css`, self-hosted Trap fonts, no external dependencies.
- **FOUT Prevention:** `<link rel="preload">` tags for critical font weights + `font-display: block`.
- **Custom Cursor:** Physics-based cursor with `mix-blend-mode: difference`, velocity stretching, hover scaling on interactive elements. Hidden on touch devices.
- **Clipboard Copy:** Email link copies `hello@marmiksoni.co` to clipboard with visual "copied!" text-swap feedback (no toast).
- **Responsive Layout:** Tablet portrait and mobile use `column-reverse` flex to reorder sections (Name → Socials → Subtext). Entrance animations are sequenced per screen size.
- **Social Links:** Instagram, LinkedIn, Bluesky (all open in new tab), Email (copy to clipboard). Underline slide animation on hover.
- **Subtext:** "New portfolio arriving soon. Available for new opportunities." — lighter gray color (`var(--soft)`) with hover-to-black transition for cursor blend compatibility.

---

## 4. External Services Status

| Service | Status | Details |
|---------|--------|---------|
| **Sanity CMS** | Account created | No project, schema, or integration yet. Will be layered on after visual parity is achieved. |
| **Vercel** | Not connected | No Vercel integration. Deployment pipeline TBD in CI/CD phase. |
| **Domain** | Active | `marmiksoni.co` pointing to current static hosting. |

---

## 5. Tech Stack Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Framework | Next.js (App Router) | SSR, file-based routing, React ecosystem |
| Language | TypeScript | Type safety, better DX |
| Package Manager | pnpm | Faster installs, strict dependency resolution |
| Styling | Vanilla CSS (CSS Modules) | Full control, no Tailwind |
| Animations | GSAP (free, Webflow-acquired) | Already battle-tested in legacy code |
| CMS | Sanity (future) | Structured content, real-time preview |
| Linting | ESLint (Next.js config) | Shipped with scaffold |
| Formatting | Prettier (to be added) | Consistent code style |

---

## 6. Next.js Migration Roadmap (Infrastructure-First)

Each phase has a hard-gated checkpoint. **Do NOT proceed past a checkpoint until it's verified.**

### Phase 1: Scaffold Next.js
- **Command:** `pnpm create next-app@latest ./ --typescript --app --src-dir --eslint --use-pnpm --import-alias "@/*" --empty --disable-git`
- Legacy files already preserved at `public/legacy/` for exact reference.
- Copy font files to `public/fonts/` and images to `public/images/`.

### Phase 2: Global Foundation (CSS & Fonts)
- Port all `:root` design tokens, `[data-theme="dark"]` overrides, and base resets into `src/app/globals.css`.
- Map `@font-face` declarations to `/fonts/Trap-*.otf`.
- **Checkpoint:** Browser renders `#F4F4F3` background and Trap font. No FOUT.

### Phase 3: Fluid Scaling Engine (CRITICAL)
- Port the Bezier-based fluid scaling logic into `src/hooks/useFluidScale.ts`.
- Create `<FluidScaleProvider />` client component using `ResizeObserver`.
- Sets `--p` on `document.documentElement` (0 at ≤1024px → 1 at ≥2560px).
- **Checkpoint:** Open DevTools → `<html>` element → verify `--p` scales smoothly on resize. **Do NOT build UI until this works.**

### Phase 4: Theme System
- Implement `<ThemeProvider />` with `localStorage` persistence.
- Inline anti-flash script in `layout.tsx` (`dangerouslySetInnerHTML`).
- `<ThemeToggle />` client component with sun/moon SVG.
- **Checkpoint:** Toggle works, refresh persists, no theme flash.

### Phase 5: Component Assembly & UI
Build components one at a time. Each gets its own CSS Module.

| Component | Type | GSAP? | Notes |
|-----------|------|-------|-------|
| `Navbar` | Client | No | 12-col grid. "Process" nav link kept as placeholder. |
| `Hero` | Client | ✅ | Word stagger + lede fade. `useRef` + `useEffect` for GSAP timeline. |
| `Editorial/About` | Client | ✅ | Parallax image via `requestAnimationFrame` scroll listener. |
| `Services` | Client | No | Hover spotlight (desktop), accordion (mobile). CSS `:has()` dimming. |
| `Contact` | Client | TBD | Currently being designed. Will be built once design is finalized. |
| `Loader` | Client | ✅ | Counter 0→100% + wipe animation. |

**Rules:**
- One CSS Module per component.
- Limit `'use client'` strictly to components requiring GSAP, refs, or event handlers.
- Server Components by default.

### Phase 6: Code Hygiene
- **Prettier:** Add `.prettierrc` with consistent formatting rules (single quotes, trailing commas, 2-space indent).
- **Husky + lint-staged:** Pre-commit hooks that run `eslint --fix` and `prettier --write` on staged files.
- **TypeScript strict mode:** Enable `strict: true` in `tsconfig.json`.
- **Import sorting:** Configure ESLint plugin for consistent import ordering.
- **CSS linting:** Add Stylelint for CSS Module consistency.
- **Bundle analysis:** Add `@next/bundle-analyzer` for monitoring bundle size.

### Phase 7: CI/CD & Deployment
- **GitHub Actions:** Set up CI pipeline:
  - `pnpm install` → `pnpm lint` → `pnpm tsc --noEmit` → `pnpm build` on every PR.
  - Fail the PR if any step fails.
- **Preview Deployments:** Configure Vercel (or alternative) for automatic preview URLs on PRs.
- **Staging Deployment:** Auto-deploy `staging` branch to a staging URL.
- **Production Deployment:** Deploy `main` branch to `marmiksoni.co` on merge.
- **Environment Variables:** Sanity project ID, dataset, and API tokens managed via deployment platform env vars.

### Phase 8: Sanity CMS Integration (Future)
- Initialize Sanity project and define content schemas.
- Create `src/lib/sanity.ts` client configuration.
- Replace hardcoded content with Sanity queries (GROQ).
- Set up Sanity Studio (embedded or standalone).
- Configure preview mode for draft content.

---

## 7. Current State & Next Steps

- **Active Branch:** `feature/nextjs-migration`
- **Branch Contents:** `PROJECT_MASTER_PLAN.md`, `README.md`, `public/legacy/` (reference files)
- **Next Action:** Execute Phase 1 (scaffold Next.js) and Phase 2 (fonts & tokens).
- **Priority:** Get to the Phase 3 checkpoint (`--p` scaling verified) before building any visual components.

---

## 8. Key Lessons Learned

1. **Infrastructure before UI.** The first migration attempt failed because we jumped straight to components without wiring up the fluid scaling engine. The entire CSS system depends on `--p`.
2. **Checkpoint-gated phases.** Never proceed past a phase until its checkpoint passes. This prevents cascading failures.
3. **Legacy reference files are sacred.** The `public/legacy/` directory is our pixel-perfect reference. Never modify these files.
