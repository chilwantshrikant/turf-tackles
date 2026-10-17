import { League, Product, VersionId, VersionInfo } from '../core/models';

/**
 * Version definitions. Change basePrice / mrp here to reprice the whole catalogue;
 * use `prices` on an individual product to override a single jersey.
 */
export const VERSIONS: Record<VersionId, VersionInfo> = {
  fan: {
    id: 'fan',
    name: 'Fan Version',
    short: 'Fan',
    tagline: 'Everyday comfort for the stands',
    basePrice: 799,
    mrp: 1499,
    fit: 'Regular fit',
    features: [
      'Soft, breathable polyester',
      'Embroidered crest & logo',
      'Regular, relaxed fit',
      'Perfect for match days & casual wear',
    ],
  },
  master: {
    id: 'master',
    name: 'Master Version',
    short: 'Master',
    tagline: 'Premium quality, closest to original',
    basePrice: 1099,
    mrp: 1999,
    fit: 'Regular fit',
    features: [
      'Premium textured fabric',
      'High-density embroidered crest',
      'Detailed trims & heat-pressed tags',
      'Colour-fast, long-lasting finish',
    ],
  },
  player: {
    id: 'player',
    name: 'Player Version',
    short: 'Player',
    tagline: 'Match-grade, worn on the pitch',
    basePrice: 1399,
    mrp: 2499,
    fit: 'Slim athletic fit — size up for a relaxed look',
    features: [
      'Lightweight match-grade fabric',
      'Heat-pressed crest & logos',
      'Laser-cut ventilation zones',
      'Slim, athletic cut',
    ],
  },
};

export const VERSION_ORDER: VersionId[] = ['fan', 'master', 'player'];

export const LEAGUES: Record<League, string> = {
  'premier-league': 'Premier League',
  'la-liga': 'La Liga',
  'serie-a': 'Serie A',
  bundesliga: 'Bundesliga',
  'ligue-1': 'Ligue 1',
  international: 'International',
  world: 'Rest of World',
  retro: 'Retro',
};

export const CUSTOMISATION_PRICE = 199;
export const FREE_SHIPPING_ABOVE = 1499;
export const SHIPPING_FEE = 79;
export const COD_FEE = 49;
export const COUPONS: Record<string, number> = { TURF10: 0.1, WELCOME5: 0.05 };

const ALL: VersionId[] = ['fan', 'master', 'player'];

