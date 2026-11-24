import { useId } from 'react';
import { abilities, cardShape, font, sizes, water, type CardSize } from '../design/theme';
import { color, valueSpec, waterColor, waterLevel } from '../design/tokens';
import { AbilitySymbol } from './AbilitySymbol';
import { Motif, type Box } from './motifs';

interface Props {
  /** Kartenwert 0 bis 13 */
  value: number;
  size?: CardSize;
}

/** Wellige Wasseroberfläche, nach unten gefüllt */
function wavePath(region: Box, surfaceY: number, amp: number, period: number, phase: number) {
  const step = 2;
  const pts: string[] = [];
  for (let x = region.x - step; x <= region.x + region.w + step; x += step) {
    const y = surfaceY + amp * Math.sin(((x - region.x) / period) * Math.PI * 2 + phase);
    pts.push(`${x.toFixed(2)} ${y.toFixed(2)}`);
  }
  const bottom = region.y + region.h + 2;
  return `M${pts[0]} L${pts.slice(1).join(' L')} L${region.x + region.w + step} ${bottom} L${region.x - step} ${bottom} Z`;
}

/**
 * Vorderseite einer Karte. Der Wert ist dreifach erkennbar: Zahl in den Ecken,
 * Wasserstand im Wattausschnitt und, bei Fähigkeiten, Symbol und Wort.
 */
export function CardFace({ value, size = 'md' }: Props) {
  const uid = useId().replace(/:/g, '');
  const s = sizes[size];
  const spec = valueSpec(value);
  const ability = spec.ability ? abilities[spec.ability] : undefined;

  // Koordinaten: Breite 100, Höhe passend zum Format
  const W = 100;
  const H = (100 * s.height) / s.width;
  const u = (px: number) => (px * 100) / s.width;

  const inset = cardShape.windowInset * W;
  const win: Box = { x: inset, y: inset, w: W - 2 * inset, h: H - 2 * inset };
  const region: Box = spec.fullBleed ? { x: 0, y: 0, w: W, h: H } : win;

  const level = waterLevel(value);
  const amp = water.waveBase + water.wavePerValue * value;
  const waterY = level >= 1 ? region.y - amp : region.y + region.h * (1 - level);
  const groundY = win.y + win.h * (1 - (spec.groundLevel ?? cardShape.groundLevel));

  // Eckfelder mit der Zahl
  const fu = u(s.valueFont);
  const digits = String(value).length;
  const pad = fu * cardShape.chipPaddingEm;
  const chipW = fu * font.digitWidthEm * digits + 2 * pad;
  const chipH = fu * 1.06;
  const chipR = fu * 0.3;

  // Fähigkeitsband
  const lf = u(s.labelFont);
  const bandH = lf * 1.95;
  const bandY = H - chipH - u(2.5) - bandH;
  const symSize = lf * 1.3;
  const labelW = ability ? ability.name.length * font.letterWidthEm * lf : 0;
  const gap = lf * 0.4;
  const contentX = W / 2 - (symSize + gap + labelW) / 2;

  const badge = u(cardShape.badgeSize);

  const label = ability ? `${value}, ${ability.name}: ${ability.effect}` : `${value}`;

  const corner = (
    <g>
      <rect x={-chipR} y={-chipR} width={chipW + chipR} height={chipH + chipR} rx={chipR} fill={color('card')} />
      <text
        x={chipW / 2}
        y={chipH / 2 + fu * 0.36}
        textAnchor="middle"
        fontSize={fu}
        fontWeight={font.valueWeight}
        fontFamily={font.family}
        fill={color('ink')}
        style={{ fontVariantNumeric: font.numeric }}
      >
        {value}
      </text>
    </g>
  );

  return (
    <svg
      width={s.width}
      height={s.height}
      viewBox={`0 0 ${W} ${H.toFixed(2)}`}
      role="img"
      aria-label={label}
      style={{ display: 'block' }}
    >
      <defs>
        <clipPath id={`card-${uid}`}>
          <rect width={W} height={H} rx={cardShape.cornerRadius * W} />
        </clipPath>
        <clipPath id={`region-${uid}`}>
          {spec.fullBleed ? (
            <rect width={W} height={H} rx={cardShape.cornerRadius * W} />
          ) : (
            <rect x={win.x} y={win.y} width={win.w} height={win.h} rx={cardShape.windowRadius * W} />
          )}
        </clipPath>
      </defs>

      <g clipPath={`url(#card-${uid})`}>
        <rect width={W} height={H} fill={color('card')} />

        {/* Wattausschnitt: Himmel, Boden, Wasser, Motiv */}
        <g clipPath={`url(#region-${uid})`}>
          <rect x={region.x} y={region.y} width={region.w} height={region.h} fill={color('sky')} />
          <rect x={region.x} y={groundY} width={region.w} height={region.y + region.h - groundY} fill={color('watt')} />
          {level > 0 && (
            <path d={wavePath(region, waterY, amp, water.wavePeriod, value * 0.9)} fill={waterColor(value)} />
          )}
          {s.showMotif && <Motif motif={spec.motif} ctx={{ region, waterY, groundY }} />}
        </g>

        {/* Fähigkeit */}
        {ability && s.abilityStyle === 'band' && (
          <g>
            <rect x={win.x} y={bandY} width={win.w} height={bandH} fill={color('card')} />
            <AbilitySymbol symbol={ability.symbol} x={contentX} y={bandY + (bandH - symSize) / 2} size={symSize} />
            <text
              x={contentX + symSize + gap}
              y={bandY + bandH / 2 + lf * 0.36}
              fontSize={lf}
              fontWeight={font.labelWeight}
              fontFamily={font.family}
              fill={color('ink')}
            >
              {ability.name}
            </text>
          </g>
        )}
        {ability && s.abilityStyle === 'badge' && (
          <g>
            <circle cx={win.x + win.w - badge / 2 - u(1)} cy={win.y + badge / 2 + u(1)} r={badge / 2} fill={color('card')} />
            <AbilitySymbol
              symbol={ability.symbol}
              x={win.x + win.w - badge / 2 - u(1) - badge * 0.33}
              y={win.y + badge / 2 + u(1) - badge * 0.33}
              size={badge * 0.66}
            />
          </g>
        )}

        {/* Zahl oben links und unten rechts */}
        {corner}
        <g transform={`rotate(180 ${W / 2} ${H / 2})`}>{corner}</g>
      </g>
    </svg>
  );
}
