# StudyPlan AI

An AI-powered study planner that turns your syllabus into a personalized study schedule with flashcards, quizzes, and a chat tutor. Built with NVIDIA Nemotron models on Nebius Token Factory.

## What it does

1. **Paste your syllabus** — course outline, topic list, or any study material
2. **Set your exam date** — the AI builds a day-by-day schedule
3. **Browse topics** — see all extracted topics with difficulty levels and time estimates
4. **Flashcards** — AI generates flashcards for any topic on demand
5. **Quiz mode** — 5-question MCQ quizzes with explanations, scored instantly
6. **Chat tutor** — ask anything about your study material

## NVIDIA Nemotron Models Used

| Model | Used For |
|-------|----------|
| **Nemotron Super (49B)** | Syllabus analysis, study plan generation — needs strong reasoning |
| **Nemotron Nano (8B)** | Flashcards, quizzes, chat — fast responses, low cost |

All models are accessed via **Nebius Token Factory** using the OpenAI-compatible API.

## Tech Stack

- **Next.js 16** (App Router) + TypeScript + Tailwind CSS
- **Nebius Token Factory** — OpenAI-compatible API for NVIDIA Nemotron models
- **localStorage** — client-side persistence for study plans and progress
- **Vercel** — deployment

## Getting Started

```bash
# Clone the repo
git clone https://github.com/jasonjose007/smart-study-planner.git
cd smart-study-planner

# Install dependencies
npm install

# Set up your Nebius API key
cp .env.example .env.local
# Edit .env.local and add your key from https://tokenfactory.nebius.com

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEBIUS_API_KEY` | Yes | API key from [Nebius Token Factory](https://tokenfactory.nebius.com) |

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Home — syllabus input
│   ├── plan/page.tsx         # Study plan calendar
│   ├── topics/page.tsx       # Topic list with flashcards/quiz
│   ├── quiz/page.tsx         # Quiz topic picker
│   ├── chat/page.tsx         # AI chat tutor
│   └── api/
│       ├── analyze/route.ts  # Syllabus → study plan (Nemotron Super)
│       ├── flashcards/route.ts # Topic → flashcards (Nemotron Nano)
│       ├── quiz/route.ts     # Topic → MCQ quiz (Nemotron Nano)
│       └── chat/route.ts     # Chat completion (Nemotron Nano)
├── components/               # UI components
└── lib/
    ├── nebius.ts             # Nebius Token Factory API client
    ├── prompts.ts            # AI prompt templates
    ├── storage.ts            # localStorage helpers
    └── types.ts              # TypeScript types
```

## Nebius Token Factory Integration

The app uses the OpenAI-compatible API at `api.tokenfactory.nebius.com/v1/`. The `nebius.ts` client is a drop-in replacement — just the base URL and model names change:

```typescript
const res = await fetch("https://api.tokenfactory.nebius.com/v1/chat/completions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.NEBIUS_API_KEY}`,
  },
  body: JSON.stringify({
    model: "nvidia/Llama-3.3-Nemotron-Super-49B-v1",
    messages: [{ role: "user", content: "..." }],
  }),
});
```

## Feedback on Nebius Token Factory

- The OpenAI-compatible API made integration effortless — swapped the base URL and model names, everything worked
- Model selection (Ultra for reasoning, Nano for fast calls) lets you balance quality vs. cost effectively
- Token Factory's playground was useful for testing prompts before integrating

## Privacy

All study data stays in your browser's localStorage. The only external call is to Nebius Token Factory for AI responses. No analytics, no database, no tracking.
