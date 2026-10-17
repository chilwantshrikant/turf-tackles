import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../core/order.service';
import { InrPipe } from '../../shared/inr.pipe';

@Component({
  selector: 'app-order-success',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, InrPipe, DatePipe],
  template: `
    <div class="container wrap">
      @if (order(); as o) {
        <div class="hero">
          <div class="check">✓</div>
          <h1 class="display">Thank you, {{ o.customer.fullName.split(' ')[0] }}!</h1>
          <p>Your order <strong>{{ o.id }}</strong> is confirmed.
            {{ o.paymentMethod === 'cod' ? 'Please keep ' + (o.totals.total | inr) + ' ready at delivery.' : 'Payment received.' }}
            A confirmation has been sent to {{ o.customer.email }}.</p>
        </div>

        <div class="panel">
          <div class="meta">
            <div><span>Order date</span><strong>{{ o.createdAt | date: 'd MMM y, h:mm a' }}</strong></div>
            <div><span>Payment</span><strong>{{ o.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Paid online' }}</strong></div>
            <div><span>Estimated delivery</span><strong>{{ eta() | date: 'EEE, d MMM' }}</strong></div>
          </div>

          <ul class="lines">
            @for (l of o.lines; track $index) {
              <li>
                <div>
                  <p>{{ l.title }} × {{ l.qty }}</p>
                  <small>{{ l.version }} · Size {{ l.size }}@if (l.custom) { · Print: {{ l.custom.name }} {{ l.custom.number }} }</small>
                </div>
                <strong>{{ l.lineTotal | inr }}</strong>
              </li>
            }
          </ul>

          <dl>
            <div><dt>Subtotal</dt><dd>{{ o.totals.subtotal | inr }}</dd></div>
            @if (o.totals.discount) { <div><dt>Discount</dt><dd>−{{ o.totals.discount | inr }}</dd></div> }
            <div><dt>Shipping</dt><dd>{{ o.totals.shipping ? (o.totals.shipping | inr) : 'FREE' }}</dd></div>
            @if (o.totals.codFee) { <div><dt>COD fee</dt><dd>{{ o.totals.codFee | inr }}</dd></div> }
            <div class="total"><dt>Total</dt><dd>{{ o.totals.total | inr }}</dd></div>
          </dl>

          <div class="addr">
            <span>Shipping to</span>
            <p>{{ o.customer.fullName }}, {{ o.customer.address }}, {{ o.customer.city }}, {{ o.customer.state }} – {{ o.customer.pincode }} · {{ o.customer.phone }}</p>
          </div>
        </div>
        <a routerLink="/shop" class="btn btn-primary">Continue shopping</a>
      } @else {
        <h1 class="display">Order not found</h1>
        <p>We couldn't find that order on this device.</p>
        <a routerLink="/shop" class="btn btn-primary">Shop jerseys</a>
      }
    </div>
  `,
  styles: `
    .wrap { max-width: 720px; padding-top: 32px; }
    .hero { text-align: center; margin-bottom: 24px; }
    .check { width: 72px; height: 72px; margin: 0 auto 12px; border-radius: 50%; display: grid; place-items: center; font-size: 36px; font-weight: 800; background: var(--brand); color: var(--on-brand); animation: pop .5s cubic-bezier(.2,1.6,.4,1); }
    @keyframes pop { from { transform: scale(.3); opacity: 0; } }
    h1 { font-size: clamp(40px, 8vw, 60px); margin: 0 0 8px; }
    .meta { display: grid; gap: 12px; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); padding-bottom: 16px; border-bottom: 1px solid var(--line); }
    .meta span, .addr span { display: block; font-size: 12px; color: var(--muted); text-transform: uppercase; letter-spacing: .08em; }
    .lines { list-style: none; padding: 0; margin: 16px 0; display: grid; gap: 12px; }
    .lines li { display: flex; justify-content: space-between; gap: 12px; }
    .lines p { margin: 0; font-weight: 600; }
    .lines small { color: var(--muted); }
    dl { margin: 0; padding-top: 12px; border-top: 1px solid var(--line); }
    dl div { display: flex; justify-content: space-between; padding: 4px 0; font-size: 14px; }
    dt { color: var(--muted); } dd { margin: 0; font-weight: 600; }
    .total { font-size: 18px; } .total dt, .total dd { color: var(--ink); font-weight: 800; }
    .addr { margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--line); }
    .addr p { margin: 4px 0 0; }
    .btn { margin-top: 20px; }
  `,
})
export class OrderSuccess {
  private orders = inject(OrderService);
  readonly id = input.required<string>();
  readonly order = computed(() => this.orders.find(this.id()));
  readonly eta = computed(() => {
    const d = new Date(this.order()?.createdAt ?? Date.now());
    d.setDate(d.getDate() + 5);
    return d;
  });
}
