import type { SymbolKey } from '../design/theme';
import { color } from '../design/tokens';

interface Props {
  symbol: SymbolKey;
  /** linke obere Ecke und Kantenlänge in den Einheiten des umgebenden SVG */
  x: number;
  y: number;
  size: number;
}

/** Symbole der Fähigkeiten, gezeichnet in einem 24×24-Raster. */
export function AbilitySymbol({ symbol, x, y, size }: Props) {
  const ink = color('ink');
  return (
    <g transform={`translate(${x} ${y}) scale(${size / 24})`} aria-hidden="true">
      {symbol === 'shell' && (
        <g fill="none" stroke={ink} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3.5C17 3.5 21 8 21 13.2C21 18.3 17 21 12 21C7 21 3 18.3 3 13.2C3 8 7 3.5 12 3.5Z" />
          <path d="M12 5.5L12 20.5M12 5.5L7.5 19.5M12 5.5L16.5 19.5M12 5.5L4.6 15.5M12 5.5L19.4 15.5" />
        </g>
      )}
      {symbol === 'binoculars' && (
        <g fill="none" stroke={ink} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <circle cx={6.5} cy={15.5} r={4.5} />
          <circle cx={17.5} cy={15.5} r={4.5} />
          <path d="M4 12L6 5.5H9.5L10.5 11M20 12L18 5.5H14.5L13.5 11M10.5 13.5H13.5" />
        </g>
      )}
      {symbol === 'whirl' && (
        <path
          d="M12.5 12.2C12.5 11.3 11.4 10.9 10.7 11.5C9.6 12.4 10.3 14.3 12 14.4C14.2 14.5 15.4 12 14.6 10.1C13.5 7.6 10 7.2 8.1 9.1C5.6 11.6 6.6 16.3 10.2 17.3C14.3 18.4 18.3 15.4 18.4 11.2C18.5 6.4 14 3 9.5 4.1"
          fill="none"
          stroke={ink}
          strokeWidth={2}
          strokeLinecap="round"
        />
      )}
    </g>
  );
}
