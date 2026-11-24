import { useId } from 'react';
import { back, cardShape, sizes, text, type CardSize } from '../design/theme';
import { color } from '../design/tokens';

/** Rückseite: Wellenlinien in zwei Petroltönen, in der Mitte der Mond. */
export function CardBack({ size = 'md' }: { size?: CardSize }) {
  const uid = useId().replace(/:/g, '');
  const s = sizes[size];
  const W = 100;
  const H = (100 * s.height) / s.width;
  const u = (px: number) => (px * 100) / s.width;

  const fi = u(back.frameInset);
  const frameR = cardShape.cornerRadius * W - fi * 0.5;

  // Wellenreihen über die ganze Innenfläche
  const rows: string[] = [];
  const gapU = u(back.rowGap);
  const amp = u(back.amplitude);
  const period = u(back.period);
  for (let i = 0, y = fi + gapU * 0.5; y < H - fi + amp; i++, y += gapU) {
    const phase = i % 2 === 0 ? 0 : Math.PI;
    const pts: string[] = [];
    for (let x = fi - 2; x <= W - fi + 2; x += 1.5) {
      pts.push(`${x.toFixed(2)} ${(y + amp * Math.sin((x / period) * Math.PI * 2 + phase)).toFixed(2)}`);
    }
    rows.push(`M${pts.join(' L')}`);
  }

  const moonR = (back.moonSize * W) / 2;
  const cx = W / 2;
  const cy = H / 2;

  return (
    <svg
      width={s.width}
      height={s.height}
      viewBox={`0 0 ${W} ${H.toFixed(2)}`}
      role="img"
      aria-label={text.cardBackLabel}
      style={{ display: 'block' }}
    >
      <defs>
        <clipPath id={`inner-${uid}`}>
          <rect x={fi} y={fi} width={W - 2 * fi} height={H - 2 * fi} rx={frameR} />
        </clipPath>
        {/* Sichel: Mondscheibe ohne den versetzten Kreis */}
        <mask id={`moon-${uid}`}>
          <circle cx={cx} cy={cy} r={moonR} fill="white" />
          <circle cx={cx + moonR * 0.42} cy={cy - moonR * 0.22} r={moonR * 0.86} fill="black" />
        </mask>
      </defs>
      <rect width={W} height={H} rx={cardShape.cornerRadius * W} fill={color('card')} />
      <rect
        x={u(back.rim)}
        y={u(back.rim)}
        width={W - 2 * u(back.rim)}
        height={H - 2 * u(back.rim)}
        rx={cardShape.cornerRadius * W - u(back.rim) * 0.6}
        fill={color('table')}
      />
      <g clipPath={`url(#inner-${uid})`}>
        <path d={rows.join(' ')} fill="none" stroke={color('tableLine')} strokeWidth={u(back.lineWidth)} strokeLinecap="round" />
        {/* Mond: ruhige Fläche in der Mitte */}
        <circle cx={cx} cy={cy} r={moonR + u(3)} fill={color('table')} />
        <circle cx={cx} cy={cy} r={moonR} fill={color('tableLine')} mask={`url(#moon-${uid})`} />
      </g>
      <rect
        x={fi}
        y={fi}
        width={W - 2 * fi}
        height={H - 2 * fi}
        rx={frameR}
        fill="none"
        stroke={color('tableLine')}
        strokeWidth={u(back.frameWidth)}
      />
    </svg>
  );
}
