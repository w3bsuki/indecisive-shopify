# Mobile Pills + Bottom Sheet Refactor Plan

## Summary

Fix the category pills “ALL” drift and edge-touch issues, align the pills panel width with the product grid, and consolidate mobile bottom navigation into a single, polished system. Keep /products using the new refine bar pattern; refactor the original bottom nav sheet for home/collections/product pages to match the new quality bar.

## Goals

- No visual drift: first pill never touches the container edge; consistent spacing on load and after navigation.
- Full-width alignment: pills panel matches the product grid width across breakpoints.
- One refined mobile UX: /products uses a refined bottom refine bar, while the existing bottom nav sheet (elsewhere) is upgraded to the same visual/layering standard.
- Accessibility, performance, and safe-area correctness.

## Out of Scope (for this pass)

- New data sources or product types.
- Replacing pills with in-page tabs (SEO/navigation semantics stay as-is).

---

## Deliverables

1) Stable Category Pills
- Fixed left/right padding and scroll snap so the first pill never hugs the edge.
- Unified spacing for mobile and desktop, aligned to the grid gutters.
- Documented spacing tokens and breakpoints.

2) Refined Bottom Navigation
- Products page: keep the new bottom refine bar (Filters/Sort + count) and hook it into the existing drawer.
- Other pages (home, collections, PDP): refactor the existing bottom nav/bottom sheet to the new visual + behavioral standard.
- Unified event bus for opening filters/sort/size selectors.

3) Accessibility + Safe Area
- Aria-current, focus rings, and screen-reader labels for pills and bottom bar buttons.
- Proper `env(safe-area-inset-bottom)` padding and z-index stacking.

---

## Detailed Implementation Plan

### A) Category Pills: Stability + Width

Files: `components/commerce/collections-pills.tsx`, `components/layouts/product-page-layout.tsx`

1. Container & Width
- Remove nested width wrappers inside the pills component; let the parent layout control overall width (already partially done).
- Ensure the pills panel sits within the same container as the product grid to share gutters.

2. Inner Padding + Edge Guard
- Add consistent inner padding to the panel: `px-4` (mobile), `px-5` (sm+).
- Add first/last spacing guards on pills: `first:ml-2 last:mr-2` so “ALL” never touches the edge even if the scroll container’s padding collapses.
- Optionally set `style={{ scrollPaddingLeft: '16px', scrollPaddingRight: '16px' }}` on the horizontal scroller for extra robustness on iOS.

3. Snap Behavior
- Use `snap-x snap-proximity` (instead of `snap-mandatory`) to reduce jumpy snapping.
- Keep `snap-start` on pills so scrolling settles predictably without shifting initial layout.

4. Rounding + Density
- Keep panel `rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden`.
- Use `rounded-xl` chips (not `rounded-full`) to reduce bubble look, with `gap-3` between items.

5. QA Scenarios
- Initial load (SSR/CSR) on /products: first pill has left breathing room; no edge touch.
- Resize from mobile → desktop: padding/gaps remain correct.
- Long titles and multiple wraps: no overflow outside rounded panel.

### B) /products Bottom Refine Bar (keep)

Files: `components/commerce/mobile-refine-bar.tsx`, `components/commerce/products-toolbar.tsx`, `components/commerce/filter-drawer.tsx`

1. Single Drawer Source of Truth
- Ensure both “Filters” and “Sort” buttons dispatch a single event (e.g., `ui:open-filters`) that opens the existing `FilterDrawer`.
- Map “Sort” tap to the sort section inside the drawer (scroll to anchor or pass context prop).

2. Visual Polish
- Keep `rounded-t-2xl` and `shadow-2xl` with `border-t border-gray-200`.
- Buttons: `rounded-full border border-gray-100 bg-white` for a soft, consistent look.
- Count text: subtle gray; ensure it truncates gracefully.

3. Safe Area + Z-Index
- Include `height: env(safe-area-inset-bottom)` spacer.
- Confirm it sits above drawers/modals but below toasts (z-index map).

4. QA
- Drawer opens from both “Filters” and “Sort”.
- Scrolling the page doesn’t cause overlaps with iOS bottom bars.

### C) Refactor Existing Bottom Nav Sheet (home/collections/PDP)

Files: likely `components/commerce/mobile-bottom-sheet.tsx`, `components/commerce/sticky-mobile-footer.tsx`, `components/commerce/cart-notification.tsx`

