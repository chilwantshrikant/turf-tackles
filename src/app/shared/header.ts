import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CartService } from '../core/cart.service';
import { CatalogService } from '../core/catalog.service';
import { VERSIONS } from '../data/catalog';

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <div class="announce">
      <div class="marquee">
        <span>Free shipping on orders above ₹1,499</span><span>Cash on Delivery available</span>
        <span>Use code TURF10 for 10% off</span><span>Name &amp; number printing on every jersey</span>
      </div>
    </div>
    <header class="bar">
      <div class="container row">
        <button class="icon only-mobile" (click)="menuOpen.set(true)" aria-label="Open menu">
          <svg viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
        </button>

        <a routerLink="/" class="logo" aria-label="Turf Tackles home">
          <svg viewBox="0 0 64 64" aria-hidden="true"><rect width="64" height="64" rx="14" fill="currentColor"/><path d="M24 12q8 7 16 0l7 2 11 9-5 11-5-3v23q-12 3-24 0V31l-5 3-5-11 11-9z" fill="#b6f22e"/></svg>
          <span class="display">Turf<b>Tackles</b></span>
        </a>

        <nav class="nav only-desktop" aria-label="Main">
          <a routerLink="/shop" routerLinkActive="on" [routerLinkActiveOptions]="{ exact: true }">Shop all</a>
          @for (v of versionList; track v.id) {
            <a routerLink="/shop" [queryParams]="{ version: v.id }">{{ v.short }} Version</a>
          }
          <a routerLink="/shop" [queryParams]="{ league: 'retro' }">Retro</a>
        </nav>

        <div class="actions">
          <form class="search" [class.open]="searchOpen()" (submit)="search($event, q.value)" role="search">
            <input #q type="search" placeholder="Search team, e.g. Barcelona" aria-label="Search jerseys" />
          </form>
          <button class="icon" (click)="toggleSearch(q)" aria-label="Search">
            <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
          </button>
          <a routerLink="/cart" class="icon cart" aria-label="Cart">
            <svg viewBox="0 0 24 24"><path d="M6 7h12l-1 13H7L6 7Z" /><path d="M9 7a3 3 0 0 1 6 0" /></svg>
            @if (cart.count()) { <span class="count">{{ cart.count() }}</span> }
          </a>
        </div>
      </div>
    </header>

    <!-- mobile drawer -->
    <div class="scrim" [class.show]="menuOpen()" (click)="menuOpen.set(false)"></div>
    <aside class="drawer" [class.show]="menuOpen()" aria-label="Menu">
      <div class="drawer-head">
        <span class="display">Menu</span>
        <button class="icon" (click)="menuOpen.set(false)" aria-label="Close menu">
          <svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18" /></svg>
        </button>
      </div>
      <a routerLink="/">Home</a>
      <a routerLink="/shop">Shop all jerseys</a>
      @for (v of versionList; track v.id) {
        <a routerLink="/shop" [queryParams]="{ version: v.id }">{{ v.name }} <small>from ₹{{ v.basePrice }}</small></a>
      }
      <a routerLink="/shop" [queryParams]="{ league: 'international' }">National teams</a>
      <a routerLink="/shop" [queryParams]="{ league: 'retro' }">Retro classics</a>
      <a routerLink="/cart">Cart ({{ cart.count() }})</a>
    </aside>

    @if (toast(); as t) {
      <div class="toast" role="status">
        <span class="tick">✓</span>
        <div>
          <strong>Added to cart</strong>
          <p>{{ t }}</p>
        </div>
        <a routerLink="/cart" class="btn btn-primary">View cart</a>
      </div>
    }
  `,
  styles: `
    :host { display: block; position: sticky; top: 0; z-index: 50; }
    .announce { background: var(--ink); color: var(--bg); font-size: 12.5px; font-weight: 500; overflow: hidden; white-space: nowrap; }
    .marquee { display: inline-flex; gap: 48px; padding: 7px 0; animation: scroll 28s linear infinite; padding-left: 100%; }
    @keyframes scroll { to { transform: translateX(-100%); } }
    .bar { background: color-mix(in srgb, var(--bg) 88%, transparent); backdrop-filter: saturate(1.6) blur(12px); border-bottom: 1px solid var(--line); }
    .row { display: flex; align-items: center; gap: 12px; height: 64px; }
    .logo { display: flex; align-items: center; gap: 8px; text-decoration: none; color: var(--ink); }
    .logo svg { width: 34px; height: 34px; }
    .logo span { font-size: 26px; }
    .logo b { font-weight: 400; color: var(--brand-strong); margin-left: 2px; }
    .nav { display: flex; gap: 4px; margin-left: 24px; }
    .nav a { text-decoration: none; font-weight: 600; font-size: 14px; padding: 8px 12px; border-radius: 8px; }
    .nav a:hover, .nav a.on { background: var(--surface-3); }
    .actions { margin-left: auto; display: flex; align-items: center; gap: 4px; }
    .icon { position: relative; display: grid; place-items: center; width: 42px; height: 42px; border-radius: 10px; border: 0; background: transparent; cursor: pointer; color: var(--ink); }
    .icon:hover { background: var(--surface-3); }
    .icon svg { width: 22px; height: 22px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
    .count { position: absolute; top: 3px; right: 2px; min-width: 18px; height: 18px; padding: 0 5px; border-radius: 9px; background: var(--brand); color: var(--on-brand); font-size: 11px; font-weight: 800; display: grid; place-items: center; }
    .search { width: 0; overflow: hidden; transition: width .25s ease; }
    .search.open { width: min(260px, 46vw); }
    .search input { width: 100%; height: 40px; border-radius: 10px; border: 1.5px solid var(--line); padding: 0 12px; background: var(--surface); outline: none; }
    .search input:focus { border-color: var(--ink); }
    .only-desktop { display: none; }
    @media (min-width: 960px) { .only-desktop { display: flex; } .only-mobile { display: none; } }
    @media (max-width: 420px) { .search.open + .icon { display: none; } .search.open ~ .cart { display: none; } .search.open { width: 58vw; } }

    .scrim { position: fixed; inset: 0; background: rgba(0,0,0,.45); opacity: 0; pointer-events: none; transition: opacity .25s; }
    .scrim.show { opacity: 1; pointer-events: auto; }
    .drawer { position: fixed; top: 0; bottom: 0; left: 0; width: min(320px, 86vw); background: var(--surface); transform: translateX(-100%); transition: transform .3s ease; display: flex; flex-direction: column; padding: 12px 8px; overflow-y: auto; }
    .drawer.show { transform: none; box-shadow: var(--shadow-lg); }
    .drawer-head { display: flex; align-items: center; justify-content: space-between; padding: 4px 8px 12px; font-size: 28px; color: var(--ink); }
    .drawer a { padding: 14px 12px; text-decoration: none; font-weight: 600; border-radius: 10px; display: flex; justify-content: space-between; align-items: center; }
    .drawer a:hover { background: var(--surface-3); }
    .drawer small { color: var(--muted); font-weight: 500; }

    .toast { position: fixed; z-index: 60; left: 16px; right: 16px; bottom: 16px; margin: 0 auto; max-width: 420px; display: flex; align-items: center; gap: 12px; padding: 12px 12px 12px 14px; border-radius: 14px; background: var(--ink); color: var(--bg); box-shadow: var(--shadow-lg); animation: up .3s ease; }
    @media (min-width: 768px) { .toast { left: auto; right: 24px; top: 120px; bottom: auto; } }
    @keyframes up { from { opacity: 0; transform: translateY(12px); } }
    .toast .tick { width: 28px; height: 28px; flex: none; border-radius: 50%; display: grid; place-items: center; background: var(--brand); color: var(--on-brand); font-weight: 800; }
    .toast div { flex: 1; min-width: 0; }
    .toast strong { font-size: 14px; }
    .toast p { margin: 0; font-size: 12.5px; opacity: .75; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .toast .btn { min-height: 38px; padding: 0 14px; font-size: 13px; }
  `,
})
export class Header {
  readonly cart = inject(CartService);
  private catalog = inject(CatalogService);
  private router = inject(Router);

  readonly versionList = Object.values(VERSIONS);
  readonly menuOpen = signal(false);
  readonly searchOpen = signal(false);
  readonly toast = signal<string | null>(null);
  private toastTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd), takeUntilDestroyed())
      .subscribe(() => {
        this.menuOpen.set(false);
        this.toast.set(null);
      });

    effect(() => {
      const added = this.cart.lastAdded();
      if (!added) return;
      const p = this.catalog.byId(added.item.productId);
      this.toast.set(p ? `${this.catalog.title(p)} · ${VERSIONS[added.item.version].short} · ${added.item.size}` : null);
      clearTimeout(this.toastTimer);
      this.toastTimer = setTimeout(() => this.toast.set(null), 3500);
    });
  }

  toggleSearch(input: HTMLInputElement) {
    if (this.searchOpen() && input.value.trim()) {
      this.search(new Event('submit'), input.value);
      return;
    }
    this.searchOpen.update((v) => !v);
    if (this.searchOpen()) setTimeout(() => input.focus(), 50);
  }

  search(event: Event, value: string) {
    event.preventDefault();
    const q = value.trim();
    this.router.navigate(['/shop'], { queryParams: q ? { q } : {} });
  }
}
