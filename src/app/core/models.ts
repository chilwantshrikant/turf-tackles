export type VersionId = 'fan' | 'master' | 'player';

export type League =
  | 'premier-league'
  | 'la-liga'
  | 'serie-a'
  | 'bundesliga'
  | 'ligue-1'
  | 'international'
  | 'world'
  | 'retro';

export type KitType = 'Home' | 'Away' | 'Third' | 'Special';

export type Pattern = 'solid' | 'stripes' | 'pinstripes' | 'hoops' | 'sash' | 'halves';

export type Size = 'S' | 'M' | 'L' | 'XL' | 'XXL';

/** Colours used to draw the jersey illustration. */
export interface JerseyDesign {
  primary: string;
  secondary: string;
  accent: string;
  pattern: Pattern;
  /** Sleeve colour, defaults to primary. */
  sleeves?: string;
  /** Colour of name / number print on the back. */
  print: string;
}

export interface Product {
  id: string;
  slug: string;
  team: string;
  kit: KitType;
  season: string;
  league: League;
  design: JerseyDesign;
  /** Versions this jersey is stocked in. */
  versions: VersionId[];
  /** Optional per-product price overrides (otherwise the version base price applies). */
  prices?: Partial<Record<VersionId, number>>;
  tags?: ('new' | 'bestseller' | 'limited')[];
  description: string;
}

export interface VersionInfo {
  id: VersionId;
  name: string;
  short: string;
  tagline: string;
  basePrice: number;
  mrp: number;
  fit: string;
  features: string[];
}

export interface Customisation {
  name: string;
  number: string;
}

export interface CartItem {
  key: string;
  productId: string;
  version: VersionId;
  size: Size;
  qty: number;
  unitPrice: number;
  custom?: Customisation;
}

export interface Customer {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export type PaymentMethod = 'online' | 'cod';

export interface OrderLine {
  title: string;
  version: string;
  size: Size;
  qty: number;
  lineTotal: number;
  custom?: Customisation;
}

export interface Totals {
  subtotal: number;
  discount: number;
  shipping: number;
  codFee: number;
  total: number;
}

export interface Order {
  id: string;
  createdAt: string;
  lines: OrderLine[];
  totals: Totals;
  customer: Customer;
  paymentMethod: PaymentMethod;
  paymentId?: string;
  status: 'paid' | 'cod-confirmed';
}
