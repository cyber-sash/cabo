/**
 * Abgeleitete Werte aus theme.ts. Hier steht kein Design-Wert, nur Rechnung.
 */
import { palette, values, water, type ColorKey, type ValueSpec } from './theme';

const kebab = (s: string) => s.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);

export const cssVarName = (key: string) => `--ebbe-${kebab(key)}`;

/** Farbe als CSS-Variable, mit dem Wert aus theme.ts als Rückfall */
export const color = (key: ColorKey) => `var(${cssVarName(key)}, ${palette[key]})`;

/* ─── Wasser ─────────────────────────────────────────────────────────────── */

const hexToRgb = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const rgbToHex = (rgb: number[]) =>
  '#' + rgb.map((c) => Math.round(c).toString(16).padStart(2, '0')).join('').toUpperCase();

/** Wasserfarbe je Wert als Hex: Wert 1 = waterLow, 13 = waterHigh */
export const waterHex = (value: number) => {
  const t = Math.min(1, Math.max(0, (value - 1) / (water.maxValue - 1)));
  const a = hexToRgb(palette.waterLow);
  const b = hexToRgb(palette.waterHigh);
  return rgbToHex(a.map((c, i) => c + (b[i] - c) * t));
};

export const waterVarName = (value: number) => `--ebbe-water-${value}`;
export const waterColor = (value: number) => `var(${waterVarName(value)}, ${waterHex(value)})`;

/** Wasserstand 0 … 1 */
export const waterLevel = (value: number) => Math.min(1, Math.max(0, value / water.maxValue));

/* ─── Werte ──────────────────────────────────────────────────────────────── */

export const valueSpec = (value: number): ValueSpec => {
  const spec = values.find((v) => v.value === value);
  if (!spec) throw new Error(`Ebbe: kein Kartenwert ${value} in theme.ts`);
  return spec;
};

/* ─── CSS-Variablen ──────────────────────────────────────────────────────── */

/** Alle Design-Farben als CSS-Variablen, zum Setzen auf einem Wrapper-Element */
export const cssVars = (): Record<string, string> => {
  const vars: Record<string, string> = {};
  for (const key of Object.keys(palette) as ColorKey[]) vars[cssVarName(key)] = palette[key];
  for (let v = 0; v <= water.maxValue; v++) vars[waterVarName(v)] = waterHex(v);
  return vars;
};

/** Farben für Tailwind: bg-ebbe-table, text-ebbe-ink, … */
export const tailwindColors = (): Record<string, string> => {
  const out: Record<string, string> = {};
  for (const key of Object.keys(palette) as ColorKey[]) out[kebab(key)] = color(key);
  return out;
};
