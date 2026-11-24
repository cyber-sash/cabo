import type { ReactNode } from 'react';
import type { MotifKey } from '../design/theme';
import { color, waterColor } from '../design/tokens';

export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Was ein Motiv zum Zeichnen bekommt (alles in Karteneinheiten, Breite = 100) */
export interface MotifContext {
  /** Fläche, in der Wasser steht (Ausschnitt oder ganze Karte) */
  region: Box;
  /** Höhe der Wasseroberfläche (y) */
  waterY: number;
  /** Oberkante des Wattbodens (y) */
  groundY: number;
}

/** Hilfsfunktion: Punkte in Anteilen (0 … 1) einer Fläche in Karteneinheiten umrechnen */
const at = (b: Box) => (u: number, v: number) => `${(b.x + u * b.w).toFixed(2)} ${(b.y + v * b.h).toFixed(2)}`;

/* ─── 0: rissiger Wattboden ──────────────────────────────────────────────── */

// Risse werden zum Betrachter hin größer (leichte Perspektive), unregelmäßig wie getrockneter Schlick
const CRACKS: [number, number][][] = [
  [[0, 0.14], [0.12, 0.12], [0.27, 0.17], [0.36, 0.13], [0.52, 0.16], [0.66, 0.11], [0.81, 0.15], [1, 0.12]],
  [[0, 0.4], [0.09, 0.36], [0.24, 0.43], [0.4, 0.37], [0.47, 0.44], [0.63, 0.4], [0.78, 0.47], [0.9, 0.41], [1, 0.44]],
  [[0, 0.76], [0.16, 0.7], [0.29, 0.79], [0.46, 0.73], [0.58, 0.82], [0.75, 0.76], [1, 0.84]],
  [[0.12, 0.12], [0.09, 0.36]],
  [[0.27, 0.17], [0.31, 0.28], [0.24, 0.43], [0.16, 0.7], [0.19, 0.88], [0.13, 1]],
  [[0.52, 0.16], [0.47, 0.44]],
  [[0.66, 0.11], [0.69, 0.26], [0.63, 0.4]],
  [[0.81, 0.15], [0.9, 0.41]],
  [[0.4, 0.37], [0.46, 0.73], [0.41, 1]],
  [[0.78, 0.47], [0.75, 0.76], [0.84, 1]],
  [[0.29, 0.79], [0.3, 1]],
  [[0.58, 0.82], [0.62, 1]],
  [[0.31, 0.28], [0.4, 0.3]],
];

function Cracks({ region, groundY }: MotifContext) {
  const ground: Box = { x: region.x, y: groundY, w: region.w, h: region.y + region.h - groundY };
  const p = at(ground);
  const cx = region.x + region.w * 0.7;
  const cy = region.y + (groundY - region.y) * 0.62;
  return (
    <g>
      {/* eine ruhige Wolke */}
      <path
        d={`M${cx - 12} ${cy} H${cx + 12} A4.2 4.2 0 0 0 ${cx + 9} ${cy - 7.6} A6.4 6.4 0 0 0 ${cx - 2.5} ${cy - 8.6} A4.6 4.6 0 0 0 ${cx - 10} ${cy - 4.4} A2.6 2.6 0 0 0 ${cx - 12} ${cy} Z`}
        fill={color('card')}
      />
      <g fill="none" stroke={color('wattLine')} strokeWidth={1.25} strokeLinecap="round" strokeLinejoin="round">
        {CRACKS.map((line, i) => (
          <polyline key={i} points={line.map(([u, v]) => p(u, v)).join(' ')} />
        ))}
      </g>
    </g>
  );
}

/* ─── 7: Herzmuschel ─────────────────────────────────────────────────────── */

