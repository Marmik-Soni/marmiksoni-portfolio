# Bezier Fluid Scaling Engine — Technical Documentation

## Architecture Overview

The portfolio uses a **single unified bezier scaling engine** that drives all typography, spacing, and layout across every screen size — from 320px phones to 2560px ultrawides — through one CSS custom property: `--p`.

```
Screen Width (320px → 2560px)
    │
    ▼
Linear Ratio:  x = (viewport - 320) / (2560 - 320)
    │
    ▼
Bezier Curve:  cubic-bezier(0.35, 0.15, 0.65, 0.85)
    │
    ▼
--p (0.0 → 1.0)  ← Single CSS variable powers EVERYTHING
    │
    ├── --m:      calc(4px + 76px * --p)         Section margins
    ├── --gap:    calc(10px + 22px * --p)        Grid column gaps
    ├── --small:  calc(13.3px + 2.7px * --p)     Body font size
    ├── --px:     clamp(20px, 5vw, --m)           Page side padding
    ├── --title:  min(32px + 256px * --p, 28svh)  Hero title
    ├── --lh:     calc(0.94 - 0.08 * --p)         Hero line-height
    ├── --track:  (-0.038 - 0.027 * --p) * 1em    Hero letter-spacing
    └── Component-level font sizes (all use --p)
```

---

## The Math

### 1. Cubic Bezier Easing

The curve `(0.35, 0.15, 0.65, 0.85)` is an asymmetric ease-in-out:
- **Control point 1** `(0.35, 0.15)` — slow start, holds back scaling on smaller screens
- **Control point 2** `(0.65, 0.85)` — faster ramp on larger screens

This ensures:
- Phones and tablets get **tight, dense** layouts (p rises slowly)
- Desktop and ultrawide get **generous spacing** (p accelerates)

### 2. Newton-Raphson Solver

CSS cannot evaluate bezier curves directly, so JavaScript solves for the parameter `t` given an input `x`:

1. **Newton-Raphson** (8 iterations max): Uses the cubic derivative to converge rapidly
2. **Bisection fallback** (30 iterations): Binary search fallback if Newton-Raphson diverges near endpoints

This matches the algorithm browsers use internally for CSS `transition-timing-function`.

### 3. The Recalibration Formula

When extending the range from `1024→2560` down to `320→2560`, every CSS token's `min` value was recalibrated using:

```
new_min = (old_min - old_max × p₁₀₂₄) / (1 - p₁₀₂₄)
```

Where `p₁₀₂₄ = 0.2656` (the bezier output at 1024px in the 320→2560 range). This guarantees that the formula `new_min + (old_max - new_min) × p` produces the exact `old_min` desktop value when `p = p₁₀₂₄`.

---

## Computed Values at Every Breakpoint

| Width | `--p` | `--m` | `--gap` | `--small` | `--px` | Heading | Title | Desc | Hero Title |
|---|---|---|---|---|---|---|---|---|---|
| 320px | 0.000 | 4px | 10px | 13.3px | 20px | 26px | 21px | 16px | 32px |
| 375px | 0.011 | 5px | 10px | 13.3px | 20px | 26px | 21px | 16px | 35px |
| 480px | 0.038 | 7px | 11px | 13.4px | 20px | 27px | 21px | 16px | 42px |
| 768px | 0.143 | 15px | 13px | 13.7px | 20px | 29px | 23px | 17px | 68px |
| **1024px** | **0.266** | **24px** | **16px** | **14.0px** | **24px** | **32px** | **24px** | **18px** | **100px** |
| 1280px | 0.407 | 35px | 19px | 14.4px | 35px | 35px | 25px | 19px | 136px |
| 1440px | 0.500 | 42px | 21px | 14.7px | 42px | 37px | 27px | 20px | 160px |
| 1680px | 0.638 | 53px | 24px | 15.0px | 53px | 40px | 28px | 21px | 195px |
| 1920px | 0.767 | 62px | 27px | 15.4px | 62px | 43px | 29px | 22px | 228px |
| 2560px | 1.000 | 80px | 32px | 16.0px | 80px | 48px | 32px | 24px | 288px |

> **Bold row (1024px)** marks the transition boundary between mobile and desktop layout structure.

---

## Where The Code Lives

