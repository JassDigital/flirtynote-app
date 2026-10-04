# FlirtyNote.ai — v2.0

A polished personal note studio built with Next.js, React, TypeScript and Tailwind CSS.

## Features
- AI-assisted note generation with Mistral
- Six writing tones and eight occasions
- Short / Medium / Long controls
- Multiple card themes and typography styles
- Optional recipient and signature
- Live shareable card preview
- PNG card export
- Copy to clipboard
- WhatsApp sharing
- Saved notes/history using browser localStorage
- Surprise Me mode
- Responsive mobile/desktop UI
- Graceful local fallback when the AI API is unavailable
- No server-side persistence of saved notes

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000.

For AI generation, configure `MISTRAL_API_KEY` and optionally `MISTRAL_MODEL` in `.env.local`.
