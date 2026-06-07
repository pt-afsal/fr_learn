# French Path — Local A1 → B1 Learning Companion

French Path is a redesigned, offline-first French-learning application for personal use. It keeps the original curriculum content and reorganizes it into a guided daily experience. The application stores progress locally in the browser and optionally connects to a local Ollama model for additional explanations, generated exercises, writing feedback, and pronunciation-practice advice.

## Main features

- First-launch onboarding for A1, A2, or B1.
- Optional short placement test.
- Monday-to-Sunday availability editor with rest days and study sessions from 15 minutes to 4 hours.
- Deterministic weekly planner: the same weekly plan stays stable when you reload the page.
- Target selection: A1 → A2, A2 → B1, and B1 → B1 mastery.
- Daily guided session with grammar, vocabulary, conjugation, reading, writing, pronunciation, and weekly review tasks.
- Existing grammar topics, vocabulary decks, verb content, reading material, and writing prompts preserved.
- Detailed grammar guides for all 58 visible A1, A2, and B1 topics. Each guide includes an overview, learning goals, formation and usage rules, examples with audio, common mistakes, and a memory tip.
- A manual 10-question quiz can be launched directly from every grammar topic. Each completed quiz offers a result summary and the option to start another set.
- 100 additional offline reading-comprehension sets: 30 A1, 35 A2, and 35 B1. These are deterministic template-derived exercises so the app remains useful without AI.
- Vocabulary spaced repetition with `Again`, `Difficult`, `Good`, and `Easy` review ratings.
- Local progress history using IndexedDB through Dexie.
- JSON backup export and import.
- Local Ollama integration with structured JSON responses and separate endpoints for:
  - simplified grammar explanations;
  - generated reading comprehension;
  - short AI practice sets;
  - writing correction and scoring;
  - pronunciation-practice advice.
- Browser speech recognition and French text-to-speech for the first pronunciation module.

## Grammar lessons and manual quizzes

Open **Learn → Grammar**, then select any A1, A2, or B1 topic from the left panel. The detailed lesson appears on the right. Select:

```text
Start manual quiz · 10 questions
```

A manual set always contains 10 questions for the selected topic. Your grammar confidence score is updated after every answer. At the end, you can review your result, close the quiz, or immediately start another 10-question set.

---

## Important pronunciation note

The pronunciation module compares an expected phrase with the browser's speech-to-text transcription. This is useful for repetition practice, but it is not a phoneme-level diagnosis. A future upgrade can add a local speech model such as Whisper for more control.

---

## Requirements

Install:

1. **Node.js 20 or newer**. Node.js 22 was used to validate the bundled project.
2. **npm**, which is included with Node.js.
3. **Ollama** only if you want the optional local AI features.

The application still works without Ollama: the curriculum, daily planning, flashcards, conjugation, offline reading bank, writing drafts, pronunciation transcription comparison, progress tracking, and backups remain available.

---

## Fast start on Windows

Double-click:

```text
RUN_WINDOWS.bat
```

The script installs dependencies when needed, builds the project, opens the local app in your default browser, and starts the local server.

To enable Ollama AI features, install Ollama separately and pull the configured model before opening the app:

```powershell
ollama pull gemma4:e2b-it-q4_K_M
```

The default Ollama endpoint is:

```text
http://localhost:11434
```

You can change the model tag inside **Settings → Local Ollama assistant**.

---

## Fast start on Linux or macOS

Open a terminal inside this folder and run:

```bash
chmod +x run-linux-macos.sh
./run-linux-macos.sh
```

To enable Ollama AI features:

```bash
ollama pull gemma4:e2b-it-q4_K_M
```

---

## Manual installation and run

From the project folder:

```bash
npm ci
npm run build
npm start
```

Then open:

```text
http://localhost:8787
```

For development mode with automatic reload:

```bash
npm ci
npm run dev
```

Then open:

```text
http://localhost:5173
```

---

## Ollama setup

Ollama must be running locally before you enable the AI integration in the app.

Pull the default lightweight Gemma 4 quantized model:

```bash
ollama pull gemma4:e2b-it-q4_K_M
```

You can verify Ollama separately:

```bash
ollama list
```

Inside French Path:

1. Open **Settings**.
2. Enable **Ollama integration**.
3. Keep the default host `http://localhost:11434`.
4. Enter an installed model tag.
5. Click **Check connection**.
6. Click **Send test prompt**.
7. Save the settings.

The bundled proxy accepts local Ollama hosts by default. This is intentional. To allow a trusted remote Ollama host, start the app with:

```bash
ALLOW_REMOTE_OLLAMA=true npm start
```

Use remote access only when you understand the privacy and network implications.

---

## App structure

```text
src/
  App.tsx                      Main interface and exercise workspaces
  App.css                      Clean responsive design
  grammarGuides.ts             Detailed grammar guides and common mistakes
  db.ts                        IndexedDB persistence and migrations
  types.ts                     Shared data types
  features/
    planner.ts                 Deterministic weekly planner
    contentRegistry.ts         Unified reading and writing registry
    readingBank.ts             100 offline reading-comprehension sets
  services/
    ai.ts                      Browser calls to the local AI proxy
  ...                          Preserved original curriculum files

server/
  index.ts                     Express server and Ollama proxy endpoints
```

---

## Available commands

```bash
npm run dev       # Run Vite and the local server together for development
npm run check     # Run strict TypeScript checks
npm run build     # Validate and create the production build in dist/
npm start         # Serve the production build on http://localhost:8787
npm run preview   # Preview only the Vite production bundle
```

---

## Local data and backups

Progress is saved in the browser's IndexedDB storage. It is not automatically synchronized between browsers or computers.

Use **Settings → Export JSON backup** regularly. On another computer or browser, use **Import backup** to restore your progress.

Resetting progress clears activity history and returns the application to onboarding while preserving the base curriculum.

---

## Troubleshooting

### The browser page does not open

Run:

```bash
npm start
```

Then manually open:

```text
http://localhost:8787
```

### Ollama connection check fails

Confirm that Ollama is installed and running:

```bash
ollama list
```

Then confirm the model tag entered in Settings exactly matches an installed model.

### The requested model is not installed

Run:

```bash
ollama pull gemma4:e2b-it-q4_K_M
```

Or enter another installed Ollama model tag in Settings.

### Microphone recognition does not work

Browser speech recognition support varies. Chromium-based browsers usually provide the best experience. You can type or edit the recognized text manually as a fallback.

### Port 8787 is already in use

Start the production server on another port:

```bash
PORT=8790 npm start
```

Then open:

```text
http://localhost:8790
```

On Windows PowerShell:

```powershell
$env:PORT=8790
npm start
```

---

## Validation performed before packaging

The package was checked with:

```bash
npm run check
npm run build
```

The built server was also started and verified through:

```text
GET /api/health
```

which returned a successful response.
