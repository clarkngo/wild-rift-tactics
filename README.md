# Wild Rift Tactics

Mobile-first Wild Rift companion site. First feature: **Baron lane matchups**. Tap the enemy's
champion to see good / neutral / bad picks into it, with trading patterns, level 1–5 laning
micro, wave and jungle tips for each.

## Develop

```bash
npm install
npm run dev
```

`npm run build` validates matchup data, type-checks, and builds to `dist/`. Pushing to `main`
deploys to GitHub Pages via `.github/workflows/static.yml` (Pages source must be set to
**GitHub Actions** in repo settings).

## Adding matchups

Add `src/features/baron-matchups/data/<enemy-id>.json` (see `src/features/baron-matchups/types.ts` and existing files). Keep
`reviewed: false` until a high-elo player has checked it. See `CLAUDE.md` for content rules.
