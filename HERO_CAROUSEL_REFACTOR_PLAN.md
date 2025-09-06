# Hero Carousel Refactor Plan (Final)

Decision: Fetch hero slides from Shopify Collections (primary), with optional curated overrides. No dependency on Supabase for hero.

Goal: Revamp the homepage hero to showcase 4–5 key collections with a smooth, performant carousel, using Shopify collections as the primary data source, with curated fallback images and clear CTAs to `/collections/<handle>`.

## Outcomes

- Collections-first hero slides (title, image, handle, CTA to collection).
- Auto-play, manual controls, and progress indicators with reduced-motion support.
- Fast, stable rendering (no CLS) with fixed hero height and `next/image` optimization (AVIF/WebP).
- Robust fallbacks: curated public images or product featured images if a collection image is missing.
- Optional: switch to a proper carousel lib (Embla) for gestures and A11y.

## Data Sources & Strategy (Final)

- Primary: Shopify collections via `lib/shopify/api.ts:getCollections()` and `lib/shopify/queries.ts:COLLECTIONS_QUERY` (already present).
  - Use `collection.image.url` when available.
  - If `collection.image` missing, try one featured product image from that collection (secondary query).
- Secondary: Curated assets in `public/hero/collections/` mapped by collection handle.
  - If provided, curated images take precedence for consistent art direction.
- Category tagging: For virtual/tag categories (e.g., `crop-tops`, `tees`), treat as “virtual slides” only if requested; otherwise stick to Shopify collection entities for hero slides.
 - Supabase: Not used for hero slides. Existing Supabase usage elsewhere remains untouched.

## What I Need From You

- Featured collections: 4–5 collection handles and the order (e.g., `tshirts`, `crop-tops`, `hats`, `bags`).
- Curated images (optional but recommended):
  - Desktop: 1920×1080 (or larger, landscape preferred)
  - Mobile: 1242×828 (safe zones: avoid top ~100px and bottom ~140px)
  - Filenames: match handles if possible (e.g., `tshirts.jpg`, `crop-tops.jpg`)
  - Delivery: upload to `public/hero/collections/` or share URLs
- Alt text: 3–6 words per image.
- CTA link preference per slide (default is `/collections/<handle>`).

## Implementation Plan (Final)

1) Data & API
- Add helper `getHeroCollectionSlides(maxSlides, preferredHandles?)`:
  - Fetch collections (`getCollections(50)`) and index by handle.
  - If `preferredHandles` supplied, filter/order accordingly; else pick top collections by relevance (configurable ordering: tees → crop tops → hats → bags → others A–Z).
  - For each selected collection:
    - Image choice priority: curated public asset → `collection.image.url` → first product featured image (fallback query).
    - Return slide: `{ id, handle, title, image, href: "/collections/<handle>" }`.
- Caching: wrap with `unstable_cache` using `CACHE_TIMES.HERO` and tags `["hero", "collections"]` (see `lib/cache/config.ts`).

API Sketch:
```ts
// lib/shopify/hero-collections.ts
export interface HeroCollectionSlide {
  id: string
  handle: string
  title: string
  image: string
  href: string // `/collections/<handle>`
}

export async function getHeroCollectionSlides(
  maxSlides: number = 5,
  preferredHandles?: string[]
): Promise<HeroCollectionSlide[]> { /* impl as described */ }
```

2) Components
- Update `components/layout/hero.tsx` to use `getHeroCollectionSlides` instead of product-based `getHeroSlides`.
- Update `components/layout/hero-client.tsx`:
  - Accept new slide shape with `handle` and `href`.
  - CTA points to `href`.
  - Maintain fixed height class `.hero-section-fixed` to avoid CLS.
  - Keep reduced-motion handling and preloading.
- Optional: Replace simple crossfade with Embla carousel for pointer gestures and A11y.

3) Assets & Config
- If you provide curated images, add a small lookup map, e.g., `lib/hero/collection-image-overrides.ts`:
  ```ts
  export const COLLECTION_HERO_IMAGE_OVERRIDES: Record<string, string> = {
    'tshirts': '/hero/collections/tshirts.jpg',
    'crop-tops': '/hero/collections/crop-tops.jpg',
    'hats': '/hero/collections/hats.jpg',
    'bags': '/hero/collections/bags.jpg',
  }
  ```
