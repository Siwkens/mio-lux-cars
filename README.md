# MIO LUX CARS

Premium landing page for a Warsaw luxury and sports car rental brand, built around an interactive cinematic HERO experience.

## Live preview

https://mio-lux-cars.aware-elf-6483.chatgpt.site

## Main features

- responsive premium black-and-red interface
- cinematic video HERO with automatic fallback poster
- interactive 360° Mustang presentation
- pointer, touch and keyboard controls
- fleet cards with pricing and vehicle details
- accessible reduced-motion fallback
- optimized MP4 and WebM media assets
- Cloudflare-compatible Vinext production build

## Technology

- React
- TypeScript
- Vinext / Vite
- CSS
- Cloudflare Workers
- Node.js 22+

## Local setup

```bash
npm ci
npm run dev
```

Production validation:

```bash
npm run build
npm test
```

## Project structure

- `app/` — page, layout and styling
- `public/hero-media/` — HERO video and poster assets
- `public/turntable/` — interactive 360° frames
- `public/cars/` — fleet imagery
- `scripts/` — verified install and build helpers
- `worker/` — Cloudflare Worker entrypoint

## Repository

Complete source code and production media for the MIO LUX CARS website.
