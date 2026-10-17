# Turf Tackles — Football Jersey Store

Responsive storefront for selling football jerseys in **Fan**, **Master** and **Player** versions.
Built with Angular 20 (standalone components, signals, zoneless) and hand-written SCSS. No UI library.

## Features
- **Home page**: hero, shop-by-version cards, bestsellers, leagues, a name & number promo, a version comparison table and retro classics
- **Catalogue** (`/shop`): filter by version, league and price; search; sort. The filters live in the URL so a link can be shared (`/shop?version=master&league=la-liga`)
- **Product page**: pick the version (each has its own price), size, quantity and optional **name & number printing** (+₹199) with a live back-of-shirt preview, plus a size guide and shipping info
- **Cart**: change quantities, coupon codes (`TURF10`, `WELCOME5`), and a free-shipping progress bar. The cart is saved in the browser
- **Checkout**: address form checked for Indian mobile numbers and pincodes, **online payment via Razorpay** (UPI, cards, net banking, wallets) or **Cash on Delivery** (+₹49)
- Order confirmation page, WhatsApp chat button, dark mode, and layouts that work on both phone and desktop

## Run locally
```bash
npm install
npm start          # http://localhost:4200
npm run build      # production build in dist/turf-tackles/browser
```

## Where to change things
| What | File |
| --- | --- |
| Jerseys (team, kit, season, league, colours, versions stocked, price overrides) | `src/app/data/catalog.ts` → `PRODUCTS` |
| Version names, base prices, MRP and features | `src/app/data/catalog.ts` → `VERSIONS` |
| Shipping fee, free-shipping threshold, COD fee, coupons, printing price | `src/app/data/catalog.ts` |
| Razorpay key, WhatsApp number, support email | `src/environments/environment.ts` |

Product images are drawn as colour-coded SVG jerseys (`src/app/shared/jersey-art.ts`). When you have real
product photos, add an `image` field to `Product` and render an `<img>` in `product-card.ts` and the product page.

## Payments: going live
1. Create a Razorpay account and put your Key ID in `environment.ts` (`razorpayKeyId`). While it is empty, checkout runs in **demo mode** and only pretends to take payment.
2. **Before going live, add a small backend.** It should create the Razorpay order (and pass its `order_id` into checkout), verify the payment signature, and save the order. Right now orders are stored only in the shopper's browser (`localStorage`), so you will not see them. The hook point is `collectOnlinePayment()` in `src/app/core/order.service.ts`.
