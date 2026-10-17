import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `
    <div class="container wrap">
      <p class="display big">404</p>
      <h1>Off target!</h1>
      <p>We couldn't find that page.</p>
      <a routerLink="/shop" class="btn btn-primary">Shop jerseys</a>
    </div>
  `,
  styles: `
    .wrap { text-align: center; padding: 80px 16px; }
    .big { font-size: 140px; margin: 0; color: var(--brand-strong); }
    h1 { margin: 0 0 8px; }
  `,
})
export class NotFound {}
