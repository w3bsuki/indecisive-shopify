# COMPREHENSIVE CODEBASE AUDIT
## Indecisive Wear Store - January 2025

### Executive Summary
Complete audit of all directories and files in the codebase to identify:
- Active, used files that must be kept
- Unused files and dead code
- Duplicate functionality
- Empty directories
- Outdated documentation
- Tech debt

---

## ROOT DIRECTORY FILES

### Configuration Files (KEEP)
- `package.json` - ✅ ACTIVE - Project dependencies and scripts
- `package-lock.json` - ✅ ACTIVE - Dependency lock file
- `tsconfig.json` - ✅ ACTIVE - TypeScript configuration
- `next.config.mjs` - ✅ ACTIVE - Next.js configuration
- `tailwind.config.ts` - ✅ ACTIVE - Tailwind CSS configuration
- `eslint.config.js` - ✅ ACTIVE - ESLint configuration
- `jest.config.js` - ✅ ACTIVE - Jest test configuration
- `playwright.config.ts` - ✅ ACTIVE - Playwright E2E test configuration
- `lighthouserc.js` - ✅ ACTIVE - Lighthouse CI configuration
- `components.json` - ✅ ACTIVE - shadcn/ui configuration
- `middleware.ts` - ✅ ACTIVE - Next.js middleware for auth/routing

### Documentation Files (REVIEW)
- `README.md` - ✅ KEEP - Main project documentation
- `CLAUDE.md` - ✅ KEEP - Claude AI instructions (actively used)
- `SHOPIFY_MIGRATION_NOTE.md` - ✅ KEEP - Recent migration notes (Jan 2025)
- `PERFORMANCE_BENCHMARK_REPORT.md` - ⚠️ OUTDATED - Old benchmark from Jan 30
- `PERFORMANCE_OPTIMIZATION_GUIDE.md` - ⚠️ REVIEW - May be outdated
- `PERFORMANCE_VALIDATION_SUMMARY.md` - ⚠️ REVIEW - May be outdated
- `PRODUCT_IMAGES_ANALYSIS.md` - ⚠️ REVIEW - Possibly outdated analysis

### Other Root Files
- `.env` - ✅ ACTIVE - Environment variables (gitignored)
- `.env.local` - ✅ ACTIVE - Local environment variables (gitignored)
- `.env.example` - ❌ REMOVE - Not referenced, outdated example
- `extensions.json` - ⚠️ REVIEW - VS Code extensions recommendation
- `next-env.d.ts` - ✅ ACTIVE - Next.js TypeScript declarations

---

## DIRECTORY STRUCTURE AUDIT

### `.claude/` Directory
- `settings.local.json` - ✅ ACTIVE - Claude AI local settings

### `agents/` Directory
**Purpose**: AI agent configurations for development assistance

- `agents/auditor/CLAUDE.md` - ⚠️ REVIEW - Possibly unused agent config
- `agents/devops/CLAUDE.md` - ⚠️ REVIEW - Possibly unused agent config
- `agents/research/CLAUDE.md` - ⚠️ REVIEW - Possibly unused agent config
- `agents/testing/CLAUDE.md` - ⚠️ REVIEW - Possibly unused agent config

### `app/` Directory (Next.js App Router)

#### Route Groups
- `(content)/` - ✅ ACTIVE - Content pages route group
  - `lookbook/` - ✅ ACTIVE - Lookbook page
  - `reviews/` - ✅ ACTIVE - Reviews page
  - `shipping/` - ✅ ACTIVE - Shipping info page
  - `size-guide/` - ✅ ACTIVE - Size guide page
  - `support/` - ✅ ACTIVE - Support page
  - `error.tsx` - ✅ ACTIVE - Error boundary
  - `loading.tsx` - ✅ ACTIVE - Loading state

