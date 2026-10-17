import { Injectable } from '@angular/core';
import { PRODUCTS, VERSIONS, VERSION_ORDER } from '../data/catalog';
import { League, Product, VersionId } from './models';

export type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'name';

export interface CatalogFilter {
  version?: VersionId | null;
  league?: League | null;
  query?: string;
  maxPrice?: number | null;
  sort?: SortKey;
}

@Injectable({ providedIn: 'root' })
export class CatalogService {
  readonly products = PRODUCTS;

  bySlug(slug: string): Product | undefined {
    return this.products.find((p) => p.slug === slug);
  }

  byId(id: string): Product | undefined {
    return this.products.find((p) => p.id === id);
  }

  title(p: Product): string {
    return `${p.team} ${p.kit} Jersey ${p.season}`;
  }

  price(p: Product, version: VersionId): number {
    return p.prices?.[version] ?? VERSIONS[version].basePrice;
  }

  mrp(p: Product, version: VersionId): number {
    // Keep the same discount ratio when a product overrides the base price.
    const v = VERSIONS[version];
    return Math.round((this.price(p, version) * v.mrp) / v.basePrice / 10) * 10 - 1;
  }

  /** Lowest price across the versions a product is stocked in. */
  fromPrice(p: Product): number {
    return Math.min(...p.versions.map((v) => this.price(p, v)));
  }

  defaultVersion(p: Product): VersionId {
    return VERSION_ORDER.find((v) => p.versions.includes(v))!;
  }

  filter(f: CatalogFilter): Product[] {
    const q = f.query?.trim().toLowerCase();
    const priceFor = (p: Product) => (f.version ? this.price(p, f.version) : this.fromPrice(p));

    let list = this.products.filter((p) => {
      if (f.version && !p.versions.includes(f.version)) return false;
      if (f.league && p.league !== f.league) return false;
      if (f.maxPrice && priceFor(p) > f.maxPrice) return false;
      if (q) {
        const hay = `${p.team} ${p.kit} ${p.season} ${p.league}`.toLowerCase();
        if (!q.split(/\s+/).every((word) => hay.includes(word))) return false;
      }
      return true;
    });

    switch (f.sort) {
      case 'price-asc':
        list = [...list].sort((a, b) => priceFor(a) - priceFor(b));
        break;
      case 'price-desc':
        list = [...list].sort((a, b) => priceFor(b) - priceFor(a));
        break;
      case 'name':
        list = [...list].sort((a, b) => a.team.localeCompare(b.team));
        break;
    }
    return list;
  }

  withTag(tag: 'new' | 'bestseller' | 'limited'): Product[] {
    return this.products.filter((p) => p.tags?.includes(tag));
  }

  related(p: Product, count = 4): Product[] {
    const sameLeague = this.products.filter((o) => o.id !== p.id && o.league === p.league);
    const others = this.products.filter((o) => o.id !== p.id && o.league !== p.league);
    return [...sameLeague, ...others].slice(0, count);
  }
}
