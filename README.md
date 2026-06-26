# ✦ Driftspace

An immersive, AI-powered space learning platform built with Next.js 14. Explore 20 topics across 5 pillars of astrophysics — from the Solar System to Cosmology — through structured AI briefings, streaming chat, animated diagrams, and a real-observatory globe.

## Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **AI:** [Cohere](https://cohere.com) — `command-r-plus` model
- **3D Visuals:** Three.js (CelestialSphereShader)
- **Globe:** MapLibre GL via mapcn-map-arc
- **State:** Zustand

## Getting Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Add your Cohere API key**

   Create or edit `.env.local`:

   ```env
   COHERE_API_KEY=your_cohere_api_key_here
   ```

   Get a key at [dashboard.cohere.com](https://dashboard.cohere.com).

3. **Start the dev server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Pages

| Route | Description |
|---|---|
| `/` | Hero with typewriter search + constellation roadmap |
| `/topic/[slug]` | AI deep-dive: briefing, diagram, observatory globe, chat |
| `/begin` | Spark-based beginner onboarding → personalized 5-topic path |
| `/explore` | Physics force-simulation canvas of all 20 topics |

## AI Routes

| Endpoint | Purpose | Cohere call |
|---|---|---|
| `POST /api/ai/briefing` | Structured JSON briefing for a topic | `co.chat()` |
| `POST /api/ai/chat` | Streaming conversation panel | `co.chatStream()` |
| `POST /api/ai/search` | Natural language → topic slug | `co.chat()` |
| `POST /api/ai/teaser` | 3-sentence sidebar teaser | `co.chat()` |
| `POST /api/ai/beginner-path` | Spark → 5-topic learning path | `co.chat()` |

## Topics

20 topics across 5 pillars: **Solar System**, **Stars**, **Galaxies**, **Black Holes**, **Cosmology**.

## Build

```bash
npm run build
```