- `(shop)/` - ✅ ACTIVE - Shopping pages route group
  - `accessories/` - ✅ ACTIVE - Accessories category
  - `bottoms/` - ✅ ACTIVE - Bottoms category
  - `cart/` - ✅ ACTIVE - Shopping cart
  - `collections/[handle]/` - ✅ ACTIVE - Dynamic collections
  - `coming-soon/` - ✅ ACTIVE - Coming soon products
  - `essentials/` - ✅ ACTIVE - Essentials category
  - `new/` - ✅ ACTIVE - New arrivals
  - `outerwear/` - ✅ ACTIVE - Outerwear category
  - `products/` - ✅ ACTIVE - Products listing and detail pages
  - `sale/` - ✅ ACTIVE - Sale items
  - `search/` - ✅ ACTIVE - Search functionality
  - `streetwear/` - ✅ ACTIVE - Streetwear category
  - `wishlist/` - ✅ ACTIVE - Wishlist page
  - `error.tsx` - ✅ ACTIVE - Shop error boundary
  - `loading.tsx` - ✅ ACTIVE - Shop loading state
  - `layout.tsx` - ✅ ACTIVE - Shop layout wrapper

#### Account Section
- `account/` - ✅ ACTIVE - Account management
  - `addresses/` - ✅ ACTIVE - Address management
  - `components/` - ✅ ACTIVE - Account-specific components
  - `enhanced/` - ❌ EMPTY DIRECTORY - Remove
  - `orders/` - ✅ ACTIVE - Order history
  - `profile/` - ✅ ACTIVE - Profile management
  - `settings/` - ✅ ACTIVE - Account settings
  - Various account pages and components - ✅ ALL ACTIVE

#### API Routes
- `api/admin/` - ⚠️ REVIEW - Admin endpoints
  - `rate-limits/` - ⚠️ Possibly unused monitoring endpoint
- `api/auth/` - ✅ ACTIVE - Authentication endpoints
- `api/health/` - ✅ ACTIVE - Health check endpoint
- `api/instagram/` - ⚠️ REVIEW - Instagram integration
  - `posts/` - ⚠️ Check if Instagram feed is used
- `api/test/` - ❌ REMOVE - Test endpoints
  - `rate-limit/` - ❌ Test endpoint, not for production

#### Other App Routes
- `admin/monitoring/` - ⚠️ REVIEW - Admin monitoring page
- `auth-test/` - ❌ REMOVE - Test page for authentication
- `checkout/` - ✅ ACTIVE - Checkout flow
- `cookie-policy/` - ✅ ACTIVE - Legal page
- `demo-tabs/` - ❌ EMPTY DIRECTORY - Remove
- `login/` - ✅ ACTIVE - Login page
- `order-confirmation/` - ✅ ACTIVE - Order confirmation
- `order-processing/` - ✅ ACTIVE - Order processing
- `privacy-policy/` - ✅ ACTIVE - Legal page
- `register/` - ✅ ACTIVE - Registration page

#### App Root Files
- `error.tsx` - ✅ ACTIVE - Global error boundary
- `global-error.tsx` - ✅ ACTIVE - Global error handler
- `layout.tsx` - ✅ ACTIVE - Root layout
- `loading.tsx` - ✅ ACTIVE - Global loading state
- `manifest.ts` - ✅ ACTIVE - PWA manifest
- `not-found.tsx` - ✅ ACTIVE - 404 page
- `page.tsx` - ✅ ACTIVE - Homepage
- `robots.ts` - ✅ ACTIVE - SEO robots.txt
- `sitemap.ts` - ✅ ACTIVE - SEO sitemap
- `web-vitals.tsx` - ✅ ACTIVE - Performance monitoring
- `resource-hints.tsx` - ✅ ACTIVE - Resource preloading

#### Actions Directory
- `actions/` - ✅ ACTIVE - Server actions
  - `addresses.ts` - ✅ ACTIVE
  - `auth.ts` - ✅ ACTIVE
  - `orders.ts` - ✅ ACTIVE
  - `profile.ts` - ✅ ACTIVE

### `components/` Directory

#### Account Components
- `account/` - ✅ ACTIVE - All account-related components in use

