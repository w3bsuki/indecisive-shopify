# Stüssy-style Mobile‑First Revamp Plan (Homepage + Shop)

This document is an actionable plan to create a new feature branch and implement a mobile‑first UI that mirrors the core feel and layout of stussy.com while fitting Indecisive Wear. It keeps our current hero carousel for collections (repurposed) and introduces a clean hero brand image on the homepage. Desktop tweaks will follow after mobile is complete.

Status: Planned (ready to execute)
Owner: You (via CLI automation)

---

## Objectives

- Mobile-first redesign inspired by stussy.com.
- Homepage: header + full‑bleed, tappable brand hero image. Remove other homepage sections for now.
- Tapping the hero routes to the Shop page (`/shop`).
- Shop page: product grid with occasional full‑width image separators between sections (collections). Include quick‑access horizontal tabs for collections at the top.
- Header (mobile): logo on left, hamburger near logo, “Shop” button and search icon on right; keep current bag/cart icon behavior. Consider removing the bottom navbar (disabled for MVP).
- Reuse existing carousel as a Collections carousel where needed.

Non‑goals (for MVP): account/auth changes, cart logic changes, product detail redesign.

Assumptions:
- Tech: Next.js App Router, React Server/Client components, TailwindCSS/PostCSS (present), headless commerce/Shopify integration already exists.
- We will use our own brand imagery; do not copy Stüssy assets or wordmarks.

---

## Branching and Safety

- Create a long‑lived feature branch and keep changes scoped to new components/pages plus minimal layout wiring.
- Remove/disable bottom navbar by feature flag so it’s easy to restore if needed.
- Keep old homepage artifacts but don’t render them in the new route.

### Git

```bash
# from main
git checkout -b feature/stussy-mobile-first
```

---

## IA and UX blueprint (Mobile first)

- Header (sticky):
  - Left: Logo + Hamburger (opens left sheet/drawer menu; reuse or add a simple menu listing Shop, About, Contact).
  - Right: Shop button (text), Search icon, Bag icon (existing cart).
- Homepage (`/`):
  - Single full‑bleed hero brand image (clickable) → navigates to `/shop`.
- Shop (`/shop`):
  - Sticky top bar of horizontal scroll tabs: All, T‑Shirts, Crop Tops, Hats, Accessories (placeholder; wire to collections filtering later).
  - Product grid (2‑column on small screens) with infinite or paginated loading (existing strategy). Between groups, insert a full‑width Separator Banner image block.
  - Optional: a Collections carousel (reusing the current carousel) below the tabs or between sections.
- Desktop: widen gutters, increase columns (3–4+), keep hero aspect ratio, refine spacing.
- Bottom navbar: removed/hidden (MVP).

---

## Components and Files to create/update

Paths reflect our repo structure. Use client components only where interactivity is needed.

1) Header
- New: `components/layout/stussy-header.tsx` (client)
  - Props: none (reads global cart, search modal handlers if present)
  - Renders: Logo (link `/`), Hamburger button (opens left sheet), Shop button (link `/shop`), Search icon button, Bag icon (existing)
  - Sticky, 56–64px height, solid background, z-50
- Optional: `components/layout/mobile-drawer.tsx` for hamburger menu (or reuse existing drawer/sheet if present)
- Wire in `app/layout.tsx`

2) Homepage
- New: `components/home/brand-hero.tsx` (server or client)
  - Full‑bleed responsive image from `/public/branding/hero.jpg` (placeholder)
  - Entire block is a link to `/shop`
- Update: `app/page.tsx`
  - Render only `<BrandHero/>` (header comes from layout)
  - Remove legacy homepage sections from render path; keep code for later

3) Shop page
- New: `components/shop/collections-tabs.tsx` (client)
  - Horizontally scrollable tabs; highlight active
- New: `components/shop/separator-banner.tsx` (server/client)
  - Accepts `src`, `alt`, `label?` and renders full‑width image separator between product groups
- New: `components/shop/shop-grid.tsx` (server)+client child for infinite load if needed
  - 2‑col grid on mobile, 3–4 on md/lg
  - Accepts `products` and renders; inserts `<SeparatorBanner/>` at group boundaries
- Update: `app/shop/page.tsx`
  - Renders `<CollectionsTabs/>`, optional Collections carousel (reuse existing), then `<ShopGrid/>`

4) Assets (placeholders)
- Add: `public/branding/hero.jpg` (temporary)
- Add: `public/separators/tshirts.jpg`, `public/separators/crop-tops.jpg`, `public/separators/hats.jpg`, `public/separators/accessories.jpg` (temporary)

5) Styles
- Use Tailwind utility classes primarily. Minimal additions in `app/globals.css` for safe area insets and sticky header shadow.

6) Bottom navbar removal
- If present (e.g., `components/layout/mobile-bottom-nav.tsx`), gate with env or feature flag; default hidden for MVP.

---

## Implementation Steps (ordered, copy/paste friendly)

1. Branch and assets
```bash
git checkout -b feature/stussy-mobile-first
mkdir -p public/branding public/separators
# place placeholder images into the above folders
```

