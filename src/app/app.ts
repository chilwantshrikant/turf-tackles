import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { environment } from '../environments/environment';
import { Footer } from './shared/footer';
import { Header } from './shared/header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer],
  template: `
    <app-header />
    <main><router-outlet /></main>
    <app-footer />
    <a class="wa" [href]="whatsapp" target="_blank" rel="noopener" aria-label="Chat with us on WhatsApp">
      <svg viewBox="0 0 32 32" aria-hidden="true"><path fill="#fff" d="M16 3a13 13 0 0 0-11.2 19.6L3 29l6.6-1.7A13 13 0 1 0 16 3Zm0 23.7c-2 0-4-.6-5.7-1.6l-.4-.2-3.9 1 1-3.8-.3-.4A10.7 10.7 0 1 1 16 26.7Zm5.9-8c-.3-.2-1.9-1-2.2-1-.3-.1-.5-.2-.7.1l-1 1.3c-.2.2-.4.2-.7.1a8.8 8.8 0 0 1-4.4-3.8c-.3-.6.3-.5 1-1.7.1-.2 0-.4 0-.6l-1-2.3c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.1 1.1-1.1 2.7s1.2 3.2 1.3 3.4c.2.2 2.3 3.5 5.6 4.9 2.1.9 2.9 1 4 .8.6-.1 1.9-.8 2.2-1.5.3-.8.3-1.4.2-1.5-.1-.2-.3-.3-.6-.4Z"/></svg>
    </a>
  `,
  styles: `
    :host { display: flex; flex-direction: column; min-height: 100vh; }
    main { flex: 1; }
    .wa { position: fixed; z-index: 40; right: 16px; bottom: 16px; width: 54px; height: 54px; border-radius: 50%; background: #25d366; display: grid; place-items: center; box-shadow: 0 10px 24px -6px rgba(37,211,102,.6); transition: transform .2s; }
    .wa:hover { transform: scale(1.08); }
    .wa svg { width: 30px; height: 30px; }
  `,
})
export class App {
  readonly whatsapp = `https://wa.me/${environment.whatsappNumber}?text=${encodeURIComponent('Hi Turf Tackles! I have a question about a jersey.')}`;
}
