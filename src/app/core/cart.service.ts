import { Injectable, computed, effect, inject, signal } from '@angular/core';
import {
  COD_FEE,
  COUPONS,
  CUSTOMISATION_PRICE,
  FREE_SHIPPING_ABOVE,
  SHIPPING_FEE,
} from '../data/catalog';
import { CatalogService } from './catalog.service';
import { CartItem, Customisation, PaymentMethod, Product, Size, Totals, VersionId } from './models';
import { readJson, writeJson } from './storage';

const CART_KEY = 'tt.cart';
const COUPON_KEY = 'tt.coupon';

@Injectable({ providedIn: 'root' })
export class CartService {
  private catalog = inject(CatalogService);

  readonly items = signal<CartItem[]>(readJson<CartItem[]>(CART_KEY, []));
  readonly coupon = signal<string | null>(readJson<string | null>(COUPON_KEY, null));
  /** Last added item, used by the header toast. */
  readonly lastAdded = signal<{ item: CartItem; at: number } | null>(null);

  readonly count = computed(() => this.items().reduce((n, i) => n + i.qty, 0));
  readonly subtotal = computed(() => this.items().reduce((s, i) => s + i.unitPrice * i.qty, 0));

  constructor() {
    effect(() => writeJson(CART_KEY, this.items()));
    effect(() => writeJson(COUPON_KEY, this.coupon()));
  }

  add(product: Product, version: VersionId, size: Size, qty: number, custom?: Customisation) {
    const unitPrice =
      this.catalog.price(product, version) + (custom ? CUSTOMISATION_PRICE : 0);
    const key = [product.id, version, size, custom?.name ?? '', custom?.number ?? ''].join('|');

    let added!: CartItem;
    this.items.update((items) => {
      const existing = items.find((i) => i.key === key);
      if (existing) {
        added = { ...existing, qty: Math.min(existing.qty + qty, 10) };
        return items.map((i) => (i.key === key ? added : i));
      }
      added = { key, productId: product.id, version, size, qty, unitPrice, custom };
      return [...items, added];
    });
    this.lastAdded.set({ item: added, at: Date.now() });
  }

  setQty(key: string, qty: number) {
    if (qty < 1) return this.remove(key);
    this.items.update((items) =>
      items.map((i) => (i.key === key ? { ...i, qty: Math.min(qty, 10) } : i)),
    );
  }

  remove(key: string) {
    this.items.update((items) => items.filter((i) => i.key !== key));
  }

  clear() {
    this.items.set([]);
    this.coupon.set(null);
  }

  applyCoupon(code: string): boolean {
    const normalised = code.trim().toUpperCase();
    if (!(normalised in COUPONS)) return false;
    this.coupon.set(normalised);
    return true;
  }

  totals(payment: PaymentMethod = 'online'): Totals {
    const subtotal = this.subtotal();
    const rate = this.coupon() ? (COUPONS[this.coupon()!] ?? 0) : 0;
    const discount = Math.round(subtotal * rate);
    const afterDiscount = subtotal - discount;
    const shipping = subtotal === 0 || afterDiscount >= FREE_SHIPPING_ABOVE ? 0 : SHIPPING_FEE;
    const codFee = payment === 'cod' && subtotal > 0 ? COD_FEE : 0;
    return { subtotal, discount, shipping, codFee, total: afterDiscount + shipping + codFee };
  }
}
