import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <footer>
      <div class="container cols">
        <div class="brand">
          <span class="display">Turf<b>Tackles</b></span>
          <p>Club and country jerseys in Fan, Master &amp; Player versions — printed with your name, delivered across India.</p>
        </div>
        <div>
          <h4>Shop</h4>
          <a routerLink="/shop" [queryParams]="{ version: 'fan' }">Fan Version</a>
          <a routerLink="/shop" [queryParams]="{ version: 'master' }">Master Version</a>
          <a routerLink="/shop" [queryParams]="{ version: 'player' }">Player Version</a>
          <a routerLink="/shop" [queryParams]="{ league: 'retro' }">Retro</a>
        </div>
        <div>
          <h4>Help</h4>
          <a routerLink="/info/shipping">Shipping &amp; delivery</a>
          <a routerLink="/info/returns">Returns &amp; exchange</a>
          <a routerLink="/info/size-guide">Size guide</a>
          <a [href]="'mailto:' + email">{{ email }}</a>
        </div>
        <div>
          <h4>We accept</h4>
          <div class="pay">
            <span>UPI</span><span>Visa</span><span>Mastercard</span><span>RuPay</span><span>Net Banking</span><span>COD</span>
          </div>
        </div>
      </div>
      <div class="container legal">© {{ year }} Turf Tackles. All rights reserved.</div>
    </footer>
  `,
  styles: `
    footer { background: var(--pitch); color: #d6e5df; margin-top: 48px; padding: 48px 0 24px; }
    .cols { display: grid; gap: 32px; grid-template-columns: 1fr 1fr; }
    @media (min-width: 900px) { .cols { grid-template-columns: 2fr 1fr 1fr 1.3fr; } }
    .brand { grid-column: 1 / -1; }
    @media (min-width: 900px) { .brand { grid-column: auto; } }
    .brand span { font-size: 34px; color: #fff; }
    .brand b { font-weight: 400; color: var(--brand); }
    .brand p { max-width: 340px; opacity: .8; }
    h4 { color: #fff; margin: 0 0 12px; font-size: 14px; text-transform: uppercase; letter-spacing: .1em; }
    a { display: block; padding: 4px 0; text-decoration: none; opacity: .85; overflow-wrap: anywhere; }
    a:hover { opacity: 1; color: var(--brand); }
    .pay { display: flex; flex-wrap: wrap; gap: 6px; }
    .pay span { font-size: 12px; font-weight: 600; padding: 5px 9px; border-radius: 6px; background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.12); }
    .legal { margin-top: 36px; padding-top: 18px; border-top: 1px solid rgba(255,255,255,.12); font-size: 13px; opacity: .7; }
  `,
})
export class Footer {
  readonly email = environment.supportEmail;
  readonly year = new Date().getFullYear();
}
