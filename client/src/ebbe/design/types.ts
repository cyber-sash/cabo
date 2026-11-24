/** Was ein Kartenplatz zeigt. Die Spiellogik liefert das, das Design zeigt es nur an. */
export type SlotView =
  | { state: 'hidden' }
  | { state: 'empty' }
  | { state: 'visible'; value: number }; // value 0 bis 13
