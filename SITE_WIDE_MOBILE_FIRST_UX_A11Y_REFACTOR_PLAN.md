# Site‑Wide Mobile‑First UI/UX + A11y Refactor Plan

This plan aligns every page and shared component with our new modern style (glass morph touches, rounded cards, borderless lists), mobile‑first layouts, strong accessibility, and consistent i18n. Work proceeds in thin slices with measurable outcomes and low regression risk.

## Guiding Principles
- Mobile‑first: design for <640px first; enhance progressively at md/lg.
- Consistency: one spacing scale, border radii, shadows, and typography rhythm.
- No layout shift: stable heights, `sizes` on images, predictable async UI.
- Accessible by default: keyboard focus, roles/labels, color contrast, motion safety.
- Localized: all strings through next‑intl; avoid hardcoded fallbacks.
- Performance: reduce CLS/LCP/INP with proper image hints, skeletons, and minimal reflow.

## Style System Alignment
- Tokens: consolidate colors, radii, shadows, spacing, font sizes in Tailwind + CSS vars (`app/globals.css`).
- Containers: standard rounded cards (default) and borderless list item variant.
- Micro‑interactions: focus-visible rings; reduce hover-only cues on mobile.
- Glassmorphism: use cautiously on overlays/sheets; include safe‑area padding.

## Shared Components (Refactor Targets)
- Navigation (mobile + desktop)
  - Simplify mobile menu (done); ensure no scroll and concise legal links.
  - Safe-area and sticky behavior; a11y roles and ARIA for menus.
- Bottom sheets / Drawers
  - Glass morph (done on PDP buy sheet), z-index safe, `pb-safe`, reduced motion.
- Cards (product, minimal, borderless)
  - Title/price typography scales; borderless variant for lists (done for related).
  - Hover/focus states consistent; a11y labels on images/actions.
- Buttons + CTAs
  - Unified sizes (44px min height); focus-visible rings; disabled states.
- Forms (inputs, selects, toggles)
  - Labels, descriptions, error text; keyboard nav; high-contrast placeholders.
- Tabs + Accordions
  - Pill-style tabs (done on PDP); keyboard nav, ARIA; reduced borders.
- Modals/Dialogs
  - Focus trap, labelledby/describedby, `esc` close, scroll lock; `dvh` sizing.
- Image Gallery
  - `sizes` hints (done), swipe affordances, aria-labels (done), no CLS.
- Lists/Carousels
  - Snap scrolling on mobile; scrollbar-hide utility; a11y live regions where sensible.

## Page-by-Page Refactor Checklist
- Home
  - Align hero, section labels, carousels, and cards to shared tokens.
  - Ensure i18n coverage for all labels (done for featured/community/newsletter).
- Products Listing (`/products`, category pages)
  - Mobile-first grid; sticky refine bar; borderless cards option; a11y for filters.
  - Ensure URL state for filters; no layout jumping during refine.
- Product Detail (PDP) (in progress)
  - Header/category label and gallery framing (done).
  - Tabs pill UI (done); bottom buy sheet glass morph (done).
  - Variant radiogroups with focus-visible + aria (done).
- Collections (`/collections/[handle]`)
  - Use same listing grid + filter shell; section header typography.
- Search
  - Sticky filter row; keyboard navigation for results; skeletons for loading.
- Cart + Checkout Entrypoints
  - Cardy summary blocks; a11y of totals; focus order; reduced motion.
- Account (orders, addresses, profile)
  - Tables to responsive cards on mobile; inputs with clear labels and errors.
- Static/Legal pages (privacy, terms, shipping, returns, size-guide, contact)
  - Consistent content container, typography, and i18n (added minimal pages).

## Accessibility Checklist (WCAG‑aligned)
- Focus management: visible rings on all interactive elements.
- Semantics: use roles for radiogroups, tabs, accordions; headings hierarchy.
- Labels: aria-label/labelledby on icons, gallery controls, inputs.
- Color & contrast: ≥ 4.5:1 body text; avoid color‑only states.
- Keyboard: full nav without a mouse; no keyboard traps.
- Motion: reduce heavy animations; respect `prefers-reduced-motion`.
- Live regions: status updates (stock, async actions) announce politely.

## Performance / Stability
- Images: correct `sizes`, preload critical, use priority on first hero/gallery img.
- Skeletons/placeholders: avoid reflow; reserve heights.
- Avoid layout thrash: no resize handlers on scroll (dvh/svh strategy).
- Bundle: keep dependencies slim; tree-shake where possible.

## i18n Readiness
- No hardcoded strings; ensure keys exist in `messages/{en,bg}.json`.
- Avoid duplicate top-level namespaces (fixed newsletter duplication).
- Transliterate category/collection labels via helpers.

## Rollout Strategy
1. Component Foundations (tokens, buttons, cards, tabs)
2. PDP polish (done), Listing pages, Collections, Search
3. Cart/Checkout entry, Account
4. Static/Legal pages typography pass

Ship small PRs behind visual checks; use Percy/Playwright screenshots if available.

## QA Matrix
- Viewports: 360, 390, 414, 768, 1024, 1280, 1440.
- Browsers: Safari iOS, Chrome Android, Chrome/Edge desktop, Safari macOS.
- Locale: en, bg; Currency: BG and default; RTL not in scope.
- Keyboard-only / Screen reader smoke tests.

## Success Metrics
- CLS ≤ 0.05 on PDP and Listing; LCP ≤ 2.5s on median mobile.
- INP < 200ms for core interactions (variant select, add to cart).
- 0 a11y criticals in automated checks; manual focus traversal clean.

## Task Board (High-Level)
- [ ] Unify tokens + global spacing/typography rhythm
- [ ] Buttons/Forms a11y + focus-visible rings
- [ ] Product cards: borderless variant across listings/related
- [ ] Listing pages: mobile-first grid + sticky refine
- [ ] Search: results list, sticky filters, skeletons
- [ ] Collections page layout unify
- [ ] Cart/Checkout entry UI pass
- [ ] Account pages responsive tables → cards
- [ ] Legal pages typography and i18n polish
- [ ] Final a11y/perf sweep (images, roles, dvh/svh)

## Risks & Mitigations
- Visual regressions: ship in small batches; visual review on key pages.
- Locale gaps: add missing keys early; fallback strategy only during dev.
- Mobile browser chrome behavior: continue using `svh/dvh` and locked hero height.

---
Owner: Frontend team (w3bsuki + contributors)
Tracking: Link PRs to this plan; check items off upon merge.