- Confirm `next.config.mjs` `images.remotePatterns` includes `cdn.shopify.com` (it does) and `images.formats` includes `['image/avif','image/webp']` (already configured).

Default ordering & selection logic (if you don’t provide handles):
- Priority weights: T‑SHIRTS (tees/tshirts/tees‑1), CROP TOPS, HATS (caps/bucket‑hats), BAGS (tote‑bags), then others A–Z.
- Select first `maxSlides` from the weighted list that have an available image (after fallback resolution).

4) Accessibility & UX
- Keyboard: arrow keys and dots/buttons to navigate slides.
- Reduced motion: pause auto-advance when `prefers-reduced-motion: reduce`.
- Announce slide changes for screen readers (aria-live on slide container or nav).
- Tap areas: ensure CTA and nav controls are finger-friendly (min 44×44px).

5) Performance
- Preload first slide image (priority) and eagerly preload the next slide.
- Use `sizes="100vw"` and constrain height via CSS only (`.hero-section-fixed`).
- Cache slides with `unstable_cache` and tag invalidation on collection updates (future hook if needed).
- Keep CLS < 0.02 by preserving fixed height and avoiding layout shifts.

6) Optional Enhancements
- Embla integration for gestures and A11y (keeps DOM light):
  - Lazy-load Embla on the client (`dynamic(() => import('embla-carousel-react')...)`).
  - Pause on hover/focus, resume on blur.
- Variant: mosaic “collection spotlight” layout for desktop where slide N shows feature + next/prev previews.
- Analytics: track slide impressions and CTA clicks.

## File Changes (Proposed)

- `lib/shopify/hero-collections.ts` (new): implement `getHeroCollectionSlides()` with caching + fallbacks.
- `components/layout/hero.tsx`: switch to collection slides utility.
- `components/layout/hero-client.tsx`: CTA to collection, minor A11y polish; keep fixed height.
- `lib/hero/collection-image-overrides.ts` (new, optional): curated asset map.
- `public/hero/collections/*` (optional): curated assets.

## Acceptance Criteria

- Hero displays exactly the selected 4–5 collections in specified order.
- Each slide shows: title (localized if needed), image, CTA to collection.
- Works with or without curated images (fallback to Shopify image/product image).
- Smooth transitions, no layout shifts, compliant with reduced motion.
- Lighthouse: no regressions; images served as AVIF/WebP via `next/image`.

## Testing & Validation

- Visual: desktop and mobile breakpoints; verify headline/CTA safe zones.
- A11y: tab navigation, screen reader announcements, contrast check.
- Performance: inspect images (formats, DPR variants), verify no unnecessary re-renders.
- Error paths: simulate missing collection image, missing curated asset, network errors → fallbacks display.

## Open Questions

- Confirm the 4–5 collection handles and desired order (or use default weighting).
- Provide curated images or confirm we should rely on Shopify images only.
- Should we include virtual/tag categories (e.g., `crop-tops`) if there is no Shopify collection? If yes, show as “virtual slides” using curated images or a tag-driven product image.
- Do you want Embla carousel in this pass, or keep crossfade for now?

## Next Steps

1) Share the collection handles and order, and (optionally) drop curated images in `public/hero/collections/`.
2) I will implement `getHeroCollectionSlides` + wire the hero.
3) QA pass with your assets; adjust safe zones and copy.
4) Optional: Embla carousel upgrade.

## Checklist (Execution)

- [ ] Create `lib/shopify/hero-collections.ts` with `getHeroCollectionSlides` and caching
- [ ] Add `lib/hero/collection-image-overrides.ts` (optional) and wire overrides
- [ ] Update `components/layout/hero.tsx` to use collections slides
- [ ] Update `components/layout/hero-client.tsx` to use `href` and collection titles
- [ ] Verify images load from Shopify CDN as AVIF/WebP
- [ ] Validate reduced motion, keyboard nav, and focus rings
- [ ] Visual QA desktop/mobile and adjust safe zones if needed
