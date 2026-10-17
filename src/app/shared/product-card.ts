import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CatalogService } from '../core/catalog.service';
import { Product, VersionId } from '../core/models';
import { VERSIONS } from '../data/catalog';
import { InrPipe } from './inr.pipe';
import { JerseyArt } from './jersey-art';

@Component({
  selector: 'app-product-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, JerseyArt, InrPipe],
  template: `
    <a class="card" [routerLink]="['/product', product().slug]"
       [queryParams]="version() ? { version: version() } : {}">
      <div class="media">
        @if (badge(); as b) {
          <span class="badge" [class]="'badge ' + b">{{ b === 'bestseller' ? 'Bestseller' : b === 'new' ? 'New' : 'Limited' }}</span>
        }
        <span class="off">-{{ discount() }}%</span>
        <app-jersey-art [design]="product().design" [label]="title()" />
      </div>
      <div class="body">
        <p class="meta">{{ product().kit }} · {{ product().season }}</p>
        <h3>{{ product().team }}</h3>
        <div class="versions">
          @for (v of product().versions; track v) {
            <span class="pill" [class.on]="v === version()">{{ versions[v].short }}</span>
          }
        </div>
        <div class="price">
          @if (!version() && product().versions.length > 1) { <small>From</small> }
          <strong>{{ price() | inr }}</strong>
          <s>{{ mrp() | inr }}</s>
        </div>
      </div>
    </a>
  `,
  styles: `
    .card {
      display: flex; flex-direction: column; height: 100%;
      background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius);
      overflow: hidden; color: inherit; text-decoration: none;
      transition: transform .2s ease, box-shadow .2s ease, border-color .2s;
    }
    .card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); border-color: transparent; }
    .card:hover app-jersey-art { transform: scale(1.05) rotate(-1.5deg); }
    .media {
      position: relative; padding: 24px 28px 18px;
      background: radial-gradient(circle at 50% 35%, var(--surface-2), var(--surface-3));
    }
    app-jersey-art { transition: transform .35s ease; max-width: 220px; margin: 0 auto; }
    .badge {
      position: absolute; top: 12px; left: 12px; z-index: 1; font-size: 11px; font-weight: 700;
      text-transform: uppercase; letter-spacing: .06em; padding: 4px 8px; border-radius: 6px;
      background: var(--brand); color: var(--on-brand);
    }
    .badge.new { background: var(--ink); color: var(--bg); }
    .badge.limited { background: #f59e0b; color: #111; }
    .off {
      position: absolute; top: 12px; right: 12px; z-index: 1; font-size: 12px; font-weight: 700;
      color: var(--sale);
    }
    .body { padding: 14px 16px 18px; display: flex; flex-direction: column; gap: 6px; flex: 1; }
    .meta { margin: 0; color: var(--muted); font-size: 12px; text-transform: uppercase; letter-spacing: .08em; }
    h3 { margin: 0; font-size: 16px; font-weight: 700; line-height: 1.25; }
    .versions { display: flex; gap: 6px; flex-wrap: wrap; }
    .pill { font-size: 11px; border: 1px solid var(--line); border-radius: 999px; padding: 2px 8px; color: var(--muted); }
    .pill.on { border-color: var(--ink); color: var(--ink); font-weight: 600; }
    .price { margin-top: auto; display: flex; align-items: baseline; gap: 8px; padding-top: 6px; }
    .price small { color: var(--muted); font-size: 12px; }
    .price strong { font-size: 18px; }
    .price s { color: var(--muted); font-size: 13px; }
  `,
})
export class ProductCard {
  private catalog = inject(CatalogService);
  readonly product = input.required<Product>();
  /** When set, show the price of this version instead of "From". */
  readonly version = input<VersionId | null>(null);

  readonly versions = VERSIONS;
  readonly title = computed(() => this.catalog.title(this.product()));
  private readonly shownVersion = computed(() => {
    const v = this.version();
    const p = this.product();
    if (v && p.versions.includes(v)) return v;
    return p.versions.reduce((a, b) => (this.catalog.price(p, b) < this.catalog.price(p, a) ? b : a));
  });
  readonly price = computed(() => this.catalog.price(this.product(), this.shownVersion()));
  readonly mrp = computed(() => this.catalog.mrp(this.product(), this.shownVersion()));
  readonly discount = computed(() => Math.round((1 - this.price() / this.mrp()) * 100));
  readonly badge = computed(() => this.product().tags?.[0] ?? null);
}
