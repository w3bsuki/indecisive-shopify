# UI/UX Rounded Refactor Plan — Professional E‑Commerce

This plan upgrades the entire storefront to a cohesive, modern rounded visual system with cleaner mobile UX, consistent components, and a tidy customer flow. It focuses on polish, not wholesale redesign: we keep your information architecture, but unify styles, spacing, and interactions across pages.

## Goals

- Cohesive look: rounded panels/chips, light borders, soft shadows, consistent paddings.
- Mobile-first: ergonomic controls, one clear bottom action pattern, safe-area support.
- Clean interactions: one filter drawer, one bottom sheet primitive, one event bus.
- Accessibility: focus states, aria-current/labels, keyboard nav and screen reader clarity.
- Performance: fewer layout jumps, consistent skeletons, lazy hydration where sensible.

## Core Principles & Tokens

- Radius scale: `rounded-2xl` (panels/sheets), `rounded-xl` (chips/buttons), `rounded-full` (circles only).
- Borders: `border-gray-100` (quiet), avoid `border-gray-200+` unless needed for contrast.
- Shadows: `shadow-sm` (panels), `shadow-2xl` (sheets/bottom bars), avoid double borders + shadows.
- Backgrounds: `bg-white` or `bg-white/90 + backdrop-blur` for sticky layers.
- Spacing: use a small set — 8px, 12px, 16px, 20px, 24px. Keep gutters consistent with the product grid.
- Focus: visible rings (e.g., `focus-visible:ring-2 focus-visible:ring-black`).

## Global Refactors

1) Component primitives
- Unify on existing Radix primitives and shared UI: `Dialog`, `Sheet`, `Dropdown`, `Select`, `Popover`.
- One bottom sheet primitive (`components/ui/sheet.tsx`) with `side="bottom"`, `rounded-t-2xl`, safe-area spacer, consistent animation.

2) Event bus
- Namespaced custom events: `ui:*` (`ui:open-filters`, `ui:open-sort`, `ui:variant-changed`, `ui:add-to-cart`).
- Remove legacy/unscoped events and wire all triggers to the same handlers.

3) Z-index map
- Define a simple map: bottom bar < drawer/sheet < toast < modal.
- Ensure no component visually overlaps incorrectly (especially on iOS Safari).

4) Tokens/utilities
- Codify radius/border/shadow tokens in a short doc (and optionally a constants file) to guide class choices.

## Area-by-Area Plan

### A) Navigation & Header
- Keep the sticky header visually quiet on mobile; reserve the rounded panels for content sections.
- Ensure safe-area insets on notch devices; no double borders.
- Mobile search should not bloat header height — open in sheet or compact inline (desktop only if needed).

### B) Category Pills (ALL / T‑SHIRTS / …)
- Panel: `rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden`.
- Chips: `rounded-xl` (not full); `gap-3` between chips; uppercase mono label.
- Width alignment: remove nested containers; panel follows the product grid width.
- Edge safety: inner padding (`px-4` mobile, `px-5` desktop) + `first:ml-2 last:mr-2`. Optional: scroller `scrollPaddingLeft/Right` for iOS.
- Snap: `snap-x snap-proximity` + chip `snap-start` to reduce jumpiness.

### C) Filters/Sort (Single Drawer)
- “Filters” and “Sort” always open the same drawer (`FilterDrawer`).
- Optional prop to deep link to Sort section (or internal anchor scroll on open).
- Toolbar placement: below the sticky area (above grid) on mobile to avoid header noise; desktop toolbar can remain near the top.

### D) Bottom Bars & Sheets
- /products: use the new `MobileRefineBar` (rounded top, shadow, count, two buttons). Buttons dispatch `ui:open-filters` and `ui:open-sort`.
- Home/Collections/PDP: refactor the existing bottom sheet/footer to match the same visual tokens and event bus.
- One bottom bar per page; remove duplicates. Respect safe-area bottom padding.

