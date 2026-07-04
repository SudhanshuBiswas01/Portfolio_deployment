# Sudhanshu Biswas - Portfolio

Single-page portfolio for an AI/ML/Agentic Engineer who ships to production.
Next.js (App Router) + TypeScript + Tailwind + shadcn structure, with
framer-motion, three.js, next-themes and lucide-react.

## Design system (locked tokens)

| Token | Hex | Role |
|-------|-----|------|
| `void` | #06070F | near-black base |
| `surface` | #0C0F1D | cards / panels |
| `surface-2` | #12162A | raised panels |
| `signal` | #6E8BFF | the one electric blue accent (used with discipline) |
| `ion` | #A56BFF | violet - gradient endpoint / rare hover only |
| `vapor` | #E9EBF5 | primary text |
| `ash` | #868DA6 | muted text |

Type: **Space Grotesk** (display, sparingly) + **Inter** (body) + **JetBrains Mono** (telemetry / build-in-public voice).
Signature element: the **Telemetry Spine** - a scroll-driven neural pulse down the page.

## Getting started

```bash
npm install
npm run dev
```

Add your assets to `/public` (see `public/README-ASSETS.md`):
`hero-neural-network.mp4`, `hero-poster.jpg`, `education-collage.jpg`, `og.png`.

## Live GitHub stats

`app/api/github/route.ts` fetches live repo stats (revalidates hourly).
Set a token for higher rate limits:

```bash
# .env.local
GITHUB_TOKEN=ghp_xxx
```

If the API fails, the UI falls back to the exact provided data - nothing breaks.

> Note: GitHub's REST API does not expose the contribution calendar. The
> heatmap is decorative by default; to make it truly live, query the GitHub
> GraphQL `contributionsCollection` (needs a token) or a service like
> `github-contributions-api`, then feed it into the grid in `app/page.tsx`.

## Video optimization

Compress `hero-neural-network.mp4` before shipping:

```bash
ffmpeg -i raw.mp4 -vcodec libx264 -crf 26 -preset slow -an \
  -movflags +faststart -vf "scale=1280:-2" hero-neural-network.mp4
# optional modern codec
ffmpeg -i raw.mp4 -c:v libvpx-vp9 -crf 33 -b:v 0 -an hero-neural-network.webm
```

Keep it muted + `playsInline` (already set) so it autoplays on mobile.

## Deploy to GCP - recommendation

**Recommended: Cloud Run (containerized SSR).**

Why Cloud Run over static export here:
- The site has a server API route (`/api/github`) for **live** stats with
  hourly revalidation and a secret `GITHUB_TOKEN`. A pure static export
  (`output: 'export'`) cannot run server code or keep the token server-side.
- Cloud Run scales to zero (cheap for a portfolio), gives a clean HTTPS URL,
  and supports Next.js image optimization and ISR.
- Put Cloud CDN in front for edge caching of static assets + the video.

```dockerfile
# Dockerfile
FROM node:20-slim AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci
FROM node:20-slim AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build
FROM node:20-slim AS run
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
gcloud run deploy sudhanshu-portfolio \
  --source . --region asia-south1 \
  --allow-unauthenticated \
  --set-env-vars GITHUB_TOKEN=ghp_xxx
```

**Alternative: static export -> Cloud Storage + Cloud CDN.**
Cheapest and simplest, but you lose the live server API. If you go this route,
set `output: 'export'` in `next.config.mjs`, drop `app/api`, and hardcode the
GitHub numbers (or fetch client-side against the public API with no token,
accepting the 60 req/hr unauthenticated limit).

## Accessibility & performance notes

- `prefers-reduced-motion` respected everywhere (hero pre-expands, spine and
  cursor disable, reveals show instantly).
- Custom cursor only activates on fine pointers; content never depends on JS
  to be visible.
- DottedSurface reduces particle count on mobile for frame rate.
- Semantic HTML, visible focus states, `aria-current` on the active nav item.

## Structure

```
app/
  layout.tsx        fonts, theme, dotted surface, cursor, SEO/OG metadata
  page.tsx          full single-page composition
  globals.css       tokens, cursor + card-glow styles
  api/github/route.ts   live repo stats (revalidated hourly)
components/
  ui/dotted-surface.tsx     recolored three.js ambient background
  ui/anime-navbar.tsx       glass pill nav (mascot stripped -> glow+underline)
  blocks/scroll-expansion-hero.tsx   hero scroll-expand (video)
  telemetry-spine.tsx       signature scroll element
  custom-cursor.tsx         cursor dot + trailing ring
  reveal.tsx                staggered scroll reveals
  theme-provider.tsx
lib/utils.ts        cn() helper
```
