# Memo·World

> A black-and-white photography memory game — flip polaroid cards, match world landmarks, beat the clock.

Built as a front-end showcase with **Vue 3**, **TypeScript** and **Vite**, styled with **Tailwind CSS v4**. Runs entirely in the browser — no backend, no images: every landmark is a hand-drawn line-art SVG, and highscores persist locally via `localStorage`.

**[▶ Play the live demo](https://memo-world-six.vercel.app)** · [Source on GitHub](https://github.com/Avery-techdev/memo-world)

---

## Highlights

- **Single source of truth** — `isFlipped` / `isMatched` on each card are the only stored state; points, matched pairs, remaining time and game-over are all `computed()`, never a second, driftable copy.
- **Real scoring mechanic** — points per pair scale with how few attempts it took, mirrored across three difficulty levels (Easy · Medium · Hard) with their own pair counts and time limits.
- **Persisted highscores, validated on read** — best result per level is saved to `localStorage`; data read back is treated as unsafe and validated beyond pure structure (non-empty strings, parseable dates) before use.
- **Accessible by default** — focus-trapped pause/game-over dialogs with focus return on close, `role="dialog"` + `aria-labelledby`, low-time warnings announced via `aria-live` (not color alone), and full keyboard operability.
- **Responsive & mobile-first** — column count adapts per level and breakpoint, card back and card face never overflow, and every screen was verified down to a 320px viewport.
- **Strict TypeScript** — no `any`, explicit prop/emit/return types, and a mandatory layer order (`UI → Composables → Services`) with no shortcuts between them.
- **Polaroid aesthetic, no images** — diagonal-line card backs, a soft key-light board glow and animated film grain are all pure CSS/Tailwind utilities layered on `@theme` design tokens.

## How to play

- Pick a difficulty: Easy (6 pairs), Medium (8 pairs) or Hard (10 pairs).
- Flip two cards per turn to reveal a landmark; matching pairs stay face-up.
- Fewer attempts per pair earn more points — 3, 2 or 1 depending on the level's thresholds.
- Match every pair before the level's time limit runs out to win the round.
- Pause anytime with the button or `Escape`; beat your saved highscore to see "New highscore".

## Tech stack

| Area        | Choice                                          |
| ----------- | ----------------------------------------------- |
| UI          | Vue 3 (Composition API, `<script setup>`)       |
| Language    | TypeScript (strict)                             |
| Build       | Vite                                            |
| Styling     | Tailwind CSS v4 (design tokens, no `any` CSS)   |
| Data        | Hardcoded level config + landmark line-art SVGs |
| Persistence | `localStorage` (highscores per level)           |
| Quality     | ESLint (flat, type-checked) + Prettier          |

## Architecture

Feature-based structure with a strict **UI → Composables → Services** layering. The feature exposes a single public API (`index.ts`); internal files stay private.

```
src/
├── App.vue                  # app shell
├── style.css                 # Tailwind entry + design tokens
└── features/memo-world/
    ├── components/           # presentational + one container (MemoryWorld)
    ├── composables/          # useMemoryGame — state + derived values + actions
    ├── services/              # gameStorageService (localStorage, validated reads)
    ├── illustrations/          # 10 landmark line-art SVGs + registry
    ├── config/                 # levels.ts, landmarks.ts (single source of config)
    ├── types/                  # domain types
    └── index.ts                # public API
```

- **Container / presentational split:** `MemoryWorld` owns state via `useMemoryGame`; every other component (`LevelSelect`, `GameBoard`, `MemoryCard`, `GameHeader`, overlays) is presentational and receives data through props.
- **Pure derivation:** `matchedPairs`, `points`, `remainingSeconds`, `isBoardComplete` and `isInteractionLocked` are all computed from the raw card/attempt/time state — never their own `ref`.
- **Services stay dumb:** `gameStorageService` only reads, validates and writes highscores; it has no knowledge of game rules. `useMemoryGame` decides what a result means for the round.

## Getting started

Requires Node 20+.

```bash
npm install      # install dependencies
npm run dev      # start the dev server
npm run build    # type-check + production build
npm run preview  # preview the production build
npm run lint     # ESLint
npm run format   # Prettier write
```

---

Built by **Avery Hauschild**