1. Visual Alignment with Refine Bar
- Update corner radius to `rounded-t-2xl`.
- Unify borders/shadows (`border-t border-gray-200 shadow-2xl`).
- Use the same spacing scale and font sizes as the refine bar.

2. Behavior & Triggers
- Replace ad-hoc custom events with a single event bus namespace: `ui:*` (e.g., `ui:open-filters`, `ui:open-sort`, `ui:add-to-cart`).
- Ensure PDP size selection and “Add to cart” sync with the bottom sheet (already partially handled via `variant-changed` events; migrate names to `ui:variant-changed`).

3. Sheet Implementation
- Move to a single sheet primitive (existing `components/ui/sheet.tsx`) for consistency across pages.
- Standardize animation (slide-up, ease-out 200ms), mount/unmount timing, and focus trap.

4. Accessibility
- Proper `role="dialog"`, labeled titles, and focus-trap restore.
- Key handling: ESC closes; swipe-down gesture dismiss (mobile only).

5. Safe Area + Scroll
- Respect `env(safe-area-inset-bottom)` inside sheet footer.
- Avoid layout shift: reserve space for bottom bars; test on iOS Safari.

6. QA
- Home/Collections/PDP: interactions don’t conflict with the /products refine bar.
- No duplicate bottom bars.

### D) Theming & Tokens

1. Border + Shadow
- Borders: `border-gray-100` for subtle lines.
- Shadows: `shadow-sm` for panels, `shadow-2xl` for sheets/bars.

2. Radius
- Panels: `rounded-2xl`.
- Chips/Buttons: `rounded-xl` or `rounded-full` where tactile.

3. Typography
- Category chips: uppercase, mono, `text-xs` bold.
- Buttons: `text-sm` medium.

### E) Rollout Steps

1. Implement pills container fixes (padding/first-last margins/scrollPadding).
2. Wire /products refine bar to `FilterDrawer` with `ui:open-filters` and “Sort” anchor.
3. Refactor existing bottom nav sheet to match visuals and event bus standards.
4. Remove any duplicate bottom bars; ensure only one bottom UI is present per page.
5. Manual QA across iOS Safari, Android Chrome, desktop Chrome/Safari.

### F) Acceptance Criteria

- “ALL” pill never touches the panel edge on any device.
- Pills panel is the same width as the product grid.
- On /products, bottom refine bar opens the same filter drawer as other filter entry points.
- On other pages, the existing bottom nav sheet matches the refined style and behavior.
- No overlapping bottom UIs or duplicate bars.

### G) Risks & Mitigations

- Scroll snap quirks on iOS: use both inner padding + `first:ml` guard and scrollPadding.
- Z-index stacking with toasts/modals: define a simple z-index map and enforce it.
- Event collisions: namespace events under `ui:*` and remove legacy listeners.

---

## File Map & Tasks

- `components/commerce/collections-pills.tsx`
  - Add first/last margin guards and optional `scrollPaddingLeft/Right`.
  - Ensure panel inner padding matches grid gutters.

- `components/commerce/mobile-refine-bar.tsx`
  - Confirm event names and unify to `ui:open-filters` (and “sort” anchor state).
  - Tune spacing/labels.

- `components/commerce/products-toolbar.tsx`
  - Listen for `ui:open-filters` and open `FilterDrawer`.
  - Optionally add “open sort section” logic.

- `components/commerce/filter-drawer.tsx`
  - Accept an optional `initialSection` prop and scroll to “Sort” when provided.

- `components/commerce/mobile-bottom-sheet.tsx`, `components/commerce/sticky-mobile-footer.tsx`
  - Migrate to shared visual tokens and `ui:*` events, replace ad-hoc events.
  - Use shared sheet primitive.

- `components/ui/sheet.tsx`
  - Ensure it supports `side="bottom"`, safe-area, and rounded corners.

---

## QA Checklist

- [ ] /products: first pill has left padding; no drift on load.
- [ ] /products: bottom refine bar opens Filters and Sort correctly.
- [ ] /products: no duplicate bottom bars present.
- [ ] Home/Collections/PDP: only the refactored bottom sheet/bar is visible; visuals match /products bar style.
- [ ] iOS Safari and Android Chrome safe areas respected.
- [ ] Keyboard navigation: pills focus rings visible; bottom sheet focus trapped.

