<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Strict Branching Strategy
- **`main` branch**: STRICTLY reserved for the public "Coming Soon" HTML site ONLY. NEVER merge Next.js code or any other changes into `main` without explicit, deliberate user authorization.
- **`staging` branch**: This is the active development branch for the Next.js portfolio (V1). All new features, Next.js migrations, and development work MUST happen here. DO NOT attempt to touch or merge to `main` until V1 is 100% complete and explicitly requested.

# Portfolio Development Rules & Best Practices

## 1. Images
- NEVER use standard `<img>` tags for static assets. Always use Next.js `<Image>` with static imports (e.g. `import myImg from '../../../public/...'`) so Next.js can automatically determine intrinsic dimensions, generate `placeholder="blur"`, and convert formats to WebP/AVIF.
- Ensure `next.config.ts` includes `images: { formats: ['image/avif', 'image/webp'] }` for optimal compression.

## 2. GSAP & CSS Transforms (Windows ClearType Bug)
- NEVER leave elements with inline `transform` styles after a GSAP animation finishes. On Windows Chrome/Edge, this forces the browser to keep the text in a GPU composite layer, destroying ClearType subpixel antialiasing and causing noticeably fuzzy/pixelated font rendering.
- Always add `onComplete: () => { el.style.transform = 'none' }` to GSAP animations to explicitly strip the inline transform when the element comes to rest. If relying on CSS for initial state (to avoid FOUC), do NOT use `clearProps: 'transform'` as it will cause the element to snap back to its hidden CSS state.

## 3. Fonts
- Do NOT declare unused `@font-face` weights in CSS. Only declare the exact weights used (currently 400 and 500) to avoid unnecessary network polling.
- Do NOT use `<link rel="preload">` for fonts unless they are explicitly used on the critical rendering path.
- Always prefer `.woff2` format over `.otf` for better file compression and superior hinting on Windows displays.

## 4. CSS Animations & GPU Leaks
- Avoid using `will-change: transform` permanently in CSS. It leads to GPU memory bloat and causes the same blurry rendering issues as lingering GSAP transforms. If needed, apply it dynamically and remove it after the animation.
- Clean up dead CSS: When tearing down complex layouts, audit and remove orphaned state classes, unused React state variables, and stale overrides.
