/**
 * Ebbe – die einzige Quelle für das Design.
 *
 * Alles, was man sieht (Farben, Größen, Texte, Motive, Fähigkeiten), steht hier.
 * Komponenten lesen nur aus dieser Datei. Wer das Design ändern will, ändert
 * nur diese Datei.
 */

/* ─── Farben ─────────────────────────────────────────────────────────────── */

export const palette = {
  /** Spieltisch, auch dunkler Ton der Rückseite */
  table: '#0F3D4A',
  /** zweiter Petrolton der Rückseite */
  tableLine: '#1C6E7D',
  /** Karte (Papier) */
  card: '#F4EBDD',
  /** Schrift */
  ink: '#12262C',
  /** alles Antippbare, aktive Zustände */
  accent: '#FF6B57',
  /** Warnung */
  warning: '#F2B134',
  /** Wasser bei Wert 1 … Wasser bei Wert 13 (dazwischen wird gemischt) */
  waterLow: '#9ED8DB',
  waterHigh: '#1C6E7D',
  /* Naturtöne für die Illustrationen */
  sky: '#DDEBE7',
  watt: '#BCA584',
  wattLine: '#8C7556',
  shell: '#EFC8A2',
  shellLine: '#B9805C',
  foam: '#F4EBDD',
} as const;

export type ColorKey = keyof typeof palette;

/* ─── Schrift ────────────────────────────────────────────────────────────── */

export const font = {
  family:
    'system-ui, -apple-system, "SF Pro Text", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  /** Tabellenziffern: alle Ziffern gleich breit */
  numeric: 'tabular-nums',
  valueWeight: 700,
  labelWeight: 650,
  /** ungefähre Breite einer Ziffer bzw. eines Buchstabens in em (für Layout) */
  digitWidthEm: 0.62,
  letterWidthEm: 0.56,
} as const;

/* ─── Kartengrößen ───────────────────────────────────────────────────────── */

export type CardSize = 'sm' | 'md' | 'lg';

export interface SizeSpec {
  /** Breite und Höhe in px (Format 5:7) */
  width: number;
  height: number;
  /** Wert in den Ecken, in px */
  valueFont: number;
  /** Name der Fähigkeit im Band, in px (0 = kein Wort, nur Symbol) */
  labelFont: number;
  /** Fähigkeit als Band quer über die Karte oder als kleine Plakette */
  abilityStyle: 'band' | 'badge';
  /** Motiv zeigen (auf sm aus Platzgründen aus) */
  showMotif: boolean;
}

export const sizes: Record<CardSize, SizeSpec> = {
  sm: { width: 44, height: 62, valueFont: 18, labelFont: 0, abilityStyle: 'badge', showMotif: false },
  md: { width: 76, height: 106, valueFont: 28, labelFont: 10.5, abilityStyle: 'band', showMotif: true },
  lg: { width: 120, height: 168, valueFont: 40, labelFont: 15, abilityStyle: 'band', showMotif: true },
};

/* ─── Kartenaufbau (Anteile der Kartenbreite) ────────────────────────────── */

export const cardShape = {
  /** Eckenradius der Karte */
  cornerRadius: 0.09,
  /** Abstand des Wattausschnitts zum Kartenrand */
  windowInset: 0.045,
  /** Eckenradius des Wattausschnitts */
  windowRadius: 0.06,
  /** Höhe des Wattbodens, Anteil der Fensterhöhe (Standard) */
  groundLevel: 0.3,
  /** Abstand der Ziffer zum Rand ihres Eckfeldes, in em */
  chipPaddingEm: 0.2,
  /** Größe der Fähigkeits-Plakette auf sm, in px */
  badgeSize: 17,
} as const;

/* ─── Rückseite (Maße in px, damit die Linien auf jeder Größe gleich fein sind) ─ */

export const back = {
  /** Papierrand wie bei einer gedruckten Karte, hebt die Rückseite vom Tisch ab */
  rim: 2,
  /** Abstand des Rahmens zum Kartenrand */
  frameInset: 5,
  frameWidth: 1.1,
  /** Wellenlinien */
  lineWidth: 1.1,
  rowGap: 6,
  amplitude: 1.5,
  period: 11,
  /** Mond in der Mitte (Ebbe und Flut folgen dem Mond), Anteil der Kartenbreite */
  moonSize: 0.3,
} as const;

/* ─── Wasser ─────────────────────────────────────────────────────────────── */

