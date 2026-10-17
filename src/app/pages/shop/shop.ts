import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CatalogService, SortKey } from '../../core/catalog.service';
import { League, VersionId } from '../../core/models';
import { LEAGUES, VERSIONS, VERSION_ORDER } from '../../data/catalog';
import { InrPipe } from '../../shared/inr.pipe';
import { ProductCard } from '../../shared/product-card';

@Component({
  selector: 'app-shop',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProductCard, InrPipe],
  templateUrl: './shop.html',
  styleUrl: './shop.scss',
})
export class Shop {
  private catalog = inject(CatalogService);
  private router = inject(Router);
  private location = inject(Location);

  readonly versions = VERSION_ORDER.map((id) => VERSIONS[id]);
  readonly leagues = Object.entries(LEAGUES) as [League, string][];
  readonly versionMap = VERSIONS;
  readonly leagueMap = LEAGUES;
  readonly priceSteps = [999, 1299, 1499];
  readonly sorts: { key: SortKey; label: string }[] = [
    { key: 'featured', label: 'Featured' },
    { key: 'price-asc', label: 'Price: low to high' },
    { key: 'price-desc', label: 'Price: high to low' },
    { key: 'name', label: 'Team name A–Z' },
  ];

  readonly version = signal<VersionId | null>(null);
  readonly league = signal<League | null>(null);
  readonly query = signal('');
  readonly maxPrice = signal<number | null>(null);
  readonly sort = signal<SortKey>('featured');
  readonly filtersOpen = signal(false);

  readonly results = computed(() =>
    this.catalog.filter({
      version: this.version(),
      league: this.league(),
      query: this.query(),
      maxPrice: this.maxPrice(),
      sort: this.sort(),
    }),
  );

  readonly heading = computed(() => {
    if (this.query()) return `Results for “${this.query()}”`;
    const parts = [
      this.league() ? LEAGUES[this.league()!] : '',
      this.version() ? VERSIONS[this.version()!].name : '',
    ].filter(Boolean);
    return parts.length ? parts.join(' · ') : 'All jerseys';
  });

  readonly activeCount = computed(
    () => [this.version(), this.league(), this.maxPrice(), this.query()].filter(Boolean).length,
  );

  constructor() {
    // Links elsewhere (header, home) navigate here with query params — mirror them into state.
    inject(ActivatedRoute)
      .queryParamMap.pipe(takeUntilDestroyed())
      .subscribe((q) => {
        const v = q.get('version') as VersionId | null;
        const l = q.get('league') as League | null;
        const sort = q.get('sort') as SortKey | null;
        const max = Number(q.get('max'));
        this.version.set(v && v in VERSIONS ? v : null);
        this.league.set(l && l in LEAGUES ? l : null);
        this.query.set(q.get('q') ?? '');
        this.maxPrice.set(max > 0 ? max : null);
        this.sort.set(sort && this.sorts.some((s) => s.key === sort) ? sort : 'featured');
      });
  }

  setVersion(v: VersionId | null) {
    this.version.set(this.version() === v ? null : v);
    this.syncUrl();
  }

  setLeague(l: League | null) {
    this.league.set(this.league() === l ? null : l);
    this.syncUrl();
  }

  setMaxPrice(p: number | null) {
    this.maxPrice.set(this.maxPrice() === p ? null : p);
    this.syncUrl();
  }

  setSort(s: string) {
    this.sort.set(s as SortKey);
    this.syncUrl();
  }

  clearQuery() {
    this.query.set('');
    this.syncUrl();
  }

  clearAll() {
    this.version.set(null);
    this.league.set(null);
    this.maxPrice.set(null);
    this.query.set('');
    this.syncUrl();
  }

  /** Update the address bar without a router navigation (keeps scroll position). */
  private syncUrl() {
    const queryParams: Record<string, string> = {};
    if (this.version()) queryParams['version'] = this.version()!;
    if (this.league()) queryParams['league'] = this.league()!;
    if (this.query()) queryParams['q'] = this.query();
    if (this.maxPrice()) queryParams['max'] = String(this.maxPrice());
    if (this.sort() !== 'featured') queryParams['sort'] = this.sort();
    const url = this.router.createUrlTree(['/shop'], { queryParams }).toString();
    this.location.replaceState(url);
  }
}