#### Analytics Components
- `analytics/` - ✅ ACTIVE - Analytics providers

#### Checkout Components
- `checkout/` - ✅ ACTIVE - Checkout flow components
  - Note: Two shipping calculators found - check for duplication

#### Commerce Components
- `commerce/` - ✅ ACTIVE - E-commerce components
  - `client/` - ❌ EMPTY DIRECTORY - Remove
  - `server/` - ❌ EMPTY DIRECTORY - Remove
  - Multiple community section variants:
    - `community-section.tsx` - ✅ ACTIVE (used in homepage)
    - `community-section-minimal.tsx` - ⚠️ CHECK USAGE
    - `community-section-icons.tsx` - ⚠️ CHECK USAGE
  - Product card variants:
    - `product-card.tsx` - ✅ ACTIVE
    - `product-card-server.tsx` - ✅ ACTIVE
    - `product-card-minimal.tsx` - ✅ ACTIVE (used in carousel)
    - `product-card-minimal-server.tsx` - ✅ ACTIVE
  - Two shipping calculators:
    - `shipping-calculator.tsx` - ⚠️ CHECK FOR DUPLICATION
    - Also one in checkout folder

#### Dev Components
- `dev/` - ⚠️ REVIEW
  - `toolbar-setup.tsx` - ⚠️ Development toolbar, check if needed

#### Demo Components
- `demo/` - ❌ EMPTY DIRECTORY - Remove

#### Layout Components
- `layout/` - ✅ ACTIVE - Layout components
  - `client/` - ❌ EMPTY DIRECTORY - Remove
  - `server/` - ❌ EMPTY DIRECTORY - Remove
  - `cookie-banner.tsx` - ⚠️ DUPLICATE? (also have cookie-consent.tsx)
  - `cookie-consent.tsx` - ✅ ACTIVE - Currently used

#### Other Component Directories
- `layouts/` - ✅ ACTIVE - Page layout components
- `providers/` - ✅ ACTIVE - React context providers
- `reviews/` - ✅ ACTIVE - Review components
- `shared/` - ✅ ACTIVE - Shared components
- `ui/` - ✅ ACTIVE - shadcn/ui components (all needed)

### `contexts/` Directory
- `fly-to-cart-context.tsx` - ✅ ACTIVE - Cart animation context

### `docs/` Directory
**Many outdated documentation files from old migrations**

#### Root Documentation
- Various migration reports - ⚠️ MOSTLY OUTDATED
- Best practices guides - ✅ KEEP (still relevant)
- `performance-audit-report.md` - ⚠️ OUTDATED

#### Subdirectories
- `agents/` - ⚠️ REVIEW - Agent documentation
- `plans/` - ⚠️ MOSTLY OUTDATED - Old project plans
- `reports/` - ⚠️ MOSTLY OUTDATED - Old migration reports

### `hooks/` Directory
- `use-ab-test.tsx` - ❌ UNUSED - Not imported anywhere
- `use-advanced-search.tsx` - ✅ ACTIVE
- `use-cart.tsx` - ✅ ACTIVE
- `use-cookie-consent.tsx` - ✅ ACTIVE
- `use-currency.tsx` - ✅ ACTIVE
- `use-instagram.tsx` - ⚠️ CHECK - Used with Instagram API
- `use-market.tsx` - ✅ ACTIVE
- `use-mobile.tsx` - ✅ ACTIVE
- `use-products.tsx` - ✅ ACTIVE
- `use-recently-viewed.tsx` - ✅ ACTIVE
- `use-search.tsx` - ✅ ACTIVE
- `use-toast.ts` - ✅ ACTIVE
- `use-translation.tsx` - ✅ ACTIVE
- `use-wishlist.tsx` - ✅ ACTIVE
- `use-wishlist-enhanced.tsx` - ✅ ACTIVE

### `i18n/` Directory
- `request.ts` - ✅ ACTIVE - Internationalization setup

