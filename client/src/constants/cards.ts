import { Rank, ActionType } from "@shared/types";
import { CARD_POINTS, CARD_ACTIONS, RANKS } from "@shared/rules";

export { CARD_POINTS, CARD_ACTIONS, RANKS };

// Card art lives in client/public/cards (sliced from design/cabo-deck-sheet.webp
// by client/scripts/slice-cards.mjs). Base-relative so it also works under a sub-path.
const CARD_DIR = `${import.meta.env.BASE_URL}cards`;

export const cardImage = (rank: Rank): string => `${CARD_DIR}/${rank}.webp`;
export const CARD_BACK_IMAGE = `${CARD_DIR}/back.webp`;

export const ACTION_LABELS: Record<ActionType, string> = {
  PEEK: "Peek",
  SPY: "Spy",
  SWAP: "Swap",
  LOOK_AND_SWAP: "Look & Swap",
};

/** Accessible name, e.g. "7 – Peek" or "13". */
export const cardLabel = (rank: Rank): string => {
  const action = CARD_ACTIONS[rank];
  return action ? `${rank} – ${ACTION_LABELS[action]}` : `${rank}`;
};

/** Load every card image once so flips and draws never flash. */
export const preloadCardImages = (): void => {
  for (const src of [...RANKS.map(cardImage), CARD_BACK_IMAGE]) {
    const img = new Image();
    img.decoding = "async";
    img.src = src;
  }
};

// All sizes keep the art's 5:7 ratio.
export const CARD_SIZE_CLASSES = {
  sm: "w-10 h-14 md:w-14 md:h-20 text-[10px] md:text-xs",
  md: "w-16 h-[90px] md:w-20 md:h-28 text-xs md:text-sm",
  lg: "w-16 h-[90px] md:w-24 md:h-[134px] text-sm md:text-base",
};
