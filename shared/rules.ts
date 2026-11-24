import { Rank, ActionType } from './types';

export const RANKS: Rank[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

// Points equal the printed value: 0 is best, 13 is worst.
export const CARD_POINTS: Record<Rank, number> = {
  0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6,
  7: 7, 8: 8, 9: 9, 10: 10, 11: 11, 12: 12, 13: 13,
};

export const CARD_ACTIONS: Record<Rank, ActionType | null> = {
  0: null, 1: null, 2: null, 3: null, 4: null, 5: null, 6: null,
  7: 'PEEK', 8: 'PEEK', 9: 'SPY', 10: 'SPY', 11: 'SWAP', 12: 'SWAP', 13: null,
};

// How many copies of each value are in the deck (52 cards).
export const DECK_COMPOSITION: Record<Rank, number> = {
  0: 2, 1: 4, 2: 4, 3: 4, 4: 4, 5: 4, 6: 4,
  7: 4, 8: 4, 9: 4, 10: 4, 11: 4, 12: 4, 13: 2,
};

// ─── Game Configuration & Rules ───
export const CONFIG = {
  MIN_PLAYERS: 2,
  MAX_PLAYERS: 4,
  CARDS_PER_PLAYER: 4,
  INITIAL_PEEK_COUNT: 2,
  SNAP_WINDOW_MS: 5000,
  MEMORIZE_TIME_MS: 10000,
  CABO_PENALTY: 10,
  SPECIAL_WIN_PENALTY: 50,
  GAME_END_SCORE: 100,
  ROOM_CODE_LENGTH: 6,
  CABO_ALERT_DURATION_MS: 5000,
  PEEK_DURATION_MS: 2500,
} as const;

// Special win: a hand of exactly two 12s and two 13s.
// Every other player gets SPECIAL_WIN_PENALTY points that round.
export const SPECIAL_WIN_CARDS: Partial<Record<Rank, number>> = {
  12: 2,
  13: 2,
};
