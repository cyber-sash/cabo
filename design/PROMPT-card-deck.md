Replace the standard playing-card deck in the Cabo game with the illustrated Cabo deck in `design/cabo-deck-sheet.webp`, and make the game rules match the printed cards.

## Context
- Repo: `~/Code/personal/cabo` (React/Vite client in `client/`, Socket.IO server in `server/`, shared types and rules in `shared/`). Read `PLAN.md` first.
- Live: client on Vercel at https://cabo.anno2026.de, server on the netcup VPS at https://cabo-api.anno2026.de (see the "Redeploy" section in PLAN.md).
- Today the game uses a 52-card French deck: `Rank = 'A'..'K'`, four suits, K = 0 points, J/Q = 10 points, 7–8 Peek, 9–10 Spy, J Swap, Q Look & Swap, special win with two Q and two K.

## The design: `design/cabo-deck-sheet.webp`
- 1060 × 1484 px, 4 columns × 4 rows, rounded cards on a cream background.
- Row 1: 0 (unicorn), 1 (leaf), 2 (lilac pattern), 3 (asparagus)
- Row 2: 4 (robins), 5 (castle), 6 (mice and light switch), 7 "Peek" (koi)
- Row 3: 8 "Peek" (ribbons), 9 "Spy" (glasses and moustache), 10 "Spy" (bowler hat), 11 "Swap" (red panda)
- Row 4: 12 "Swap" (crystal), 13 (glue bottle), **card back** (rainbow scales), **blank front** (cream sunburst, unused for now)
- Each card already prints its number in two corners, so do not draw rank or suit text on top of the art.

## New deck and rules (follow the printed cards)
| Value | Count | Points | Action |
|---|---|---|---|
| 0 | 2 | 0 | – |
| 1–6 | 4 each | = value | – |
| 7, 8 | 4 each | = value | Peek: look at one of your own cards |
| 9, 10 | 4 each | = value | Spy: look at one opponent's card |
| 11, 12 | 4 each | = value | Swap: blind swap one of your cards with an opponent's |
| 13 | 2 | 13 | – |

- Total 52 cards. No suits.
- Remove "Look & Swap" from the deck (both 11 and 12 say "Swap"). Remove dead code paths for it, or leave them unreachable with a comment. Keep the client UI consistent either way.
- The special win (two Q + two K today) becomes **two 12s + two 13s**, same effect and penalty (`SPECIAL_WIN_PENALTY`).
- Snap matches by value (unchanged).
- The Cabo penalty, game-end score and all timings stay as they are.

## Tasks
1. **Slice the sheet** into separate files with a small, repeatable script (Node + `sharp`, as a dev dependency or a one-off script under `client/scripts/`):
   - `client/public/cards/0.webp` … `13.webp`, `back.webp`, `blank.webp`.
   - Measure the grid from the image; don't guess. Crop each card tight to its rounded rectangle with the cream gutter removed. Keep the corners transparent (WebP with alpha) or crop to the card edge.
   - Keep every card at the same size and the same aspect ratio (about 5:7). Target under 60 KB per file.
   - Open a few of the crops and check them visually: no neighbour card bleeding in, no cut-off corner numbers.
2. **Shared types and rules** (`shared/types.ts`, `shared/rules.ts`):
   - `Rank` becomes the numbers 0–13. Drop `Suit`, or make it optional and unused; update `Card` to match.
   - Update `CARD_POINTS`, `CARD_ACTIONS`, `SPECIAL_WIN_CARDS` and the deck composition (add a `DECK_COMPOSITION` constant).
3. **Server** (`server/game/Deck.ts`, `ScoreCalculator.ts`, `GameRoom.ts`, `index.ts`): build the deck from `DECK_COMPOSITION`, then fix scoring, actions, snap, and any rank or suit checks.
4. **Client** (`client/src/components/Card.tsx`, `DrawAndDiscard.tsx`, `PeekOverlay.tsx`, `OpponentDisplay.tsx`, `PlayerHand.tsx`, `ScoreBoard.tsx`, `ActionModal.tsx`, `constants/cards.ts`, `constants/gameRules.tsx`, `constants/tutorial.ts`, `landing/*`, `index.css`, `store/gameStore.ts`):
   - **Face-up card:** the card's image fills the card; remove the old rank and suit text.
   - **Face-down card:** `back.webp`, replacing the current "C" back everywhere: player hand, opponents, draw pile and landing page.
   - **Sizes:** the art must stay readable at the smallest size (opponent cards on mobile). Use `object-fit: cover`, rounded corners matching the art, and the existing shadows and animations (Framer Motion flip and peek).
   - **Accessibility:** add `alt`/`aria-label` such as "7 – Peek" and "Face-down card".
   - **Loading:** preload the 16 images once at app start so flips don't flash.
   - **Text:** update the rules carousel, tutorial, landing sections and README rules table to the new values (0 = best, 13 = worst, actions on 7–12, special win with 12/12/13/13).
   - **Landing hero (React Three Fiber):** if it renders cards, use the new textures there too.
5. **Persisted sessions:** the zustand key `cabo-session` may hold old-format cards. Bump the key (e.g. `cabo-session-v2`) so old browsers don't crash.
6. **Verify locally:**
   - `npm run build` in `client/` and `server/` with no TypeScript errors.
   - `npm run dev`, then play at least one full round with 2 players: memorize, draw, discard, each action (Peek 7/8, Spy 9/10, Swap 11/12), a snap, a Cabo call with final turns, round results and scoring.
   - Check it on a 375 px wide mobile viewport.
   - Take screenshots of the hand, table and results screen.
7. **Deploy** only after the local checks pass, and tell me before you do. Server and client change together, and a server restart ends running games.
   - Commit and push to `origin` (cyber-sash/cabo).
   - Client: `vercel deploy --prod --scope saschamueller-5868s-projects` from the repo root.
   - Server: the command in PLAN.md → "Redeploy".
   - Then check https://cabo.anno2026.de and https://cabo-api.anno2026.de/health.

## Constraints
- Keep the existing look of the table, colours and animations; only the cards change.
- No new runtime dependencies in the client. `sharp` is allowed as a dev or script dependency only.
- Don't commit `design/` sources larger than needed. The sliced WebPs in `client/public/cards/` are the deliverable.
- Report what changed, the before/after rules, the screenshots, and anything you could not verify.
