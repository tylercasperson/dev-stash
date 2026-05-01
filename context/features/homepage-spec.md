# Homepage Spec

## Overview

Build the public-facing homepage at `/` using the prototype in `prototypes/homepage/` as the visual reference. The current `src/app/page.tsx` redirects to `/dashboard` — replace it with the real homepage. Authenticated users visiting `/` should be redirected to `/dashboard`.

## Route

- `src/app/page.tsx` — server component, checks session and redirects authenticated users to `/dashboard`

## Sections

### 1. Navbar — `src/components/homepage/Navbar.tsx` (client component)

- Logo: hexagon icon + "DevStash" text (link to `/`)
- Nav links: Features (`#features`), Pricing (`#pricing`) — smooth scroll
- CTA buttons: "Sign In" → `/sign-in`, "Get Started" → `/register`, "Preview Inside" → `/preview`
- Sticky on scroll with subtle backdrop blur + border
- Mobile: hamburger menu that toggles a dropdown with all links
- Hide "Get Started" and "Sign In" and show "Go to Dashboard" if the user is authenticated (read session via server component wrapper, pass as prop)

### 2. Hero — `src/components/homepage/Hero.tsx` (client component)

- Left: headline, subheading, two CTA buttons ("Get Started Free" → `/register`, "See Features" → `#features`)
- Right: two-panel visual
  - Left panel: chaos canvas animation (mouse-repel floating tool icons) — port the canvas logic from `prototypes/homepage/script.js`
  - Right panel: static dashboard mockup (sidebar nav items with type colors + mini collection/item cards grid)
  - Arrow between panels
- Fade-in animation on load

### 3. Features Grid — `src/components/homepage/FeaturesSection.tsx` (server component)

- Section heading + subheading
- 6-card grid (2 cols mobile, 3 cols desktop): Code Snippets, AI Prompts, Commands, Notes, Files & Docs, Collections
- Each card: accent-colored icon badge, title, description
- Use the type color tokens from `project-overview.md` for accent colors
- Anchor id: `features`

### 4. AI Section — `src/components/homepage/AISection.tsx` (server component)

- Two-column layout (text left, demo right)
- Left: "PRO FEATURE" badge, heading, description, bullet checklist (auto-tag, summaries, explain code, prompt optimizer)
- Right: static code editor mockup with macOS window dots, `useDebounce.ts` snippet, and AI-generated tag pills below
- Use the same dark editor styling as the `CodeEditor` component (`bg-[#1e1e1e]`)

### 5. Pricing — `src/components/homepage/PricingSection.tsx` (client component — toggle interaction)

- Monthly/Yearly billing toggle (checkbox + labels); Yearly shows "Save 25%" badge
- Two cards: Free ($0) and Pro ($8/mo or $6/mo billed yearly)
- Feature lists matching the prototype (checkmarks for included, muted with ✕ for excluded)
- Pro card highlighted (ring/border accent)
- Free CTA: "Get Started Free" → `/register`; Pro CTA: "Start Pro — Free Trial" → `/register`
- Anchor id: `pricing`

### 6. CTA Banner — `src/components/homepage/CTASection.tsx` (server component)

- Dark gradient background
- Heading, subheading, "Get Started Free" button → `/register`

### 7. Footer — `src/components/homepage/Footer.tsx` (server component)

- Logo + tagline
- Three link columns: Product (Features → `#features`, Pricing → `#pricing`), Company (About, Blog, Contact — `/` placeholder for now), Legal (Privacy, Terms — `/` placeholder for now)
- Copyright line with dynamic year
- Do NOT add a "Changelog" page that doesn't exist

## Component Tree

```
src/app/page.tsx (server — session check + redirect)
  └── HomepageLayout (server)
        ├── Navbar (client)
        ├── Hero (client)
        ├── FeaturesSection (server)
        ├── AISection (server)
        ├── PricingSection (client)
        ├── CTASection (server)
        └── Footer (server)
```

All components live in `src/components/homepage/`.

## Styling Notes

- Dark background default: match prototype's `#0d0d0f` tone using `bg-zinc-950` / `bg-zinc-900`
- Use existing Tailwind/ShadCN Button and Badge components where they fit (navbar CTAs, PRO badge, pricing toggle)
- Gradient headline text: blue-to-purple (`from-blue-400 to-purple-400`) with `bg-clip-text text-transparent`
- Smooth scroll: add `scroll-behavior: smooth` to `<html>` (already present via globals or add to layout)
- Responsive: single column on mobile, multi-column on md/lg breakpoints
- No new CSS files — Tailwind classes only

## Files to Create

- `src/app/page.tsx` — replaces the existing redirect-only page
- `src/components/homepage/Navbar.tsx`
- `src/components/homepage/Hero.tsx`
- `src/components/homepage/FeaturesSection.tsx`
- `src/components/homepage/AISection.tsx`
- `src/components/homepage/PricingSection.tsx`
- `src/components/homepage/CTASection.tsx`
- `src/components/homepage/Footer.tsx`

## Key Gotchas

- The canvas animation in `Hero.tsx` uses browser APIs — must be `'use client'` with `useEffect` for canvas init
- Import `auth` from `@/auth` in `page.tsx` to read session server-side
- Navbar scroll detection needs `'use client'` and a `scroll` event listener
- `PricingSection` pricing toggle is purely client-side state — no server calls needed
- Keep canvas icon drawing self-contained; no external image files needed (SVG paths drawn inline or via `new Image()` with data URIs as in the prototype)

## References

- `prototypes/homepage/index.html` — section structure and copy
- `prototypes/homepage/styles.css` — visual reference for colors and spacing
- `prototypes/homepage/script.js` — canvas animation logic to port
- `context/project-overview.md` — type color tokens and pricing tier details
- `src/components/ui/` — existing ShadCN components to reuse
