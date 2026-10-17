import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../core/cart.service';
import { CatalogService } from '../../core/catalog.service';
import { Customer, PaymentMethod } from '../../core/models';
import { OrderService, PaymentCancelled } from '../../core/order.service';
import { readJson, writeJson } from '../../core/storage';
import { COD_FEE, VERSIONS } from '../../data/catalog';
import { InrPipe } from '../../shared/inr.pipe';
import { JerseyArt } from '../../shared/jersey-art';

const CUSTOMER_KEY = 'tt.customer';

export const INDIAN_STATES = [
  'Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chandigarh',
  'Chhattisgarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Goa', 'Gujarat', 'Haryana',
  'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand', 'Karnataka', 'Kerala', 'Ladakh', 'Lakshadweep',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Puducherry',
  'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand',
  'West Bengal',
];

@Component({
  selector: 'app-checkout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink, JerseyArt, InrPipe],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss',
})
export class Checkout {
  readonly cart = inject(CartService);
  private catalog = inject(CatalogService);
  private orders = inject(OrderService);
  private router = inject(Router);

  readonly states = INDIAN_STATES;
  readonly versions = VERSIONS;
  readonly codFee = COD_FEE;
  readonly demoMode = this.orders.demoMode;

  readonly form = inject(NonNullableFormBuilder).group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    phone: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
    email: ['', [Validators.required, Validators.email]],
    address: ['', [Validators.required, Validators.minLength(8)]],
    city: ['', Validators.required],
    state: ['', Validators.required],
    pincode: ['', [Validators.required, Validators.pattern(/^[1-9]\d{5}$/)]],
  });

  readonly payment = signal<PaymentMethod>('online');
  readonly placing = signal(false);
  readonly error = signal<string | null>(null);

  readonly lines = computed(() =>
    this.cart.items().flatMap((item) => {
      const product = this.catalog.byId(item.productId);
      return product ? [{ item, product, title: this.catalog.title(product) }] : [];
    }),
  );
  readonly totals = computed(() => this.cart.totals(this.payment()));

  constructor() {
    // Prefill details from the previous order on this device.
    const saved = readJson<Partial<Customer> | null>(CUSTOMER_KEY, null);
    if (saved) this.form.patchValue(saved);
  }

  invalid(name: keyof Customer) {
    const c = this.form.controls[name];
    return c.invalid && c.touched;
  }

  async placeOrder() {
    this.error.set(null);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      document.querySelector<HTMLElement>('.ng-invalid:not(form)')?.focus();
      return;
    }
    const customer = this.form.getRawValue();
    writeJson(CUSTOMER_KEY, customer);

    this.placing.set(true);
    try {
      const order = await this.orders.placeOrder(customer, this.payment());
      this.router.navigate(['/order', order.id]);
    } catch (e) {
      this.error.set(
        e instanceof PaymentCancelled
          ? 'Payment was cancelled. Your cart is saved — you can try again.'
          : e instanceof Error
            ? e.message
            : 'Something went wrong. Please try again.',
      );
    } finally {
      this.placing.set(false);
    }
  }
}
