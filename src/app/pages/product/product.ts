import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  linkedSignal,
  signal,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../core/cart.service';
import { CatalogService } from '../../core/catalog.service';
import { Size, VersionId } from '../../core/models';
import {
  CUSTOMISATION_PRICE,
  FREE_SHIPPING_ABOVE,
  LEAGUES,
  VERSIONS,
  VERSION_ORDER,
} from '../../data/catalog';
import { InrPipe } from '../../shared/inr.pipe';
import { JerseyArt } from '../../shared/jersey-art';
import { ProductCard } from '../../shared/product-card';
import { SIZE_CHART } from '../info/info';

@Component({
  selector: 'app-product',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, JerseyArt, ProductCard, InrPipe],
  templateUrl: './product.html',
  styleUrl: './product.scss',
})
export class ProductPage {
  private catalog = inject(CatalogService);
  private cart = inject(CartService);
  private router = inject(Router);
  private titleService = inject(Title);

  /** Route param and query param, bound by the router. */
  readonly slug = input.required<string>();
  readonly versionParam = input<string | undefined>(undefined, { alias: 'version' });

  readonly sizes: Size[] = ['S', 'M', 'L', 'XL', 'XXL'];
  readonly sizeChart = SIZE_CHART;
  readonly customPrice = CUSTOMISATION_PRICE;
  readonly freeShippingAbove = FREE_SHIPPING_ABOVE;
  readonly leagues = LEAGUES;
  readonly versionInfo = VERSIONS;

  readonly product = computed(() => this.catalog.bySlug(this.slug()));
  readonly title = computed(() => (this.product() ? this.catalog.title(this.product()!) : ''));
  readonly related = computed(() => (this.product() ? this.catalog.related(this.product()!) : []));
  readonly versions = computed(() =>
    VERSION_ORDER.filter((v) => this.product()?.versions.includes(v)).map((v) => VERSIONS[v]),
  );

  readonly version = linkedSignal<VersionId>(() => {
    const p = this.product();
    const wanted = this.versionParam() as VersionId | undefined;
    if (!p) return 'fan';
    return wanted && p.versions.includes(wanted) ? wanted : this.catalog.defaultVersion(p);
  });
  readonly size = linkedSignal<Size | null>(() => (this.product(), null));
  readonly view = linkedSignal<'front' | 'back'>(() => (this.product(), 'front'));
  readonly qty = linkedSignal(() => (this.product(), 1));
  readonly customise = signal(false);
  readonly customName = signal('');
  readonly customNumber = signal('');
  readonly sizeError = signal(false);
  readonly customError = signal(false);
  readonly openPanel = signal<'details' | 'size' | 'shipping' | null>('details');

  readonly unitPrice = computed(() => {
    const p = this.product();
    if (!p) return 0;
    return this.catalog.price(p, this.version()) + (this.customise() ? CUSTOMISATION_PRICE : 0);
  });
  readonly mrp = computed(() => {
    const p = this.product();
    return p ? this.catalog.mrp(p, this.version()) + (this.customise() ? CUSTOMISATION_PRICE : 0) : 0;
  });
  readonly discount = computed(() => Math.round((1 - this.unitPrice() / this.mrp()) * 100));

  constructor() {
    effect(() => {
      if (this.title()) this.titleService.setTitle(`${this.title()} | Turf Tackles`);
    });
  }

  priceOf(v: VersionId) {
    return this.catalog.price(this.product()!, v);
  }

  toggleCustomise(on: boolean) {
    this.customise.set(on);
    if (on) this.view.set('back');
  }

  onName(value: string) {
    this.customName.set(value.toUpperCase().replace(/[^A-Z .'-]/g, '').slice(0, 12));
    this.customError.set(false);
    this.view.set('back');
  }

  onNumber(value: string) {
    this.customNumber.set(value.replace(/\D/g, '').slice(0, 2));
    this.customError.set(false);
    this.view.set('back');
  }

  pickSize(s: Size) {
    this.size.set(s);
    this.sizeError.set(false);
  }

  addToCart(buyNow = false) {
    const p = this.product();
    const size = this.size();
    if (!p) return;
    if (!size) {
      this.sizeError.set(true);
      document.getElementById('sizes')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    const hasPrint = !!(this.customName().trim() || this.customNumber());
    if (this.customise() && !hasPrint) {
      this.customError.set(true);
      return;
    }
    const custom = this.customise()
      ? { name: this.customName().trim(), number: this.customNumber() }
      : undefined;
    this.cart.add(p, this.version(), size, this.qty(), custom);
    if (buyNow) this.router.navigate(['/checkout']);
  }

  scrollTo(id: string) {
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'center' }));
  }

  toggle(panel: 'details' | 'size' | 'shipping') {
    this.openPanel.set(this.openPanel() === panel ? null : panel);
  }
}