### `lib/` Directory
- `actions/` - ❌ EMPTY DIRECTORY - Remove
- `analytics/` - ✅ ACTIVE - Analytics utilities
- `auth/` - ✅ ACTIVE - Authentication utilities
- `cache/` - ✅ ACTIVE - Caching configuration
- `currency/` - ✅ ACTIVE - Currency utilities
- `delivery/` - ✅ ACTIVE - Delivery providers
- `i18n/` - ✅ ACTIVE - Translation utilities
- `instagram/` - ⚠️ CHECK - Instagram client
- `performance/` - ✅ ACTIVE - Performance monitoring
- `security/` - ✅ ACTIVE - Security headers
- `shopify/` - ✅ ACTIVE - Shopify integration
- `stores/` - ❌ EMPTY DIRECTORY - Remove
- `utils/` - ✅ ACTIVE - General utilities
- `validators/` - ❌ EMPTY DIRECTORY - Remove

### `messages/` Directory
- Translation files for bg, de, en - ✅ ALL ACTIVE

### `public/` Directory
- `.well-known/security.txt` - ✅ ACTIVE - Security info
- `robots.txt` - ✅ ACTIVE - SEO file
- Various images and assets - ✅ ACTIVE

### `scripts/` Directory
- `configure-shopify.mjs` - ⚠️ REVIEW - Setup script
- `configure-shopify-basic.mjs` - ⚠️ REVIEW - Setup script
- `test-all-features.mjs` - ❌ REMOVE - Test script

### `tests/` Directory
- Component tests - ✅ ACTIVE (if running tests)
- E2E tests - ✅ ACTIVE (if running tests)
- Mock files - ✅ ACTIVE (if running tests)

### `types/` Directory
- `window.d.ts` - ✅ ACTIVE - Window type declarations

---

## SUMMARY OF FINDINGS

### Empty Directories to Remove (10)
1. `app/account/enhanced/`
2. `app/demo-tabs/`
3. `components/commerce/client/`
4. `components/commerce/server/`
5. `components/demo/`
6. `components/layout/client/`
7. `components/layout/server/`
8. `lib/actions/`
9. `lib/stores/`
10. `lib/validators/`

### Unused Files to Remove
1. `.env.example` - Outdated example
2. `app/auth-test/` - Test page
3. `app/api/test/` - Test API routes
4. `hooks/use-ab-test.tsx` - Unused hook
5. `scripts/test-all-features.mjs` - Test script

### Duplicate/Conflicting Files
1. Cookie consent components (cookie-banner.tsx vs cookie-consent.tsx)
2. Shipping calculator components (2 instances)
3. Multiple community section variants

### Outdated Documentation
- Performance reports from January
- Old migration reports in docs/reports/
- Old project plans in docs/plans/
- Some agent documentation may be outdated

### Questionable Items
1. Instagram integration - check if actively used
2. Admin monitoring pages - check if needed
3. Delivery providers (Econt, Speedy) - check if used
4. Dev toolbar - needed in production?

---

## TECH DEBT IDENTIFIED

1. **Empty directories** from incomplete refactoring
2. **Test files** left in production code
3. **Duplicate components** with similar functionality
4. **Outdated documentation** cluttering the repo
5. **Unused hooks and utilities**
6. **Test/demo code** mixed with production

Total estimated files/folders to remove: ~40-50 items

---

## FULL CODEBASE AUDIT — August 2025 (Production Cleanup Plan)

Executive summary
- Status: Production, feature-rich but bloated. Clear opportunities to remove dead code, demo/dev routes, and duplicated components without affecting customer flows.
- High-priority removals are safe: empty dirs, unused components, dev/demo routes, duplicate shipping calculator, duplicate cookie banner.
- Medium-priority items to quarantine/feature-flag: Instagram integration (currently unused in UI), Econt provider (disabled), debug APIs, bulky docs.
- TODO/FIXME hygiene: 38+ occurrences detected (sampled), focus areas: delivery/econt, analytics placeholders, deprecated hooks.

