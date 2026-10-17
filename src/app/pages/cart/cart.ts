import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/cart.service';
import { CatalogService } from '../../core/catalog.service';
import { FREE_SHIPPING_ABOVE, VERSIONS } from '../../data/catalog';
import { InrPipe } from '../../shared/inr.pipe';
import { JerseyArt } from '../../shared/jersey-art';

@Component({
  selector: 'app-cart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, JerseyArt, InrPipe],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class Cart {
  readonly cart = inject(CartService);
  private catalog = inject(CatalogService);

  readonly versions = VERSIONS;
  readonly couponInput = signal('');
  readonly couponError = signal(false);

  readonly lines = computed(() =>
    this.cart.items().flatMap((item) => {
      const product = this.catalog.byId(item.productId);
      return product ? [{ item, product, title: this.catalog.title(product) }] : [];
    }),
  );
  readonly totals = computed(() => this.cart.totals());
  readonly toFreeShipping = computed(() =>
    Math.max(0, FREE_SHIPPING_ABOVE - (this.totals().subtotal - this.totals().discount)),
  );
  readonly shippingProgress = computed(() =>
    Math.min(100, ((this.totals().subtotal - this.totals().discount) / FREE_SHIPPING_ABOVE) * 100),
  );

  applyCoupon() {
    const ok = this.cart.applyCoupon(this.couponInput());
    this.couponError.set(!ok);
    if (ok) this.couponInput.set('');
  }
}
