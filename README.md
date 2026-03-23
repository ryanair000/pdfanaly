# MvpGen Kenya

> AI-powered MVP business plan generator for Kenyan youth.
> Enter your business idea → get a full, printable plan in seconds. No signup. No jargon.

---

## Features

- **Landing page** — username-only login, 10 example idea cards (auto-fill the form)
- **11-field form** — guided inputs with progress bar and validation
- **AI plan generation** — powered by Claude Opus (Anthropic) with Kenya-specific context
- **Results page** — viability scores, full MVP table, go-to-market, risks, next steps
- **PDF download** — one-click export via html2pdf.js
- **Edit & Regenerate** — update inputs and get a new plan instantly

---

## Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | React 19 + Vite + Tailwind CSS v4 |
| State     | Zustand (with localStorage)       |
| Routing   | React Router v7                   |
| Backend   | Node.js + Express                 |
| AI        | Anthropic Claude Opus (`claude-opus-4-6`) |
| PDF       | html2pdf.js                       |

---

## Getting Started

### 1. Clone & install

```bash
git clone <repo-url>
cd pdfanaly
npm install
cd server && npm install && cd ..
```

### 2. Set up your API key

```bash
cp .env.example .env
# Edit .env and add your Anthropic API key:
# ANTHROPIC_API_KEY=sk-ant-...
```

### 3. Run (frontend + backend together)

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

---

## Project Structure

```
pdfanaly/
├── src/
│   ├── pages/
│   │   ├── Landing.jsx        # Home page with login + example cards
│   │   ├── Form.jsx           # 11-field business idea form
│   │   └── Results.jsx        # MVP plan display + PDF download
│   ├── components/
│   │   ├── PlanTable.jsx      # Full plan breakdown table
│   │   ├── PdfSummary.jsx     # Hidden element rendered as PDF
│   │   └── ScoreBar.jsx       # Animated score bar component
│   ├── data/
│   │   └── examples.js        # 10 example business ideas
│   ├── store.js               # Zustand global state
│   ├── App.jsx                # Routes
│   └── main.jsx               # Entry point
├── server/
│   ├── index.js               # Express API + Claude prompt
│   └── package.json
├── .env.example
└── package.json
```

---

## API

### `POST /api/generate`

**Body:**
```json
{
  "username": "Amina",
  "businessIdea": "Sell home-cooked meals via WhatsApp",
  "category": "product",
  "businessType": "physical",
  "targetCustomer": "Campus students...",
  "problemSolved": "Affordable food near campus is scarce...",
  "solution": "Cook daily and deliver via bodaboda...",
  "budget": "5000",
  "skills": "Cooking, smartphone, WhatsApp contacts",
  "timeline": "1week",
  "pricingIdea": "KSh 150 per meal"
}
```

**Response:** Full MVP plan JSON object including scores, timeline, marketing channels, risks, and next steps.

**Rate limit:** 10 requests per username per 24 hours.

---

## Environment Variables

| Variable            | Required | Description                    |
|---------------------|----------|--------------------------------|
| `ANTHROPIC_API_KEY` | Yes      | Your Anthropic API key         |
| `PORT`              | No       | API port (default: `3001`)     |

---

## License

MIT — Free for everyone, built for Kenyan youth.