What was verified in this audit
- Project root structure, app routes, components, hooks, lib, scripts, docs, messages, contexts, public. Cross-checked usage with workspace-wide search.
- Confirmed live homepage composition in `app/page.tsx`.
- Verified imports and live references for “questionable” modules.

Key live surfaces (keep)
- App shell and critical routes: `app/layout.tsx`, `app/page.tsx`, `(shop)/*`, `(content)/*`, checkout, account, login/register, legal pages, `robots.ts`, `sitemap.ts`, `web-vitals.tsx`.
- Shopify integration: `lib/shopify/*`, product listing/detail, cart/checkout flows, rate limiting infra for admin monitoring.
- Translations: `messages/bg.json`, `messages/de.json`, `messages/en.json` (active); `i18n/request.ts` used.
- UI primitives and shared components: `components/ui/*`, `components/layout/*` (except noted duplicates).
- Contexts in use: `contexts/fly-to-cart-context.tsx` (widely imported), `contexts/cart-slideout-context.tsx`.

Immediate safe removals (no runtime references)
Empty directories
1) `app/account/enhanced/`
2) `app/demo-tabs/`
3) `components/commerce/client/`
4) `components/commerce/server/`
5) `components/demo/`
6) `components/layout/client/`
7) `components/layout/server/`
8) `lib/actions/`
9) `lib/stores/`
10) `lib/validators/`

Unused or duplicate components/hooks
- `components/layout/cookie-banner.tsx` — duplicate of `cookie-consent.tsx` and not imported anywhere.
- `components/commerce/shipping-calculator.tsx` — duplicate; the app uses `components/checkout/shipping-calculator.tsx` from `product-tabs.tsx`.
- `components/dev/toolbar-setup.tsx` — marked deprecated, no imports; safe to remove.
- `hooks/use-ab-test.tsx` — unused; safe to remove.
- `hooks/use-products.tsx` — explicitly deprecated and throws; no imports; remove to avoid accidental usage.
- `components/commerce/community-section-icons.tsx` and `components/commerce/community-section-minimal.tsx` — no imports; remove.

Dev/demo routes and APIs (remove for production)
- Routes: `app/auth-test/`, `app/demo-cards/`, `app/demo-cards-mobile/`, `app/demo-collection/`, `app/debug-products/`, `app/debug-collections/`.
- APIs: `app/api/test/` (rate-limit test), `app/api/debug-collections/` (empty), evaluate `app/api/debug-products/route.ts` (dev-only).

Medium-priority (quarantine or feature-flag)
Instagram integration (currently unused by homepage UI)
- UI: Homepage uses `components/commerce/CommunityCarousel` (static assets), not `CommunitySection` (Instagram-driven).
- Code paths: `app/api/instagram/posts/route.ts`, `lib/instagram/client.ts`, `hooks/use-instagram.tsx`, `components/commerce/community-section.tsx` exist but aren’t wired into the homepage.
- Action: move these to `experimental/` or behind an env flag. If social feed is not a near-term requirement, plan removal in Phase 2.

Delivery providers
- `lib/delivery/manager.ts` registers only Speedy and comments out Econt. Shopify carrier service lists `providers: ['speedy']`.
- `lib/delivery/econt/*` contains placeholder methods that throw. No customer path should reach Econt today.
- Action: quarantine `econt` under `experimental/` or remove with clear git tag for retrieval.

Admin/monitoring
- `app/admin/monitoring/page.tsx` uses `getRateLimitStats` from `lib/rate-limit`. If used by ops, keep; otherwise, feature-flag behind admin auth.
- `app/api/admin/rate-limits/route.ts` — keep if monitoring is needed; confirm with stakeholders.

Variants and consolidation recommendations
- Product cards: in production, the following are used: `ProductCardServer`, `ProductCardMinimal`, `ProductCardMinimalServer`. Variants `simple`, `modern`, `perfect`, `refined`, `v2` appear used only by demo pages.
  - Plan: remove demo pages first, then delete unused variants and their grids (`product-grid-modern`, `product-grid-perfect`).
