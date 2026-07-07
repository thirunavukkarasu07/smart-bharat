# 🇮🇳 Smart Bharat — AI-Powered Civic Companion

> Government services, made simple — in your language.

**Smart Bharat** is a GenAI-powered civic platform that helps every Indian citizen access government services, find schemes they qualify for, and report public issues — through one intelligent AI companion that speaks **Hindi, Tamil, and English**.

Built for **Devengers PromptWars 2026** · Powered by **Google Gemini**.

🔗 **Live Demo:** <!-- paste your Vercel URL here -->

---

## ✨ Features

### 🗣️ Civic AI Chat
Ask anything about government services — ration cards, PAN, applications, complaints — in **Hindi, Tamil, or English**, and get a simple, structured answer (what it is → who's eligible → documents needed → where to apply). Every answer includes a verify-on-official-portal note for responsible, transparent AI.

### 📋 Scheme & Document Finder
Describe your situation (age, occupation, income, state) and instantly get **personalized, real government schemes** you qualify for — with eligibility reasons, benefits, an exact document checklist, and the official application portal.

### 📢 Report a Civic Issue (AI Triage)
Describe a public problem (pothole, water leak, streetlight) and the AI **auto-categorizes it, assigns the responsible department, sets a priority, and issues a tracking ID** (e.g. `SB-2026-9491`). Complaints are saved so citizens can track their history.

---

## 🎯 How it maps to the challenge

| Challenge requirement | How Smart Bharat delivers |
|---|---|
| Simplify complex govt information | AI rewrites bureaucratic info into plain, step-by-step guidance |
| Answer citizen queries | Conversational Civic AI Chat |
| Recommend relevant public services | Scheme & Document Finder |
| Assist with document requirements | Per-scheme document checklists |
| Track complaints | Issue triage + tracking IDs + history |
| Multilingual support | Native Hindi, Tamil & English |
| Transparency & digital inclusion | Verify-source disclaimers + language accessibility |

---

## 🛠️ Tech Stack

- **Next.js (App Router) + TypeScript**
- **Tailwind CSS**
- **Google Gemini API** (`gemini-2.5-flash`)
- **Vercel** (deployment)

---

## 🚀 Run locally

```bash
git clone https://github.com/<your-username>/smart-bharat.git
cd smart-bharat
npm install
```

Create a `.env.local` file:
```
GEMINI_API_KEY=your_google_ai_studio_key
```

Then:
```bash
npm run dev
```
Open http://localhost:3000

---

## 🧠 Architecture

A single API route (`/api/ai`) powers all three features via a `mode` parameter (`chat` | `scheme` | `issue`), each backed by a purpose-built Gemini system prompt in `src/lib/prompts.ts`. The API key stays server-side and is never exposed to the client.

---

*Built with ❤️ for a more accessible, transparent, and digitally inclusive Bharat.*
