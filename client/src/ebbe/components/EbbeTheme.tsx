import type { CSSProperties, ReactNode } from 'react';
import { cssVars } from '../design/tokens';

/** Setzt alle Design-Farben aus theme.ts als CSS-Variablen für alles darunter. */
export function EbbeTheme({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={className} style={cssVars() as CSSProperties}>
      {children}
    </div>
  );
}
