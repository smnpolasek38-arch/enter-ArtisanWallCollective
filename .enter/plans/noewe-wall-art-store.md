# Noewe — Premium Wall Art Storefront

## Context

The project is a fresh React + Vite + Tailwind + shadcn template (i18n already enabled: en + zh-CN). The user wants a modern, premium, high-converting storefront for wall art (posters, framed prints, canvas prints) under the brand **Noewe**, using a **"Minimal gallery — warm neutrals"** aesthetic. Per user decisions: **frontend-only showcase** (static catalog + browser cart, no backend), large visuals, interior inspiration, clear product options (size / format / frame), strong CTAs, reviews and trust elements, mobile-first.

A designer-system spec has been produced (colors, type, layout, component recipes) and is the source of truth for this plan.

## Design System

### Colors (HSL → `index.css` `:root`, mapped in `tailwind.config.ts`)

| Token | HSL | Hex |
|---|---|---|
| `--background` | 40 25% 97% | #F9F8F5 |
| `--foreground` | 30 13% 9% | #1A1714 |
| `--card` | 40 25% 98% | #FBF9F6 |
| `--card-foreground` | 30 13% 9% | #1A1714 |
| `--primary` | 30 13% 9% | #1A1714 |
| `--primary-foreground` | 40 25% 97% | #F9F8F5 |
| `--secondary` | 38 30% 92% | #F1ECE5 |
| `--secondary-foreground` | 30 13% 9% | #1A1714 |
| `--muted` | 38 30% 93% | #F4EFE9 |
| `--muted-foreground` | 34 8% 39% | #6B645C |
| `--accent` | 24 39% 38% | #86593B |
| `--accent-foreground` | 40 45% 98% | #FCFAF7 |
| `--destructive` | 3 58% 46% | #B93831 |
| `--destructive-foreground` | 40 45% 98% | #FCFAF7 |
| `--border` | 38 24% 86% | #E8E2D8 |
| `--input` | 38 24% 86% | #E8E2D8 |
| `--ring` | 24 39% 38% | #86593B |

All pairs pass WCAG AA (foreground-on-background = 16.5:1). Only light theme is shipped (gallery aesthetic); `dark` block may stay inert.

### Fonts & Type
- **Fraunces** (display serif, headings) · **Instrument Sans** (body/UI) · **DM Mono** (editorial kickers/labels).
- Google Fonts `<link>` in `index.html`; tailwind `fontFamily: { sans, display, mono }`.
- Kicker utility: `font-mono text-xs uppercase tracking-[0.2em] text-accent` — used above every section heading.
- Type scale via tailwind extend: `display-l clamp(3rem,6vw,5.5rem)`, `display-s`, `headline-l`, `headline-s`.

### Shadows / Gradients (CSS vars)
- `--shadow-card`, `--shadow-hover`, `--shadow-pop`
- `--gradient-hero` (warm radial), `--gradient-overlay` (image → text legibility), `--gradient-card-fade`
- Radius: keep `--radius: 0.5rem` base; CTAs/product cards deliberately sharp (`rounded-none`) for gallery feel.

### Layout Rhythm
- Container max 1440px, `clamp(1rem,3vw,2rem)` padding.
- Product imagery `aspect-[4/5]`, full-bleed, hover zoom `scale-105` with `transition-transform duration-700 cubic-bezier(0.22,1,0.36,1)`.
- Product grid: `grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 xl:grid-cols-4`.
- Section rhythm: `py-[clamp(4rem,8vw,8rem)]`.

## Data Model (frontend-only)

New file `src/lib/products.ts` (+ types in `src/lib/types.ts`):

```ts
type Format = "poster" | "framed" | "canvas";
interface VariantPrice { size: string; dims: string; price: number }
interface Product {
  slug, name, artist, collection (slug), image, alt, description,
  formats: Record<Format, VariantPrice[]>,
  frameOptions?: { id, label, upcharge }[],  // shown only for format "framed"
  tags, featured?, bestseller?, rating, reviewCount,
  reviews: { author, rating, date, text }[]
}
```