The bezier math exists in **exactly two files** (intentionally duplicated for FOUC prevention):

| File | Purpose | Runs When |
|---|---|---|
| `src/app/layout.tsx` (initScript) | Inline `<script>` — computes and sets `--p` before first paint | Before React hydrates |
| `src/hooks/useFluidScale.ts` | React hook — listens to resize events and keeps `--p` updated | After hydration, on every resize |

Both files have `⚠️ KEEP IN SYNC` comments. If you change constants in one, you **must** update the other.

### CSS Token Definitions
- **Global tokens:** `src/app/globals.css` (`:root` block)
- **Component tokens:** Each component's `.module.css` file

---

## Component Font Size Reference

All component-level font sizes follow the same pattern: `calc(min + (max - min) * var(--p))`

| Component | Selector | Formula | @320px | @1024px | @2560px |
|---|---|---|---|---|---|
| Editorial | `.label` | `calc(26px + 22px * --p)` | 26px | 32px | 48px |
| Editorial | `.lead` | `calc(21px + 11px * --p)` | 21px | 24px | 32px |
| Editorial | `.sub` | `calc(16px + 8px * --p)` | 16px | 18px | 24px |
| Services | `.heading` | `calc(26px + 22px * --p)` | 26px | 32px | 48px |
| Services | `.title` | `calc(21px + 11px * --p)` | 21px | 24px | 32px |
| Services | `.previewDesc` | `calc(16px + 8px * --p)` | 16px | 18px | 24px |
| Hero | `.lede` | `calc(16px + 8px * --p)` | 16px | 18px | 24px |
| Navbar | `.nav` gap | `calc(15px + 33px * --p)` | 15px | 24px | 48px |
| All | `gap` (sections) | `calc(15px + 33px * --p)` | 15px | 24px | 48px |

---

## Page Padding (`--px`)

Page side padding is **decoupled** from `--m` (section margins) via:
```css
--px: clamp(20px, 5vw, var(--m));
```

- **320px phone:** `clamp(20px, 16px, 4px)` → 20px (enforces comfortable edge margin)
- **768px tablet:** `clamp(20px, 38.4px, 15px)` → 20px
- **1024px+ desktop:** `clamp(20px, 51.2px, 24px)` → 24px (`var(--m)` scales with bezier)

This prevents edge-to-edge content on small screens while letting desktop margins breathe naturally.

---

## Mobile Structural Overrides

The bezier system handles **all sizing** (fonts, margins, gaps). The `@media (max-width: 1024px)` queries handle **only structural layout changes**:

| Component | What the media query does |
|---|---|
| Hero | Stacks columns, overrides title with `clamp(42px, 15vw, 100px)` |
| Editorial | Stacks 2-column grid to single column, reorders image/text |
| Services | Stacks accordion items vertically, adjusts padding |
| Navbar | Hides nav links, adjusts grid columns |

**Rule:** Never add hardcoded `font-size`, `margin`, or `gap` values inside mobile media queries. Let the bezier system handle sizing; use media queries only for structural changes (`grid-template-columns`, `flex-direction`, `display`).

---

## Rules for Extending This System

### Adding a New Sized Element
1. Decide the font-size at 320px (`min`) and 2560px (`max`).
2. Write: `font-size: calc(${min}px + (${max}px - ${min}px) * var(--p));`.
3. The bezier curve handles everything in between automatically.

### Changing the Curve
1. Update `X1, Y1, X2, Y2` in **both** `layout.tsx` and `useFluidScale.ts`.
2. Recompute `p₁₀₂₄` and verify all token outputs at 1024px haven't shifted unacceptably.
3. Update this documentation with new computed values.

### Changing the Range
1. Update `MIN_W` and/or `MAX_W` in both files.
2. Recompute all token `min` values using the recalibration formula: `new_min = (old_min - old_max * p_target) / (1 - p_target)`.
3. Verify desktop values (1024px+) are preserved.

### Never Do This
- ❌ Add a second `--p` variable or dual-engine system.
- ❌ Hardcode font sizes inside `@media` queries (except hero title `clamp()` if needed).
- ❌ Use `vw` units for font sizes on desktop (the bezier handles this smoothly).
- ❌ Change constants in one file without updating the other.
