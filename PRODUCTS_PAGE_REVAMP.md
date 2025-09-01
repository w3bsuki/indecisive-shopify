# /products Page Revamp Plan (Filters, Colors, UX)

## Summary

This document outlines a focused revamp of the `/products` page to:

- Make the Crop Tops and T‑shirts quick pills filter correctly using Shopify tags.
- Show real product colors (swatches and selectors) instead of falling back to grey.
- Reduce visual noise by toning down the “Filters” and “Sort” controls so they don’t compete with the rounded collection pills.
- Tighten code paths and normalize category handling for production reliability.

The implementation is surgical and production‑safe: it keeps current data sources, improves normalization/mapping, and simplifies UI details.

---

## Current Issues

- Quick pills for T‑shirts and Crop Tops route to multiple inconsistent collection handles (e.g., `tees`, `tees-1`, `tshirts`) causing incorrect or empty product sets.
- Crop Tops need to be tag‑driven (`tag:"crop top"`) but currently behave inconsistently depending on collection presence.
- Color swatches in product cards and product pages default to grey when the store uses non‑English names, variations like “Hot Pink,” or hex values.
- “Filters” and “Sort” controls are rounded like pills and compete visually with the collection pills (design noise).

---

## Goals

- Correctness: crop tops and tees always show the right products.
- Robust colors: show real swatches for variant color values across locales and value formats.
- Cleaner UI: reduce pill redundancy by making “Filters” and “Sort” controls less pill‑like.
- Maintainability: centralize color name → hex mapping; normalize category handles.

---

## Approach Overview

1) Category normalization and tag‑based filtering (server):
- Normalize `category` query param for tees: `tees`, `tees-1`, `tshirts` → `tshirts`.
- Treat specific categories as “tag categories” to avoid collection fetch and query by tag instead:
  - `crop-tops` → tag `"crop top"`.
  - `tshirts` → tag `tee`.
- This guarantees consistent product sets even if Shopify collections differ or duplicate.

2) Collections pills routing (client):
- Standardize pill hrefs for tees to `?category=tshirts` regardless of the underlying Shopify handle (`tees`, `tees-1`, etc.).
- Retain existing dynamic collection labeling and translation.

3) Color mapping (shared util):
- Centralize color name → hex in `lib/utils/product.ts` with:
  - Exact mappings for common colors and variants.
  - Partial keyword matching (English, French, and Bulgarian synonyms).
  - Hex value passthrough (`#RGB`/`#RRGGBB`).
- Use this shared mapping in both product cards and product page variant selectors.

4) UI polish (toolbar):
- Replace `rounded-full` with `rounded-md` for the Filters button and Sort select.
- Subtle hover, neutral borders, small footprint to reduce competition with pills.

---

## Implementation Details

1) Server filtering and category normalization
- File: `lib/shopify/api-enhanced.ts`
  - Add tag category map entries so “tees/tshirts” use tag filtering and skip collection query:
    - `crop-tops: ["crop top"]`
    - `tees: ["tee"]`
    - `tshirts: ["tee"]`
    - `tees-1: ["tee"]`
- File: `app/(shop)/products/page.tsx`
  - Normalize `category` (`tees`, `tshirts`, `tees-1` → `tshirts`).
  - Pass `tags: ["tee"]` when normalized category is `tshirts`, and `tags: ["crop top"]` for `crop-tops`.

2) Collections pills routing
- File: `components/commerce/collections-pills.tsx`
  - Standardize pill handle routing to `tshirts` for any tees handles.
  - Preserve deduplication by title and translations.

3) Color mapping and swatches
- File: `lib/utils/product.ts`
  - Update `getProductColors` to recognize option names `color`, `colour`, `цвят`.
  - Enhance `getColorFromName`:
    - Accept valid hex strings directly.
    - Add more exact mappings (e.g., `fuchsia`).
    - Add partial keyword matches for Bulgarian synonyms (`розово`, `червено`, `синьо`, etc.).
- File: `components/commerce/add-to-cart-form.tsx`
  - Use the shared `getColorFromName` instead of a local map.
  - Treat variant option names `color`, `colour`, `цвят` as color.

4) Toolbar styling
- File: `components/commerce/products-toolbar.tsx`
  - Change Filters button and Sort select to `rounded-md` + subtle hover states.

---

## QA Checklist

- Filters
  - Tap “CROP TOPS” pill → only products tagged `"crop top"` appear.
  - Tap “T‑SHIRTS” pill (regardless of underlying `tees`/`tees-1` handle) → products tagged `tee` appear.
  - Sort works with active category and other filters.
- Colors
  - Product cards show correct color dots for products with variant colors in English/Bulgarian or hex.
  - Product page color selector shows the real color (e.g., PINK is pink, not grey).
  - Unknown colors degrade to a neutral grey dot.
- UI
  - Filters and Sort controls no longer resemble pills; pills remain rounded and prominent.
  - Mobile and desktop layouts render as expected with sticky toolbar.

---

## Rollout Notes

- No migration required; relies on existing tags: `tee`, `crop top`.
- If Shopify uses additional synonyms (e.g., `t-shirt`) as tags, they can be added to the tag map with no UI change.
- If future locales add different color names, extend keyword arrays in `getColorFromName`.

---

## Future Enhancements (Optional)

- Add metafield-based color swatches using hex codes from Shopify metafields where present.
- Support multi-tag unions (e.g., `tag:(tee OR t-shirt)`), configurable via env.
- Persist UI state (filters, sort) in localStorage for smoother back/forward nav.
- Skeleton loaders specific to product grid filters for perceived performance on slow links.