- **12 artworks** across 4 collections: Abstract, Botanical, Architecture, Figurative.
- Prices: poster from $39, framed from $95, canvas from $120 (3 sizes each); frame adds upcharge (White Oak / Walnut / Matte Black / Gold).
- Helpers: `getProduct(slug)`, `getCollectionProducts(slug)`, `formatPrice(n)` (`Intl.NumberFormat` USD), `collections` array.

## Cart (React Context + localStorage)

New file `src/context/CartContext.tsx`:
- State: `items: { productSlug, format, size, frame?, qty, price }[]`, `isOpen` (drawer), persisted to `localStorage("noewe-cart")`.
- Actions: `addItem` (opens drawer), `removeItem`, `setQty`, `clear`.
- Derived: `subtotal`, `itemCount`, free-shipping progress (threshold **$75**).
- Provider wraps app in `App.tsx` inside `TooltipProvider`.

## Components (new dir `src/components/store/`)

Reuse existing shadcn primitives: `sheet`, `accordion`, `select`, `badge`, `button`, `separator`, `carousel` (embla).

1. `Header.tsx` — sticky `bg-background/85 backdrop-blur`, `grid-cols-[1fr_auto_1fr]`, centered **Noewe** wordmark (`font-display`), nav (Shop/Collections links), cart button with count badge (opens CartDrawer), mobile menu (Sheet) on small screens. Announcement bar above: "Free shipping on orders over $75".
2. `Footer.tsx` — brand statement, Shop/Help link columns, social icons (lucide), newsletter.
3. `ProductCard.tsx` — image with hover zoom + "Quick add" overlay (adds default poster variant), title (`font-display`), artist/format meta, price, star rating.
4. `RatingStars.tsx` — 5-star display + count.
5. `SectionHeading.tsx` — kicker + serif heading + supporting copy.
6. `TrustBadges.tsx` — 4 badges (Free shipping / Framed by hand / 30-day returns / Secure checkout) with lucide icons.
7. `Newsletter.tsx` — input + CTA, mock success state.
8. `CartDrawer.tsx` — shadcn `Sheet` right, `max-w-md`; free-shipping progress bar, line items with qty steppers, subtotal, checkout CTA (mock), "Complete the set" recommendations.
9. `Reveal.tsx` — framer-motion scroll reveal wrapper (`opacity 0→1`, `y:16→0`, `700ms`, stagger).

## Pages

1. `src/pages/Index.tsx` (rewrite) — hero (full-bleed interior visual, overlay headline "Art that makes a room feel like yours", CTA → collection), collection tiles (4), bestsellers carousel, interior-inspiration editorial band, testimonials, trust badges, newsletter.
2. `src/pages/Collection.tsx` — `/collections/:slug`; collection header, format filter chips + sort (Featured / Price ↑ / Price ↓ / Newest), responsive grid, empty state.
3. `src/pages/Product.tsx` — `/products/:slug`; large gallery image, title/artist/rating, format segmented control (Poster/Framed/Canvas), size pills, frame selector (when Framed), live price, quantity stepper, "Add to cart" CTA (opens drawer), Accordion (Details / Shipping & returns / Materials), reviews block, "Pairs well with" related carousel. Missing slug → NotFound.
4. `src/pages/Cart.tsx` — `/cart`; full cart with line items + order summary + free-shipping bar + checkout CTA; empty state with CTA to shop.

## Routing (`src/router.tsx`)

Add routes (before catch-all): `/collections/:slug`, `/products/:slug`, `/cart`. Home stays `/`.

## Imagery

Generate with `image_generation` (model preference to be confirmed with user at implementation start — options: seedream-5, nano-banana-2, nano-banana-pro, gpt-image-2):
- 1 hero interior (warm, gallery wall in a living room, editorial)
- 2 interior-inspiration scenes
- 12 artworks (3 per collection) — abstract, botanical, architecture, figurative
Store URLs in `src/lib/products.ts`; `<img crossOrigin="anonymous">` per platform guidance.

## i18n

Load `enter_i18n` skill during implementation. Add keys to `public/locales/en.json` and `zh-CN.json` for UI chrome (nav, CTAs, section headings, cart, footer, forms). Product/artist names and descriptions live in the catalog data (kept in English). Keep `LanguageSwitcher` in the footer.

