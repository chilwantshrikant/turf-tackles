import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { JerseyDesign } from '../core/models';

let nextId = 0;

/**
 * Draws a jersey illustration from a colour design. Used in place of product photos;
 * swap for <img> tags once real product photography is available.
 */
@Component({
  selector: 'app-jersey-art',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg viewBox="0 0 240 260" role="img" [attr.aria-label]="label()">
      <defs>
        <clipPath [attr.id]="uid + 'c'"><path [attr.d]="body" /></clipPath>
        <linearGradient [attr.id]="uid + 'g'" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stop-color="#000" stop-opacity=".18" />
          <stop offset=".35" stop-color="#fff" stop-opacity=".10" />
          <stop offset=".65" stop-color="#fff" stop-opacity="0" />
          <stop offset="1" stop-color="#000" stop-opacity=".22" />
        </linearGradient>
      </defs>

      <g [attr.clip-path]="'url(#' + uid + 'c)'">
        <rect width="240" height="260" [attr.fill]="d().primary" />
        @switch (d().pattern) {
          @case ('stripes') {
            @for (x of stripes; track x) {
              <rect [attr.x]="x" y="0" width="17" height="260" [attr.fill]="d().secondary" />
            }
          }
          @case ('pinstripes') {
            @for (x of pinstripes; track x) {
              <rect [attr.x]="x" y="0" width="4" height="260" [attr.fill]="d().secondary" />
            }
          }
          @case ('hoops') {
            @for (y of hoops; track y) {
              <rect x="0" [attr.y]="y" width="240" height="22" [attr.fill]="d().secondary" />
            }
          }
          @case ('sash') {
            <path d="M40 10 L95 10 L215 260 L160 260 Z" [attr.fill]="d().secondary" />
          }
          @case ('halves') {
            <rect x="120" y="0" width="120" height="260" [attr.fill]="d().secondary" />
          }
        }
        <path [attr.d]="leftSleeve" [attr.fill]="d().sleeves ?? 'none'" />
        <path [attr.d]="rightSleeve" [attr.fill]="d().sleeves ?? 'none'" />
        <!-- cuffs and hem -->
        <path d="M12 62 L34 112" [attr.stroke]="d().accent" stroke-width="10" />
        <path d="M228 62 L206 112" [attr.stroke]="d().accent" stroke-width="10" />
        <rect width="240" height="260" [attr.fill]="'url(#' + uid + 'g)'" />
      </g>

      <path [attr.d]="body" fill="none" stroke="rgba(0,0,0,.25)" stroke-width="1.5" />

      @if (view() === 'front') {
        <path d="M95 14 Q120 40 145 14" fill="none" [attr.stroke]="d().accent" stroke-width="6"
              stroke-linecap="round" />
        <!-- crest -->
        <path d="M146 62 h20 v12 q0 12 -10 16 q-10 -4 -10 -16 z" [attr.fill]="d().accent"
              stroke="rgba(255,255,255,.6)" stroke-width="1.5" />
        <!-- maker mark -->
        <path d="M76 72 q8 6 20 -6 q-8 12 -20 6 z" [attr.fill]="d().accent" />
      } @else {
        <path d="M95 14 Q120 24 145 14" fill="none" [attr.stroke]="d().accent" stroke-width="6"
              stroke-linecap="round" />
        @if (name()) {
          <text x="120" y="78" text-anchor="middle" class="name" [attr.fill]="d().print"
                [attr.font-size]="nameSize()">{{ name() }}</text>
        }
        <text x="120" y="176" text-anchor="middle" class="num" [attr.fill]="d().print"
              [attr.stroke]="d().accent" stroke-width="1.5">{{ number() || '10' }}</text>
      }
    </svg>
  `,
  styles: `
    :host { display: block; }
    svg { width: 100%; height: auto; display: block; filter: drop-shadow(0 14px 18px rgba(0,0,0,.25)); }
    text { font-family: 'Bebas Neue', Impact, sans-serif; letter-spacing: 2px; }
    .num { font-size: 84px; }
  `,
})
export class JerseyArt {
  readonly d = input.required<JerseyDesign>({ alias: 'design' });
  readonly view = input<'front' | 'back'>('front');
  readonly name = input('');
  readonly number = input('');
  readonly label = input('Jersey illustration');

  readonly uid = 'j' + nextId++;
  readonly body =
    'M95 14 Q120 34 145 14 L178 24 L228 62 L206 112 L182 100 L182 236 Q120 248 58 236 L58 100 L34 112 L12 62 L62 24 Z';
  readonly leftSleeve = 'M62 24 L12 62 L34 112 L58 100 Z';
  readonly rightSleeve = 'M178 24 L228 62 L206 112 L182 100 Z';
  readonly stripes = [58, 92, 126, 160];
  readonly pinstripes = [62, 80, 98, 116, 134, 152, 170];
  readonly hoops = [40, 84, 128, 172, 216];

  readonly nameSize = computed(() => (this.name().length > 9 ? 18 : 24));
}