- Community sections: keep `CommunityCarousel` (used on homepage). Remove unused `community-section.tsx` only if Instagram is dropped; otherwise keep but quarantine.

Scripts
- `scripts/test-all-features.mjs` — test script; remove.
- `scripts/configure-shopify*.mjs` — keep but review docs and ensure they are current.

Docs hygiene
- Many reports/plans are outdated. Archive under `docs/_archive/` or prune:
  - Outdated: `performance-audit-report.md`, old migration reports in `docs/reports/`, old plans in `docs/plans/`.
  - Update references that point to removed dev routes (e.g., `AUTHENTICATION_GUIDE.md` mentions `/auth-test`).
  - `INSTAGRAM_INTEGRATION.md` should be archived if we drop Instagram.

TODO/FIXME and deprecated markers (focus fixes)
- Delivery: TODOs in `lib/delivery/econt/*` and `lib/delivery/manager.ts`.
- Analytics placeholders in `components/providers/shopify-analytics.tsx`.
- Deprecated hook file `hooks/use-products.tsx` (remove now).
- Back-in-stock TODO in `components/commerce/back-in-stock-form.tsx`.
- Count sampled: 38+ occurrences across code/docs; run a lint rule to prevent new TODO/FIXME in production code.

Dependency and runtime notes
- Next.js 15.3, React 19, Tailwind 4.1, next-intl 4.3 in use.
- `@21st-extension/*` toolbar appears only in `components/layout/client-layout.tsx`; keep if used in production, otherwise feature-flag.

Prioritized cleanup plan
Phase 1 — No-risk removals (immediate)
- Delete all listed empty directories (10).
- Remove: `cookie-banner.tsx`, `components/commerce/shipping-calculator.tsx`, `components/dev/toolbar-setup.tsx`, `hooks/use-ab-test.tsx`, `hooks/use-products.tsx`, `community-section-icons.tsx`, `community-section-minimal.tsx`.
- Remove dev/demo routes and test APIs: `app/auth-test/`, `app/api/test/`, `app/demo-*`, `app/debug-*`, `app/api/debug-collections/`.
- Remove `scripts/test-all-features.mjs`.

Phase 2 — Quarantine and flags
- Move Instagram integration (`app/api/instagram`, `lib/instagram`, `hooks/use-instagram.tsx`, `components/commerce/community-section.tsx`) under `experimental/` or guard by `FEATURE_INSTAGRAM=false`.
- Move `lib/delivery/econt/*` under `experimental/` or remove; keep Speedy only.
- Gate `app/admin/monitoring/*` behind admin auth/flag.

Phase 3 — Consolidation and docs
- Remove unused product card/grid variants once demo routes are gone.
- Sweep TODO/FIXME with owners, create issues, or implement.
- Archive/prune stale docs and update guides to remove references to deleted routes.

Risk assessment and rollback
- All Phase 1 items have zero imports or are demo/dev-only; safe to delete without impacting storefront or checkout.
- Phase 2 items are isolated; quarantine maintains easy rollback. Tag the repo before removal.

Validation checklist after cleanup
- `pnpm build` passes; `pnpm test` green; Playwright smoke of homepage, PDP, cart, checkout.
- Lighthouse and Web Vitals checked via `web-vitals.tsx` and CI.
- Sentry DSN configured and error rates monitored for 48h.

Appendix — Evidence excerpts
- Duplicate shipping calculator: imports point to `components/checkout/shipping-calculator.tsx`; `components/commerce/shipping-calculator.tsx` unused.
- Cookie consent: `components/layout/client-layout.tsx` imports `cookie-consent`; no references to `cookie-banner`.
- Instagram unused on homepage: `app/page.tsx` uses `CommunityCarousel` (static assets), not `CommunitySection`.
- Econt disabled: `lib/delivery/manager.ts` and Shopify carrier-service restrict providers to Speedy.