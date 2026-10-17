import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';

/** [size, chest inches, length inches] */
export const SIZE_CHART: [string, string, string][] = [
  ['S', '36–38', '27'],
  ['M', '38–40', '28'],
  ['L', '40–42', '29'],
  ['XL', '42–44', '30'],
  ['XXL', '44–46', '31'],
];

const PAGES: Record<string, { title: string; paragraphs: string[] }> = {
  shipping: {
    title: 'Shipping & delivery',
    paragraphs: [
      'We ship across India. Orders are dispatched within 24–48 hours and usually arrive in 3–6 working days.',
      'Shipping is free on orders above ₹1,499. Below that a flat ₹79 delivery fee applies.',
      'Cash on Delivery is available on all pin codes we serve, with a ₹49 handling fee.',
      'You will receive tracking details by SMS and email as soon as your order ships.',
    ],
  },
  returns: {
    title: 'Returns & exchange',
    paragraphs: [
      'Wrong size? Exchange unworn jerseys with tags intact within 7 days of delivery.',
      'Jerseys with name & number customisation are made for you and cannot be exchanged or returned.',
      `To start an exchange, write to ${environment.supportEmail} or message us on WhatsApp with your order ID.`,
      'If you receive a damaged or incorrect item, we will replace it free of charge.',
    ],
  },
  'size-guide': {
    title: 'Size guide',
    paragraphs: [
      'Measure around the fullest part of your chest and compare with the chart below.',
      'Fan and Master versions are a regular fit. Player versions are slim fit — we recommend going one size up for a relaxed look.',
    ],
  },
};

@Component({
  selector: 'app-info',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <div class="container wrap">
      @if (content(); as c) {
        <h1 class="display">{{ c.title }}</h1>
        @for (p of c.paragraphs; track $index) { <p>{{ p }}</p> }
        @if (page() === 'size-guide') {
          <table>
            <thead><tr><th>Size</th><th>Chest (in)</th><th>Length (in)</th></tr></thead>
            <tbody>
              @for (r of chart; track r[0]) { <tr><td>{{ r[0] }}</td><td>{{ r[1] }}</td><td>{{ r[2] }}</td></tr> }
            </tbody>
          </table>
        }
      } @else {
        <h1 class="display">Page not found</h1>
      }
      <a routerLink="/shop" class="btn btn-primary">Continue shopping</a>
    </div>
  `,
  styles: `
    .wrap { max-width: 760px; padding-top: 40px; }
    h1 { font-size: clamp(44px, 8vw, 64px); margin: 0 0 16px; }
    p { font-size: 16px; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0 28px; background: var(--surface); border-radius: 12px; overflow: hidden; }
    th, td { padding: 12px 14px; border-bottom: 1px solid var(--line); text-align: left; }
    th { font-size: 12px; text-transform: uppercase; color: var(--muted); }
    .btn { margin-top: 12px; }
  `,
})
export class Info {
  readonly page = input.required<string>();
  readonly chart = SIZE_CHART;
  readonly content = computed(() => PAGES[this.page()]);

  constructor() {
    const title = inject(Title);
    effect(() => title.setTitle(`${this.content()?.title ?? 'Info'} | Turf Tackles`));
  }
}