## Files to create / modify

**Create:** `src/lib/types.ts`, `src/lib/products.ts`, `src/context/CartContext.tsx`, `src/components/store/{Header,Footer,ProductCard,RatingStars,SectionHeading,TrustBadges,Newsletter,CartDrawer,Reveal}.tsx`, `src/pages/{Collection,Product,Cart}.tsx`.
**Modify:** `src/index.css`, `tailwind.config.ts`, `index.html` (fonts, title/meta), `src/App.tsx` (CartProvider), `src/router.tsx`, `public/locales/en.json`, `public/locales/zh-CN.json`.

## Implementation checklist

- [ ] Replace `:root` tokens in `src/index.css` with Noewe warm-neutral HSL palette + shadow/gradient vars; keep `dark` block inert.
- [ ] Extend `tailwind.config.ts`: new `colors` (unchanged mapping), `fontFamily` (sans/display/mono), `boxShadow` (card/hover/pop), `backgroundImage` (gradient-hero/overlay/card-fade), type-scale utilities.
- [ ] Add Google Fonts (Fraunces, Instrument Sans, DM Mono) + updated `<title>`/meta to `index.html`.
- [ ] Create `src/lib/types.ts` (Format, VariantPrice, Product, Review, Collection) and `src/lib/products.ts` with 12 products / 4 collections + `getProduct`, `getCollectionProducts`, `collections`, `formatPrice`.
- [ ] Create `src/context/CartContext.tsx` with localStorage persistence, add/remove/setQty, drawer open state, subtotal/itemCount/free-shipping derived values.
- [ ] Wire `CartProvider` into `src/App.tsx`.
- [ ] Build `RatingStars`, `SectionHeading`, `TrustBadges`, `Newsletter`, `Reveal` components.
- [ ] Build `ProductCard` with hover zoom + Quick-add overlay + rating + price.
- [ ] Build `Header` (sticky, centered wordmark, nav, cart badge, mobile menu sheet, announcement bar) and `Footer` (with LanguageSwitcher).
- [ ] Build `CartDrawer` (Sheet, free-shipping progress, line items, qty steppers, subtotal, checkout CTA, recommendations).
- [ ] Rewrite `src/pages/Index.tsx` with all home sections (hero, collections, bestsellers, editorial, testimonials, trust, newsletter).
- [ ] Build `src/pages/Collection.tsx` with filters + sort + grid + empty state.
- [ ] Build `src/pages/Product.tsx` with gallery, format/size/frame options, live price, qty, add-to-cart, accordion info, reviews, related carousel.
- [ ] Build `src/pages/Cart.tsx` with line items, summary, free-shipping bar, empty state.
- [ ] Add routes to `src/router.tsx` (`/collections/:slug`, `/products/:slug`, `/cart`).
- [ ] Generate artwork/interior images (confirm model preference with user first) and reference them in the catalog.
- [ ] Add i18n keys to `en.json` / `zh-CN.json` via `enter_i18n` workflow; use `t()` for all static UI copy.

## Verification checklist

- [ ] `pnpm lint` and `pnpm exec tsc --noEmit` pass; `pnpm run build` succeeds.
- [ ] Positive: clicking a product card opens `/products/:slug`; selecting format/size/frame updates price; "Add to cart" opens drawer with correct item; qty + / − and remove update subtotal; cart badge count stays in sync across header, drawer, and `/cart`; cart persists after reload.
- [ ] Positive: collection filters (format chips) and sort reorder the grid correctly; unknown collection slug shows empty state (not crash).
- [ ] Boundary: free-shipping progress reaches 100% and shipping line shows "Free" at/above $75 subtotal; below $75 shows $9 shipping.
- [ ] Default: empty cart drawer/page shows empty-state CTA; invalid `/products/:slug` falls back to NotFound.
- [ ] Responsive: capture `mobile_390` and `desktop_1280` of Home, Product, and Collection routes (state this assumption); header collapses to hamburger menu, grids collapse to 2 columns, cart drawer fits mobile width, no horizontal overflow, CTA contrast legible.
- [ ] Console: no runtime errors in preview (`get_console_logs`); no 404s for image/font assets.
