# Themis

**Live demo:** https://v0-themis-2oql9fyes-julians-projects-88b4abf6.vercel.app/

AI moves fast. Themis keeps it accountable.

Themis is an AI deployment risk assessment tool that takes your idea and stress tests it against the frameworks that matter; EU AI Act, NIST AI RMF, ISO 42001, and Anthropic's own safety guidelines. Describe what you're building, answer a few questions, and get back a full risk profile: flagged violations, applicable regulations, control recommendations, engineering requirements, and knowledge base files ready to drop into a RAG pipeline.

Built for AI builders who want to ship responsibly.

---

## Why I built this

Most AI governance tools are either enterprise software behind a sales call or static checklists that don't adapt to what you're actually building. I wanted something that reasons about your specific deployment, not a generic rubric.

This is also a personal project at the intersection of my background in GRC and my interest in AI safety. The goal was to build something genuinely useful, not just a portfolio checkbox.

---

## What it does

- Guided intake flow that collects your deployment context
- Claude-powered risk analysis mapped to real regulatory frameworks
- Dashboard with past assessments, toggleable via sidebar
- Downloadable `.md` knowledge base files ready for RAG pipelines or compliance repos

---

## Stack

- Next.js + TypeScript
- Tailwind CSS + shadcn/ui
- Framer Motion
- Anthropic Claude API (`claude-sonnet-4-6`)

---

## Running locally

```bash
git clone https://github.com/julianyue/themis
cd themis
npm install
```

Add your Anthropic API key to `.env.local`:

ANTHROPIC_API_KEY=your_key_here

Then:

```bash
npm run dev
```

Open `http://localhost:3000`

---

## Frameworks covered

- EU AI Act
- NIST AI RMF
- ISO 42001
- Anthropic Usage Guidelines
