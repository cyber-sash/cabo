# Cabo

A real-time multiplayer card game built with React and Socket.IO. Play the classic [Cabo card game](https://en.wikipedia.org/wiki/Cabo_(game)) online with friends.

🎮 **Live at** [cabo.anno2026.de](https://cabo.anno2026.de) (fork of [dcs-soni/cabo](https://github.com/dcs-soni/cabo), live at [playcabo.vercel.app](https://playcabo.vercel.app))

## How to Play

- Each player starts with **4 face-down cards** and peeks at 2 of them.
- On your turn, draw from the **deck** or **discard pile**, then swap or discard.
- Action cards (7–12) grant abilities: **Peek**, **Spy**, **Swap**.
- Call **"Cabo!"** when you think you have the lowest hand — everyone else gets one final turn.
- Cards are numbered **0–13** and are worth their number. Lowest total score wins.

## Tech Stack

| Layer    | Tech                                      |
| -------- | ----------------------------------------- |
| Client   | React, TypeScript, Vite, Tailwind CSS     |
| Server   | Node.js, Express, Socket.IO               |
| State    | Zustand (client), in-memory (server)      |
| Extras   | Framer Motion, React Three Fiber, Lucide  |
| Deploy   | Vercel (client) · Render (server)         |

## Project Structure

```
├── client/          # React frontend (Vite)
├── server/          # Express + Socket.IO backend
└── shared/          # Shared types, rules & game config
```

## Card art

The card images in `client/public/cards/` are cut from `design/cabo-deck-sheet.webp` (a 4×4 sheet: 0–13, back, blank front). After changing the sheet, run:

```bash
node client/scripts/slice-cards.mjs
```

## Getting Started

### Prerequisites

- Node.js ≥ 18

### Install & Run

```bash
# Install all dependencies (root + client + server)
npm run install:all

# Start both client & server in dev mode
npm run dev
```

The client runs on `http://localhost:5173` and the server on `http://localhost:3001`.

## Game Rules

The illustrated deck has 52 cards, numbered 0–13. Each card is worth its number.

| Card   | Copies | Points | Action                          |
| ------ | ------ | ------ | ------------------------------- |
| 0      | 2      | 0      | —                               |
| 1 – 6  | 4 each | 1 – 6  | —                               |
| 7, 8   | 4 each | 7, 8   | Peek: look at one of your cards |
| 9, 10  | 4 each | 9, 10  | Spy: look at an opponent's card |
| 11, 12 | 4 each | 11, 12 | Swap: blind swap with an opponent |
| 13     | 2      | 13     | —                               |

- **Special win (Kamikaze):** end a round with exactly two 12s and two 13s and every other player gets **50** points.
- **2–4 players** per room.
- Game ends when a player's total score reaches **100**.
- Failed Cabo call = **+10 penalty**.

## License

MIT