### E) Product Grid & Cards
- Card shells: `border border-gray-100`, subtle hover change, consistent inner padding.
- Price + wishlist row: unified style with `rounded-lg` containers on mobile.
- Color swatches: use shared resolver (already done) for consistent colors.
- Skeletons: one consistent card skeleton.

### F) Product Detail Page (PDP)
- Gallery: stable height ratios, rounded thumbnails where used.
- Add-to-cart section: rounded controls, consistent label sizes, clear disabled states.
- Mobile footer/sheet: unify with new bottom bar tokens; shared events (`ui:variant-changed`, `ui:add-to-cart`).
- Size/color selectors: rounded chips; clear selected/disabled styles.

### G) Cart (Drawer/Page) & Notifications
- Mini-cart drawer: `rounded-l-2xl` (if sliding from right), `border-l border-gray-100`, consistent header/footer spacing.
- Notifications: move to a top stacked toast on mobile where appropriate; avoid covering bottom bar.
- Success states: concise, dismissible toasts; no layout shift.

### H) Dropdowns, Menus, Selects, Inputs
- Unify on shared components with `rounded-xl` fields, `border-gray-100`, visible focus, and consistent padding.
- Keep labels small and subtle; use helper text for validation.

### I) Empty/Loading States
- Empty: rounded panels with icon + concise text; clear CTA.
- Loading: skeleton panels/cards augment perceived performance; avoid spinner-only screens.

### J) Accessibility
- Pills: `aria-current="page"` on active; keyboard focus ring.
- Buttons and icons: labels for screen readers, no icon-only without `aria-label`.
- Sheets/Dialogs: `role=dialog`, labeled titles, focus trap and restore on close.

### K) Performance & Quality
- Avoid multiple sticky layers; reduce blur where not needed (mobile perf).
- Debounce search; lazy-load non-critical UI (e.g., tooltips, heavy carousels).
- Image priorities: first fold cards only.

## File Map & Tasks

- `components/commerce/collections-pills.tsx`
  - Finalize inner padding, first/last margins, `scrollPadding` style, `snap-proximity`.

- `components/commerce/products-toolbar.tsx`, `components/commerce/filter-drawer.tsx`
  - Ensure toolbar opens drawer; accept optional `initialSection` to jump to Sort.

- `components/commerce/mobile-refine-bar.tsx`
  - Confirm `ui:open-filters`/`ui:open-sort` events; match button style tokens.

- `components/commerce/mobile-bottom-sheet.tsx`, `components/commerce/sticky-mobile-footer.tsx`
  - Refactor to sheet primitive and tokens; migrate legacy events to `ui:*`.

- `components/commerce/product-card*.tsx`
  - Align borders, spacing, and wishlist/price row styles; unify skeleton.

- `components/commerce/add-to-cart-form.tsx`
  - Rounded chips; consistent disabled states; ensure color resolver usage.

- `components/commerce/cart-notification.tsx`
  - Move to top toasts on mobile; avoid covering bottom bar; z-index audit.

- `components/ui/*`
  - Tokens: border/radius/shadow defaults; ensure `Sheet` supports bottom side with safe-area and rounded corners.

## Acceptance Criteria

- Category pills never touch edges; no drift on first render.
- One filters drawer; bottom bar or sheet never duplicates.
- PDP and Cart match rounded token styles; no sharp, mismatched components.
- Notifications do not overlap bottom bars; safe-area respected.
- Keyboard and screen reader workflows are validated.

## Rollout & QA

1. Implement in a feature branch; enable behind an env flag if desired.
2. Test on iOS Safari and Android Chrome for sticky/blur, bottom bars, and safe areas.
3. Verify SSR → CSR handoff for pills (no layout jump).
4. Check z-index stacking with modals, toasts, drawers.
5. Smoke test core flows: browse → filter → PDP → cart → checkout.

## Notes

- We deliberately avoid heavy redesign and focus on consistency, spacing, and component unification. This yields a premium feel with minimal risk and fast delivery.

