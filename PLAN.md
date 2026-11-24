# Cabo at cabo.anno2026.de: build and deploy plan

Updated 2026-11-24. Source: https://github.com/dcs-soni/cabo (MIT per README, no LICENSE file).

## Target setup

```
Browser ──► https://cabo.anno2026.de ──► Vercel project "cabo" (static Vite build from client/)
   │
   └── wss ──► https://cabo-api.anno2026.de ──► Caddy on the netcup VPS (152.53.255.89)
                                                └─► Node Socket.IO server on 127.0.0.1:3001 (systemd)
```

**Why the server goes on your VPS, not on Vercel or Render:**
- It keeps game rooms in memory and runs timers, so it needs one long-running process. Vercel Functions can't give it that.
- The VPS already runs Caddy (automatic HTTPS), Node 22 and Docker, and has 4 cores and 7.7 GB RAM. `*.anno2026.de` already points at it, so `cabo-api.anno2026.de` resolves today. No extra cost, unlike Render.
- The existing sites (`anno2026.de`, `rt.anno2026.de`) stay as they are. Cabo gets its own Caddy site file with no basic auth, so friends can join.

## Status

### Done (local, uncommitted)
- [x] Cloned upstream into `~/Code/personal/cabo` (remote `upstream`).
- [x] Fixed: `<Analytics />` was never rendered (`client/src/App.tsx`).
- [x] Fixed: **calling Cabo ended the round with no final turns.** In a 2-player game the other player got no turn; in 3+ players, one player too few. Fix in `server/game/GameRoom.ts` `callCabo()`.
- [x] Fixed: dev server crashed (`shared/` was missing `"type": "module"`).
- [x] Server binds to `HOST` (default `0.0.0.0`; use `127.0.0.1` on the VPS).
- [x] README port corrected to 3001. `dist/` added to `.gitignore`.
- [x] `client/.env.production`: `VITE_SERVER_URL=https://cabo-api.anno2026.de`.
- [x] Both builds pass. Played locally (browser vs. a socket bot): create room, join, memorize, draw and discard, 9 = Spy action, session reconnect, Cabo call with final turn, round results with the +10 penalty.

### Deployed 2026-11-24
- [x] GitHub: fork https://github.com/cyber-sash/cabo (main pushed).
- [x] Vercel: project `cabo` (team saschamueller-5868's projects), root `client`, Vite, Node 22. Production deploy is Ready. Domain `cabo.anno2026.de` added.
- [x] VPS: `/opt/cabo` (user `cabo`), systemd `cabo.service` on 127.0.0.1:3001 (Node 18 system binary).
- [x] Caddy: `/etc/caddy/sites/cabo-api.anno2026.de.caddy`, TLS issued. `https://cabo-api.anno2026.de/health` returns ok. Live 2-client WebSocket smoke test passed.
- [x] DNS at netcup: CNAME `cabo` → `f3834c6d55ad4390.vercel-dns-017.com.` (live 2026-11-25). Vercel certificate issued (Let's Encrypt, auto-renew). HTTP redirects to HTTPS.
- [ ] **Optional:** give the Vercel GitHub app access to `cyber-sash/cabo` (GitHub → Settings → Applications → Vercel), then run `vercel git connect` so pushes auto-deploy. Until then, deploy with `vercel deploy --prod` from the repo root.

- [x] Illustrated 0–13 deck live (2026-11-25), client and server.
- [x] Site password-protected (HTTP Basic Auth via `client/middleware.ts`). Any username works; the password is the Vercel env var `SITE_PASSWORD` (production and preview). To change it: `vercel env rm SITE_PASSWORD production`, `vercel env add SITE_PASSWORD --environment production`, then redeploy. The game server `cabo-api.anno2026.de` itself has no password.

### Redeploy
- Client: `vercel deploy --prod --scope saschamueller-5868s-projects` (or push, once Git is connected).
- Server: `ssh anno2026 'cd /opt/cabo && sudo -u cabo git pull && cd server && sudo -u cabo npm ci --cache /tmp/cabo-npm-cache && sudo -u cabo npm run build && systemctl restart cabo'`

### Then: verify live
- [ ] Open https://cabo.anno2026.de on a laptop and a phone. Create a room and join it from the other device.
- [ ] Play a full round including special cards, snap and a Cabo call.
- [ ] Reload mid-game: the session should come back.
- [ ] DevTools: the socket is connected to `wss://cabo-api.anno2026.de`, with no CORS errors.

### Later (hardening)
- Clean up abandoned rooms (memory).
- Rate-limit room creation.
- Uptime check on `/health`.
- Redeploy script for the server (`git pull && npm ci && npm run build && systemctl restart cabo`).
- Known limit: a server restart ends all live games (in-memory state).
- Optional: upstream the Cabo final-turn fix to dcs-soni/cabo as a PR.
