import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { VERSIONS } from '../data/catalog';
import { CartService } from './cart.service';
import { CatalogService } from './catalog.service';
import { Customer, Order, PaymentMethod } from './models';
import { readJson, writeJson } from './storage';

const ORDERS_KEY = 'tt.orders';
const RAZORPAY_SRC = 'https://checkout.razorpay.com/v1/checkout.js';

interface RazorpayResponse {
  razorpay_payment_id: string;
}

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open(): void };
  }
}

export class PaymentCancelled extends Error {}

@Injectable({ providedIn: 'root' })
export class OrderService {
  private cart = inject(CartService);
  private catalog = inject(CatalogService);

  readonly demoMode = !environment.razorpayKeyId;

  orders(): Order[] {
    return readJson<Order[]>(ORDERS_KEY, []);
  }

  find(id: string): Order | undefined {
    return this.orders().find((o) => o.id === id);
  }

  /**
   * Takes payment (or confirms COD), saves the order and empties the cart.
   * Rejects with PaymentCancelled if the shopper closes the payment window.
   */
  async placeOrder(customer: Customer, method: PaymentMethod): Promise<Order> {
    const totals = this.cart.totals(method);
    const id = 'TT' + Date.now().toString(36).toUpperCase();

    let paymentId: string | undefined;
    if (method === 'online') {
      paymentId = await this.collectOnlinePayment(id, totals.total, customer);
    }

    const order: Order = {
      id,
      createdAt: new Date().toISOString(),
      lines: this.cart.items().map((i) => {
        const p = this.catalog.byId(i.productId);
        return {
          title: p ? this.catalog.title(p) : 'Jersey',
          version: VERSIONS[i.version].name,
          size: i.size,
          qty: i.qty,
          lineTotal: i.unitPrice * i.qty,
          custom: i.custom,
        };
      }),
      totals,
      customer,
      paymentMethod: method,
      paymentId,
      status: method === 'online' ? 'paid' : 'cod-confirmed',
    };

    writeJson(ORDERS_KEY, [order, ...this.orders()]);
    this.cart.clear();
    return order;
  }

  private async collectOnlinePayment(
    orderRef: string,
    amount: number,
    customer: Customer,
  ): Promise<string> {
    if (this.demoMode) {
      await new Promise((r) => setTimeout(r, 1200));
      return 'demo_' + Math.random().toString(36).slice(2, 12);
    }

    await this.loadRazorpay();
    return new Promise<string>((resolve, reject) => {
      // NOTE: for production, create the Razorpay order on your server and pass
      // `order_id` here, then verify the payment signature server-side.
      const rzp = new window.Razorpay!({
        key: environment.razorpayKeyId,
        amount: amount * 100,
        currency: 'INR',
        name: environment.storeName,
        description: `Order ${orderRef}`,
        notes: { orderRef },
        prefill: { name: customer.fullName, email: customer.email, contact: customer.phone },
        theme: { color: '#0f172a' },
        handler: (res: RazorpayResponse) => resolve(res.razorpay_payment_id),
        modal: { ondismiss: () => reject(new PaymentCancelled('Payment cancelled')) },
      });
      rzp.open();
    });
  }

  private loadRazorpay(): Promise<void> {
    if (window.Razorpay) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = RAZORPAY_SRC;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error('Could not load payment gateway. Check your connection.'));
      document.body.appendChild(s);
    });
  }
}
