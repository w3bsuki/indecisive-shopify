# /products — Mobile‑First UX Revamp Plan

## Objectives

- Elevate the mobile experience first: faster scanning, fewer taps, clear hierarchy.
- Make categories discoverable and tappable without visual clutter.
- Provide powerful filters in a compact, friendly way.
- Keep the design consistent with the brand (rounded, light, tactile).

## Problems Observed

- Above‑the‑fold feels sparse on mobile; pills + toolbar lack supporting context.
- Filter controls previously competed with category pills (visual noise).
- No quick actions for common intents (in‑stock only, budget caps, sale).
- Colors were inconsistent in bottom sheet (resolved in code, kept here for completeness).

## Design Principles

- Mobile first: primary actions reachable in one thumb zone.
- Less chrome, more content: pills stand out; controls are quiet.
- Progressive disclosure: compact controls → full sheet for details.
- Semantic nav: pills act as navigation (with `aria-current`).

## Scope (Phase 1)

1) Category Navigation
- Keep rounded pill navigation with clear focus rings and `aria-current`.
- Ensure deduped/normalized handles for tees/crop‑tops.

2) Sticky Header Polish
- Subtle `bg-white/90 + backdrop-blur` for the sticky area so it feels cohesive.
- Keep filters and active chips within this sticky zone.

3) Quick Filter Chips (Mobile)
- Lightweight, tappable chips under pills:
  - In‑Stock → `availability=in-stock` toggle
  - Under 50 → `maxPrice=50` toggle
  - Sale → `tags=sale` toggle (extensible)
- Chips reflect current state; tap to toggle.

4) Toolbar Refinements (Mobile)
- Compact “Filters” and “Sort” buttons open the bottom sheet.
- Show small item count near these controls on mobile for context.

5) Query Parsing / Filtering
- Parse `tags` from query for flexibility (sale, new, promos).
- Keep existing color/size/price/availability filters.

## Non-Goals (Phase 1)

- Replacing pills with tabbed content (would require state/URL refactor).
- New data sources (ratings, metafields). Can be Phase 2.

## Success Criteria

- Mobile above‑the‑fold looks full, purposeful, and scan‑friendly.
- One tap to see filters; two taps to apply most common quick filters.
- Pills remain the hero; controls are tidy and secondary.

## Implementation Checklist

- [x] Normalize tees/crop‑tops and tag filters (complete).
- [x] Shared color mapping for PDP/card/bottom sheet (complete).
- [x] Accessibility and focus polish on pills (complete).
- [ ] QuickFilterChips component with three toggles.
- [ ] Sticky header polish (`bg-white/90`, blur).
- [ ] Mobile toolbar shows count.
- [ ] Parse `tags` in `/products` page.
- [ ] Type-check and verify.

## Rollout & QA

- Verify toggles add/remove query params and update product list.
- Ensure sticky header doesn’t jump on iOS Safari (blur + border OK).
- Confirm pills + chips are scrollable without layout shift.

