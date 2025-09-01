# /products — UI/UX Overhaul Plan (Structured, Professional)

## Goals

- Strong visual structure: category nav lives in a rounded panel with border/shadow.
- Mobile-first density: immediate quick actions and search without clutter.
- Professional polish: iconified controls, focus states, and subtle separators.

## Key Changes

1) Category Panel
- Wrap pills in a `rounded-2xl border border-gray-200 shadow-sm bg-white` panel with inner padding.
- Keep scrollable pills on mobile inside the panel for a cohesive look.
- Maintain `aria-current`, focus rings, and deduped handles.

2) Sticky Header Polish
- Use `bg-white/90 + backdrop-blur + shadow-sm` on the sticky container.
- Order: Category Panel → Quick Chips (mobile) → Toolbar → Active Filters chips.

3) Inline Search (mobile + desktop)
- Compact input under pills to search within products via `q` param.
- Debounced query → `keyword` filtering on server (title, product_type, tags).

4) Iconified Toolbar Actions
- Add `Filter` and `ArrowUpDown` icons next to labels for scannability.
- Keep rounded‑full buttons minimal and consistent with panel styling.

5) Spacing & Separators
- Slightly increase spacing between pills, chips, and toolbar.
- Keep a light border under the sticky area.

## Deliverables

- Updated `collections-pills` with container panel.
- New `inline-products-search` component.
- `api-enhanced` keyword support and `/products` parsing of `q`.
- Toolbar with icons.

## QA

- Pills render inside a bordered panel; mobile scroll feels natural.
- Search updates the list and URL without full-page jumps.
- Filters, chips, and active filters remain in sticky header without overlapping.