2. Header
- Create `components/layout/stussy-header.tsx` with mobile layout: Logo + Hamburger (left), Shop button + Search + Bag (right).
- Implement a minimal `components/layout/mobile-drawer.tsx` if we don’t already have a reusable Drawer/Sheet.
- Wire header in `app/layout.tsx` so it displays on all pages.

3. Homepage
- Create `components/home/brand-hero.tsx` – a 100vw responsive image, clickable to `/shop`.
- Update `app/page.tsx` to render only the hero (remove other sections from the JSX).

4. Shop page
- Create `components/shop/collections-tabs.tsx` – tabs: All, T‑Shirts, Crop Tops, Hats, Accessories. Clicking updates querystring `?collection=...` and scrolls to top.
- Create `components/shop/separator-banner.tsx` – full‑width image block with optional label overlay.
- Create `components/shop/shop-grid.tsx` – accepts products, groups by collection (placeholder grouping), inserts separator banners between groups. Start with server data fetch; add client intersection observer if infinite load is already in the codebase.
- Update `app/shop/page.tsx` – read `searchParams.collection`, fetch products accordingly, render tabs, optional collections carousel, and the grid.

5. Remove bottom navbar
- Locate any bottom nav component; wrap export and usage with a feature flag: `NEXT_PUBLIC_ENABLE_BOTTOM_NAV` (default false). Do not import it in `app/layout.tsx` for MVP.

6. Styling & polish
- Add safe‑area padding for iOS notches.
- Ensure header is sticky, with subtle shadow on scroll.
- Grid spacing: 8–12px gaps mobile, 16–24px desktop.

7. Lint/Typecheck/Preview
```bash
pnpm install
pnpm run lint
pnpm run typecheck || pnpm run build --no-lint
pnpm run dev
```

8. Commit
```bash
git add .
git commit -m "feat(ui): mobile-first Stüssy-style header, homepage hero, shop grid scaffolding with separator banners"
```

9. PR
```bash
git push -u origin feature/stussy-mobile-first
# open PR and request review
```

---

## Suggested Component Skeletons (for fast implementation)

- `components/layout/stussy-header.tsx`
  - Client component. Uses `next/link`, icons (existing), and a Sheet/Drawer for menu.
  - Layout: `flex h-14 items-center justify-between px-3`.
  - Left: `[Hamburger][Logo]`. Right: `[Shop][Search][Bag]`.

- `components/home/brand-hero.tsx`
  - Server component; wraps `next/image` with `Link` to `/shop`.
  - Uses aspect ratio ~ 9:16 on mobile, scales to wider on desktop.

- `components/shop/collections-tabs.tsx`
  - Client; horizontal scroll container; updates `searchParams`.

- `components/shop/separator-banner.tsx`
  - Full‑width responsive image with optional label.

- `components/shop/shop-grid.tsx`
  - Server; receives `products`. If collection filter present, render single block; else render: [N products] → [Separator banner] → [N products] → …

---

## Routing and Data Contract

- Clicking hero → `/shop`.
- Tabs mutate `?collection=slug`.
- Products fetched via existing data layer (Shopify/commerce). If the data layer doesn’t expose collections, start with a flat product list and static banner insertion every 8–12 items.

Edge cases:
- Empty results: show header + tabs + friendly empty state.
- Network slow: skeleton loaders for grid cards and banner placeholders.
- No images: use fallback placeholder.

---

## Accessibility

- Header controls: button roles, aria‑labels (“Open menu”, “Open search”, “Open bag”).
- Hero: descriptive alt text; entire image is a link with `aria-label="Shop Indecisive"`.
- Tabs: `role="tablist"`, `role="tab"`, `aria-selected`.
- Color contrast for text on images (use overlay as needed).

---

## Performance

- `next/image` with proper sizes/srcSet.
- Lazy‑load below‑the‑fold grid items; priority only for hero.
- Cache product queries with revalidate time aligned to catalog churn.

---

## Feature Flags / Config

- `NEXT_PUBLIC_ENABLE_BOTTOM_NAV=false` (default)
- `NEXT_PUBLIC_ENABLE_COLLECTIONS_CAROUSEL=true` (optional)

Add to `.env.local` as needed.

---

## Validation checklist (MVP)

- Mobile
  - Header: logo+hamburger left, shop+search+bag right. Sticky.
  - Homepage: only hero image, links to `/shop`.
  - Shop: tabs visible, product grid 2‑col, separator banners render between groups.
  - Bottom navbar is not shown.
- Desktop
  - Layout scales; 3–4 columns grid.
- Lint/Typecheck: clean.
- Lighthouse: no major regressions; CLS < 0.1 on homepage.

---

## Rollback

- `git checkout main`
- `git revert` the merge commit or close PR.
- Re‑enable bottom nav feature flag if previously used.

---

## Next Iterations (after MVP)

- Wire tabs to real Shopify collections and server filtering.
- Add New Arrivals landing with the same grid pattern if desired.
- Desktop polish: hover states, larger imagery, refined gutters.
- Add Search sheet and Menu drawer content.
- A/B test header layout variants (hamburger position, shop button vs. icon only).

---

Happy path ETA: ~0.5–1 day for wiring + placeholders, another ~0.5–1 day for desktop polish.
