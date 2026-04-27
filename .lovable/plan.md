# Shein-Style Storefront — v1 Plan

A modern, fashion-forward shopper storefront with seeded demo products, a slide-out cart, multi-step UI-only checkout, and an account dashboard. Built mobile-first with bold imagery, smooth motion, and dark/light themes.

## What we're building (v1 scope)

**In scope:** Home, category/listing pages, product detail, search + filters, cart drawer, multi-step checkout (UI only), account dashboard (orders/wishlist/addresses), wishlist, theme toggle.

**Deferred to later phases:** AI recommendations, multi-vendor seller dashboards, real payments, gamification, AR try-on, voice search, PWA, live chat, analytics integrations.

## Visual direction (Shein-like)

- Bold, fashion-forward, high-density imagery
- Hot pink/magenta accent on near-black & off-white surfaces
- Tight grid layouts, oversized product photos, trendy sans-serif type
- Lots of motion: hover image swaps, scale-ins, marquee deal banners, countdown timers
- Dark mode + light mode, mobile-first

## Pages & routes

```text
/                       Home — hero carousel, flash deals, trending categories,
                         "inspired by your activity" rail, infinite product feed
/category/$slug         Category listing with filters (price, size, color, rating)
/search                 Search results (typeahead from navbar, same filter UI)
/product/$id            Product detail — gallery, variants, reviews, related
/wishlist               Saved items
/cart                   Full cart page (drawer also available everywhere)
/checkout               Multi-step: address → shipping → payment → review
/checkout/success       Order confirmation
/account                Dashboard shell (panels for orders, addresses, etc.)
/account/orders         Order history + tracking UI
/account/addresses      Saved addresses
/account/payment        Saved payment methods (UI only)
/account/notifications  Notification center
/login, /signup         Auth (email + password via Lovable Cloud)
```

## Global UI

- **Sticky top navbar:** logo, mega search with autocomplete, categories mega-menu (with category images), wishlist, account dropdown, cart icon with badge
- **Secondary strip:** Deals · New · Trending · Best Sellers
- **Cart drawer:** slides in from right, real-time totals, qty controls, save-for-later, coupon input, shipping preview
- **Footer:** links, language/currency switchers (UI), socials
- **Theme toggle** in navbar; respects system preference
- **Breadcrumbs** on category/product pages

## Product system

**Card:** primary image with hover-swap to second image, wishlist heart, quick-add button, discount badge, rating stars, low-stock pill.

**Detail page:** zoomable gallery with thumbnails, variant selector (color swatches, size chips), live price by variant, sticky add-to-cart on mobile, reviews with photo thumbnails, "Frequently bought together" rail, "Customers also viewed" rail, shipping ETA estimator (zip input), seller info card, Q&A accordion.

## Cart & Checkout (UI only)

Multi-step checkout with progress indicator. Saves order to database with status `pending_payment`. No real payment processing — payment step is a styled form that simulates success. Easy to swap in real Stripe later.

## Account dashboard

Sidebar + main panel layout. Sub-routes render in main panel without full reloads. Quick-glance cards: recent orders, wishlist count, recently viewed.

## Search & filters

- Navbar typeahead with category-grouped suggestions and recent searches
- Listing pages: sidebar (desktop) / bottom-sheet (mobile) with price slider, rating, brand, color, size, shipping options
- Sort dropdown: relevance, newest, price ↑/↓, best rated
- Filter state lives in URL search params (shareable links, back-button works)

## Data model (Lovable Cloud)

```text
profiles            user profile linked to auth.users
categories          slug, name, image, parent_id
products            title, description, price, compare_at_price, brand, category_id,
                    images[], rating_avg, rating_count, stock, badges[]
product_variants    product_id, color, size, sku, price_override, stock
reviews             product_id, user_id, rating, title, body, images[], created_at
wishlist_items      user_id, product_id
cart_items          user_id (or session_id), product_id, variant_id, qty
addresses           user_id, name, line1, line2, city, region, postal, country, phone
orders              user_id, status, subtotal, shipping, tax, total, address snapshot
order_items         order_id, product snapshot, variant, qty, price
```

RLS: users read/write only their own cart, wishlist, addresses, orders. Products, categories, reviews are public read.

## Seeded demo catalog

~80 products across Women, Men, Kids, Home, Beauty, Accessories. Each with multiple images (using Unsplash/picsum-style placeholders), variants, realistic prices, ratings, and a handful of seeded reviews. Provides a "live" feel from the first load.

## Performance & UX

- Lazy-loaded images, skeleton loaders for all data fetches
- Route-level code splitting (TanStack default)
- Optimistic UI for cart add/remove and wishlist toggle
- Smooth page transitions and micro-interactions throughout
- Fully responsive, mobile-first

## Tech notes

- TanStack Start (file-based routes) + Tailwind v4 + shadcn/ui
- Lovable Cloud for auth, database, RLS
- Auth: email + password (Google can be added later)
- Theme via class strategy on `<html>`, persisted to localStorage
- Filter & search state in URL search params using zod adapter
- Animations via Tailwind utilities + small framer-motion usage where it pays off

## Out of scope for v1 (queued for later phases)

AI recommendations · seller onboarding/dashboards · real Stripe payments · gamification/rewards · live chat · push notifications · AR try-on · voice search · PWA install · A/B testing · heatmaps · multi-currency conversion (UI switcher only, single currency for prices).

After v1 ships and you've used it, we pick the next phase (most likely: AI recommendations, then real payments, then multi-vendor).