function Cockle({ region, waterY }: MotifContext) {
  const cx = region.x + region.w / 2;
  const bankW = region.w * 0.56;
  const bankH = region.h * 0.075;
  const size = region.w * 0.4;
  const top = waterY - bankH * 0.9 - size * 0.86;
  return (
    <g>
      {/* kleine Sandbank, die aus dem Wasser ragt */}
      <path
        d={`M${cx - bankW / 2} ${waterY + 2} Q${cx} ${waterY - bankH * 2} ${cx + bankW / 2} ${waterY + 2} Z`}
        fill={color('watt')}
      />
      <g transform={`translate(${cx - size / 2} ${top}) scale(${size / 24}) rotate(-12 12 12)`}>
        <path
          d="M12 3.2C17.2 3.2 21.6 7.7 21.6 13.2C21.6 18.6 17.3 21.6 12 21.6C6.7 21.6 2.4 18.6 2.4 13.2C2.4 7.7 6.8 3.2 12 3.2Z"
          fill={color('shell')}
          stroke={color('shellLine')}
          strokeWidth={0.9}
        />
        <g stroke={color('shellLine')} strokeWidth={1} strokeLinecap="round" fill="none">
          <path d="M12 5.2V21.2M12 5.2L8.6 20.9M12 5.2L15.4 20.9M12 5.2L5.6 19.4M12 5.2L18.4 19.4M12 5.2L3.4 16.2M12 5.2L20.6 16.2M12 5.2L3.2 11.8M12 5.2L20.8 11.8" />
        </g>
        <circle cx={12} cy={4.2} r={1.7} fill={color('shellLine')} />
      </g>
    </g>
  );
}

/* ─── 13: Sturmflut ──────────────────────────────────────────────────────── */

function StormSurge({ region }: MotifContext) {
  const p = at(region);
  return (
    <g>
      {/* große, sich einrollende Welle */}
      <path
        d={`M${p(0, 0.6)} C${p(0.2, 0.57)} ${p(0.33, 0.42)} ${p(0.47, 0.31)} C${p(0.6, 0.21)} ${p(0.81, 0.19)} ${p(0.9, 0.29)} C${p(0.97, 0.37)} ${p(0.93, 0.48)} ${p(0.84, 0.48)} C${p(0.77, 0.48)} ${p(0.76, 0.41)} ${p(0.81, 0.39)} C${p(0.71, 0.41)} ${p(0.66, 0.53)} ${p(0.73, 0.62)} C${p(0.81, 0.71)} ${p(0.93, 0.7)} ${p(1, 0.66)} L${p(1, 1)} L${p(0, 1)} Z`}
        fill={waterColor(9)}
      />
      {/* Gischt auf dem Kamm */}
      <path
        d={`M${p(0.36, 0.4)} C${p(0.5, 0.27)} ${p(0.7, 0.19)} ${p(0.86, 0.26)} C${p(0.93, 0.3)} ${p(0.94, 0.4)} ${p(0.88, 0.45)}`}
        fill="none"
        stroke={color('foam')}
        strokeWidth={2.6}
        strokeLinecap="round"
      />
      <circle cx={region.x + region.w * 0.97} cy={region.y + region.h * 0.22} r={1.5} fill={color('foam')} />
      <circle cx={region.x + region.w * 0.9} cy={region.y + region.h * 0.15} r={1.1} fill={color('foam')} />
      <circle cx={region.x + region.w * 0.76} cy={region.y + region.h * 0.13} r={1.3} fill={color('foam')} />
      {/* vordere Welle */}
      <path
        d={`M${p(0, 0.8)} C${p(0.18, 0.7)} ${p(0.34, 0.7)} ${p(0.5, 0.78)} C${p(0.66, 0.86)} ${p(0.84, 0.84)} ${p(1, 0.76)} L${p(1, 1)} L${p(0, 1)} Z`}
        fill={waterColor(11)}
      />
      <path
        d={`M${p(0.06, 0.765)} C${p(0.18, 0.705)} ${p(0.3, 0.705)} ${p(0.4, 0.74)}`}
        fill="none"
        stroke={color('foam')}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </g>
  );
}

/* ─── Zuordnung ──────────────────────────────────────────────────────────── */

const MOTIFS: Partial<Record<MotifKey, (ctx: MotifContext) => ReactNode>> = {
  cracks: Cracks,
  cockle: Cockle,
  stormSurge: StormSurge,
};

/** Zeichnet das Motiv eines Werts. Motive, die es noch nicht gibt, bleiben leer. */
export function Motif({ motif, ctx }: { motif: MotifKey; ctx: MotifContext }) {
  const Draw = MOTIFS[motif];
  return Draw ? <>{Draw(ctx)}</> : null;
}
