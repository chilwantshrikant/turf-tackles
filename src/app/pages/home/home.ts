import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CatalogService } from '../../core/catalog.service';
import { LEAGUES, VERSIONS, VERSION_ORDER } from '../../data/catalog';
import { InrPipe } from '../../shared/inr.pipe';
import { JerseyArt } from '../../shared/jersey-art';
import { ProductCard } from '../../shared/product-card';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, JerseyArt, ProductCard, InrPipe],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private catalog = inject(CatalogService);

  readonly versions = VERSION_ORDER.map((id) => VERSIONS[id]);
  readonly leagues = Object.entries(LEAGUES);
  readonly bestsellers = this.catalog.withTag('bestseller').slice(0, 8);
  readonly newArrivals = this.catalog.withTag('new').slice(0, 4);
  readonly retro = this.catalog.filter({ league: 'retro' }).slice(0, 4);

  readonly heroTrio = ['barcelona-home-25-26', 'real-madrid-home-25-26', 'argentina-home-2026'].map(
    (s) => this.catalog.bySlug(s)!,
  );
  readonly versionArt = {
    fan: this.catalog.bySlug('liverpool-home-25-26')!.design,
    master: this.catalog.bySlug('ac-milan-home-25-26')!.design,
    player: this.catalog.bySlug('manchester-city-home-25-26')!.design,
  };
  readonly customArt = this.catalog.bySlug('brazil-home-2026')!.design;

  readonly compareRows: [string, string, string, string][] = [
    ['Fabric', 'Breathable polyester', 'Premium textured', 'Lightweight match-grade'],
    ['Crest & logos', 'Embroidered', 'High-density embroidery', 'Heat-pressed'],
    ['Fit', 'Regular', 'Regular', 'Slim athletic'],
    ['Best for', 'Everyday & match days', 'Collectors & gifting', 'Playing & training'],
  ];
}
