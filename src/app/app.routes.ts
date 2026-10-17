import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home').then((m) => m.Home), title: 'Turf Tackles — Football Jerseys' },
  { path: 'shop', loadComponent: () => import('./pages/shop/shop').then((m) => m.Shop), title: 'Shop Jerseys | Turf Tackles' },
  { path: 'product/:slug', loadComponent: () => import('./pages/product/product').then((m) => m.ProductPage) },
  { path: 'cart', loadComponent: () => import('./pages/cart/cart').then((m) => m.Cart), title: 'Your Cart | Turf Tackles' },
  { path: 'checkout', loadComponent: () => import('./pages/checkout/checkout').then((m) => m.Checkout), title: 'Checkout | Turf Tackles' },
  { path: 'order/:id', loadComponent: () => import('./pages/order-success/order-success').then((m) => m.OrderSuccess), title: 'Order Confirmed | Turf Tackles' },
  { path: 'info/:page', loadComponent: () => import('./pages/info/info').then((m) => m.Info) },
  { path: '**', loadComponent: () => import('./pages/not-found').then((m) => m.NotFound), title: 'Page not found | Turf Tackles' },
];