export const PRODUCTS: Product[] = [
  {
    id: 'p01', slug: 'real-madrid-home-25-26', team: 'Real Madrid', kit: 'Home', season: '25/26',
    league: 'la-liga', versions: ALL, tags: ['bestseller'],
    design: { primary: '#f7f7f5', secondary: '#f7f7f5', accent: '#c9a227', pattern: 'solid', print: '#1b1f3b' },
    description: 'The iconic all-white of Los Blancos with gold trims.',
  },
  {
    id: 'p02', slug: 'barcelona-home-25-26', team: 'Barcelona', kit: 'Home', season: '25/26',
    league: 'la-liga', versions: ALL, tags: ['bestseller'],
    design: { primary: '#a50044', secondary: '#004d98', accent: '#edbb00', pattern: 'stripes', print: '#edbb00' },
    description: 'Classic blaugrana stripes for every Culer.',
  },
  {
    id: 'p03', slug: 'manchester-united-home-25-26', team: 'Manchester United', kit: 'Home', season: '25/26',
    league: 'premier-league', versions: ALL, tags: ['bestseller'],
    design: { primary: '#da291c', secondary: '#da291c', accent: '#111111', pattern: 'solid', print: '#ffffff' },
    description: 'Red Devils red with sharp black detailing.',
  },
  {
    id: 'p04', slug: 'manchester-city-home-25-26', team: 'Manchester City', kit: 'Home', season: '25/26',
    league: 'premier-league', versions: ALL, tags: ['new'],
    design: { primary: '#6cabdd', secondary: '#6cabdd', accent: '#1c2c5b', pattern: 'solid', print: '#1c2c5b' },
    description: 'Sky blue for the Cityzens.',
  },
  {
    id: 'p05', slug: 'liverpool-home-25-26', team: 'Liverpool', kit: 'Home', season: '25/26',
    league: 'premier-league', versions: ALL, tags: ['bestseller'],
    design: { primary: '#c8102e', secondary: '#c8102e', accent: '#f6eb61', pattern: 'solid', print: '#ffffff' },
    description: "You'll never walk alone — in Anfield red.",
  },
  {
    id: 'p06', slug: 'arsenal-home-25-26', team: 'Arsenal', kit: 'Home', season: '25/26',
    league: 'premier-league', versions: ALL, tags: ['new'],
    design: { primary: '#ef0107', secondary: '#ef0107', accent: '#063672', sleeves: '#ffffff', pattern: 'solid', print: '#ffffff' },
    description: 'Red body, white sleeves — the Gunners classic.',
  },
  {
    id: 'p07', slug: 'chelsea-home-25-26', team: 'Chelsea', kit: 'Home', season: '25/26',
    league: 'premier-league', versions: ALL,
    design: { primary: '#034694', secondary: '#034694', accent: '#ffffff', pattern: 'solid', print: '#ffffff' },
    description: 'Royal blue for the Blues.',
  },
  {
    id: 'p08', slug: 'bayern-munich-home-25-26', team: 'Bayern Munich', kit: 'Home', season: '25/26',
    league: 'bundesliga', versions: ALL,
    design: { primary: '#dc052d', secondary: '#dc052d', accent: '#ffffff', pattern: 'solid', print: '#ffffff' },
    description: 'Mia san mia — the record champions in red.',
  },
  {
    id: 'p09', slug: 'borussia-dortmund-home-25-26', team: 'Borussia Dortmund', kit: 'Home', season: '25/26',
    league: 'bundesliga', versions: ['fan', 'master'],
    design: { primary: '#fde100', secondary: '#fde100', accent: '#000000', pattern: 'solid', print: '#000000' },
    description: 'Black and yellow for the Yellow Wall.',
  },
  {
    id: 'p10', slug: 'juventus-home-25-26', team: 'Juventus', kit: 'Home', season: '25/26',
    league: 'serie-a', versions: ALL,
    design: { primary: '#ffffff', secondary: '#111111', accent: '#111111', pattern: 'stripes', print: '#e2b007' },
    description: 'Bianconeri black and white stripes.',
  },
  {
    id: 'p11', slug: 'ac-milan-home-25-26', team: 'AC Milan', kit: 'Home', season: '25/26',
    league: 'serie-a', versions: ALL,
    design: { primary: '#fb090b', secondary: '#111111', accent: '#ffffff', pattern: 'stripes', print: '#ffffff' },
    description: 'Rossoneri red and black stripes.',
  },
  {
    id: 'p12', slug: 'inter-milan-home-25-26', team: 'Inter Milan', kit: 'Home', season: '25/26',
    league: 'serie-a', versions: ['fan', 'master'],
    design: { primary: '#0068a8', secondary: '#111111', accent: '#c4a464', pattern: 'pinstripes', print: '#c4a464' },
    description: 'Nerazzurri blue and black.',
  },
  {
    id: 'p13', slug: 'psg-home-25-26', team: 'Paris Saint-Germain', kit: 'Home', season: '25/26',
    league: 'ligue-1', versions: ALL, tags: ['new'],
    design: { primary: '#004170', secondary: '#004170', accent: '#da291c', pattern: 'solid', print: '#ffffff' },
    description: 'Parisian navy with the signature red band.',
  },
  {
    id: 'p14', slug: 'real-madrid-away-25-26', team: 'Real Madrid', kit: 'Away', season: '25/26',
    league: 'la-liga', versions: ALL,
    design: { primary: '#1b1f3b', secondary: '#1b1f3b', accent: '#c9a227', pattern: 'solid', print: '#c9a227' },
    description: 'Midnight navy away kit with gold accents.',
  },
  {
    id: 'p15', slug: 'barcelona-away-25-26', team: 'Barcelona', kit: 'Away', season: '25/26',
    league: 'la-liga', versions: ['fan', 'master'],
    design: { primary: '#f1d64b', secondary: '#f1d64b', accent: '#a50044', pattern: 'solid', print: '#a50044' },
    description: 'Golden senyera-inspired away shirt.',
  },
  {
    id: 'p16', slug: 'argentina-home-2026', team: 'Argentina', kit: 'Home', season: '2026',
    league: 'international', versions: ALL, tags: ['bestseller'],
    design: { primary: '#ffffff', secondary: '#75aadb', accent: '#111111', pattern: 'stripes', print: '#111111' },
    description: 'Albiceleste stripes of the world champions.',
  },
  {
    id: 'p17', slug: 'brazil-home-2026', team: 'Brazil', kit: 'Home', season: '2026',
    league: 'international', versions: ALL, tags: ['bestseller'],
    design: { primary: '#ffdf00', secondary: '#ffdf00', accent: '#009c3b', pattern: 'solid', print: '#002776' },
    description: 'Canarinho yellow with green trims.',
  },
  {
    id: 'p18', slug: 'portugal-home-2026', team: 'Portugal', kit: 'Home', season: '2026',
    league: 'international', versions: ALL,
    design: { primary: '#c8102e', secondary: '#c8102e', accent: '#046a38', pattern: 'solid', print: '#f4c300' },
    description: 'Seleção red with green and gold details.',
  },
  {
    id: 'p19', slug: 'france-home-2026', team: 'France', kit: 'Home', season: '2026',
    league: 'international', versions: ALL,
    design: { primary: '#1a2b56', secondary: '#1a2b56', accent: '#e1000f', pattern: 'solid', print: '#ffffff' },
    description: 'Les Bleus deep navy.',
  },
  {
    id: 'p20', slug: 'india-home-2026', team: 'India', kit: 'Home', season: '2026',
    league: 'international', versions: ['fan', 'master'], tags: ['new'],
    design: { primary: '#1f4fb4', secondary: '#1f4fb4', accent: '#ff9933', pattern: 'solid', print: '#ffffff' },
    description: 'Blue Tigers home shirt — back the boys in blue.',
  },
  {
    id: 'p21', slug: 'brazil-2002-retro', team: 'Brazil', kit: 'Home', season: '2002',
    league: 'retro', versions: ['fan', 'master'], prices: { fan: 999, master: 1299 }, tags: ['limited'],
    design: { primary: '#ffe600', secondary: '#ffe600', accent: '#00843d', pattern: 'solid', print: '#0b3d91' },
    description: 'The legendary 2002 world cup winning shirt.',
  },
  {
    id: 'p22', slug: 'ac-milan-2007-retro', team: 'AC Milan', kit: 'Home', season: '06/07',
    league: 'retro', versions: ['fan', 'master'], prices: { fan: 999, master: 1299 },
    design: { primary: '#d4001f', secondary: '#111111', accent: '#ffffff', pattern: 'stripes', print: '#ffffff' },
    description: 'Champions of Europe, Athens 2007.',
  },
  {
    id: 'p23', slug: 'manchester-united-2008-retro', team: 'Manchester United', kit: 'Home', season: '07/08',
    league: 'retro', versions: ['fan', 'master'], prices: { fan: 999, master: 1299 }, tags: ['limited'],
    design: { primary: '#d0021b', secondary: '#d0021b', accent: '#ffffff', pattern: 'solid', print: '#ffffff' },
    description: 'The Moscow night — 2008 double winners.',
  },
  {
    id: 'p24', slug: 'celtic-home-25-26', team: 'Celtic', kit: 'Home', season: '25/26',
    league: 'world', versions: ['fan'],
    design: { primary: '#ffffff', secondary: '#018749', accent: '#018749', pattern: 'hoops', print: '#018749' },
    description: 'The famous green and white hoops.',
  },
  {
    id: 'p25', slug: 'netherlands-home-2026', team: 'Netherlands', kit: 'Home', season: '2026',
    league: 'international', versions: ['fan', 'master'],
    design: { primary: '#f36c21', secondary: '#f36c21', accent: '#1b1f3b', pattern: 'solid', print: '#1b1f3b' },
    description: 'Oranje, bold and bright.',
  },
  {
    id: 'p26', slug: 'river-plate-home-25-26', team: 'River Plate', kit: 'Home', season: '25/26',
    league: 'world', versions: ['fan', 'master'],
    design: { primary: '#ffffff', secondary: '#e30613', accent: '#111111', pattern: 'sash', print: '#111111' },
    description: 'White with the unmistakable red sash.',
  },
  {
    id: 'p27', slug: 'liverpool-away-25-26', team: 'Liverpool', kit: 'Away', season: '25/26',
    league: 'premier-league', versions: ALL,
    design: { primary: '#f2efe4', secondary: '#f2efe4', accent: '#c8102e', pattern: 'solid', print: '#c8102e' },
    description: 'Off-white away shirt with red trims.',
  },
  {
    id: 'p28', slug: 'blackburn-halves-retro', team: 'Blackburn Rovers', kit: 'Home', season: '94/95',
    league: 'retro', versions: ['fan'], prices: { fan: 899 },
    design: { primary: '#0a4ea2', secondary: '#ffffff', accent: '#111111', pattern: 'halves', print: '#111111' },
    description: 'Blue and white halves from the title-winning season.',
  },
];
