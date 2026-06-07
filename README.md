# L'Expert Français

A personal local French learning app inspired by Kwiziq-style grammar tracking, Quizlet-style vocabulary practice, and focused conjugation drills.

## Run

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

`npm run dev` starts:

- Vite web app on `http://localhost:5173`
- Optional AI proxy on `http://localhost:8787`

## Optional AI

Copy `.env.example` to `.env` and fill the provider values you want:

- `OLLAMA_HOST`
- `GROQ_API_KEY`
- `GEMINI_API_KEY`
- `AI_PROVIDER`
- `AI_MODEL`

The app works without AI enabled.

## Checks

```bash
npm run lint
npm run build
```