export const water = {
  /** Höchster Kartenwert, entspricht vollem Wasserstand */
  maxValue: 13,
  /** Wellenhöhe an der Oberfläche: base + perValue × Wert (in Karteneinheiten, Breite = 100) */
  waveBase: 0.8,
  wavePerValue: 0.22,
  /** Wellenlänge in Karteneinheiten */
  wavePeriod: 22,
} as const;

/* ─── Fähigkeiten ────────────────────────────────────────────────────────── */

export type AbilityKey = 'muschel' | 'fernglas' | 'stroemung';
export type SymbolKey = 'shell' | 'binoculars' | 'whirl';

export interface AbilitySpec {
  name: string;
  effect: string;
  symbol: SymbolKey;
}

export const abilities: Record<AbilityKey, AbilitySpec> = {
  muschel: { name: 'Muschel', effect: 'eigene Karte ansehen', symbol: 'shell' },
  fernglas: { name: 'Fernglas', effect: 'fremde Karte ansehen', symbol: 'binoculars' },
  stroemung: { name: 'Strömung', effect: 'eigene gegen fremde Karte tauschen', symbol: 'whirl' },
};

/* ─── Kartenwerte 0 bis 13 ───────────────────────────────────────────────── */

export type MotifKey =
  | 'cracks'
  | 'creek'
  | 'wormTracks'
  | 'crab'
  | 'gull'
  | 'groyne'
  | 'buoy'
  | 'cockle'
  | 'snailShell'
  | 'binoculars'
  | 'lighthouse'
  | 'whirl'
  | 'doubleWave'
  | 'stormSurge';

export interface ValueSpec {
  value: number;
  motif: MotifKey;
  /** kurze Beschreibung des Motivs (Bildbeschreibung für Screenreader) */
  motifLabel: string;
  ability?: AbilityKey;
  /** eigene Bodenhöhe für dieses Motiv (Anteil der Fensterhöhe) */
  groundLevel?: number;
  /** Wasser reicht bis zum Kartenrand statt nur im Ausschnitt */
  fullBleed?: boolean;
}

export const values: ValueSpec[] = [
  { value: 0, motif: 'cracks', motifLabel: 'rissiger Wattboden', groundLevel: 0.56 },
  { value: 1, motif: 'creek', motifLabel: 'Priel' },
  { value: 2, motif: 'wormTracks', motifLabel: 'Wattwurm-Spuren' },
  { value: 3, motif: 'crab', motifLabel: 'Krebs' },
  { value: 4, motif: 'gull', motifLabel: 'Möwe' },
  { value: 5, motif: 'groyne', motifLabel: 'Buhne' },
  { value: 6, motif: 'buoy', motifLabel: 'Boje' },
  { value: 7, motif: 'cockle', motifLabel: 'Herzmuschel', ability: 'muschel' },
  { value: 8, motif: 'snailShell', motifLabel: 'Schneckenhaus', ability: 'muschel' },
  { value: 9, motif: 'binoculars', motifLabel: 'Fernglas', ability: 'fernglas' },
  { value: 10, motif: 'lighthouse', motifLabel: 'Leuchtturm', ability: 'fernglas' },
  { value: 11, motif: 'whirl', motifLabel: 'Strudel', ability: 'stroemung' },
  { value: 12, motif: 'doubleWave', motifLabel: 'Doppelwelle', ability: 'stroemung' },
  { value: 13, motif: 'stormSurge', motifLabel: 'Sturmflut, Wasser bis zum Rand', fullBleed: true },
];

/* ─── Bewegung ───────────────────────────────────────────────────────────── */

export const motion = {
  flipMs: 300,
  callHoldMs: 600,
} as const;

/* ─── Texte ──────────────────────────────────────────────────────────────── */

export const text = {
  gameName: 'Ebbe',
  call: 'Ebbe!',
  galleryTitle: 'Designgalerie',
  galleryIntro: 'Schritt 1: Stil-Probe mit den Werten 0, 7 und 13 und der Rückseite.',
  galleryFaces: 'Vorderseiten',
  galleryBack: 'Rückseite',
  sizeLabel: { sm: 'klein (sm)', md: 'mittel (md)', lg: 'groß (lg)' } as Record<CardSize, string>,
  cardBackLabel: 'verdeckte Karte',
} as const;

/** Welche Werte die Galerie zeigt (Schritt 1: Stil-Probe) */
export const galleryValues: number[] = [0, 7, 13];
