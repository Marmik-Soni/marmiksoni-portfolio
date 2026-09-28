<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Strict Branching Strategy
- **`main` branch**: STRICTLY reserved for the public "Coming Soon" HTML site ONLY. NEVER merge Next.js code or any other changes into `main` without explicit, deliberate user authorization.
- **`staging` branch**: This is the active development branch for the Next.js portfolio (V1). All new features, Next.js migrations, and development work MUST happen here. DO NOT attempt to touch or merge to `main` until V1 is 100% complete and explicitly requested.
