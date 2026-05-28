# Flowforge Landing Page Design Spec

**Date:** 2026-05-29
**Author:** CTO (Flowforge)
**Status:** Approved

---

## Section 1: Hero

**Background:** `#070A12` with radial glow (violet at center, fading). Dot grid texture overlay.

**Layout:** Two columns — 60% left content, 40% right animated canvas

**Left column:**
- Category label: `AI WORKFLOW BUILDER` — uppercase, tracking-widest, text-indigo-400, text-sm
- Headline: `Build automations visually.` — text-6xl, white, font-bold, leading-tight
- Subheadline: `Connect LLMs, APIs, webhooks, and logic on one canvas.` — text-xl, text-slate-400, mt-4
- CTAs: `Start building` (bg-indigo-600, white) + `View demo` (border-white/30, white)
- Trust line: `No code required · Free to start` — text-slate-500, text-sm, mt-4

**Right column:**
- Dark panel: `#0F172A`, border-slate-700, rounded-2xl, p-4
- Contains animated workflow canvas showing "Support Ticket Triage"
- Animated 10-second loop showing node execution

**10-second animation sequence:**
- 0.0s: Canvas fades in, all nodes visible at rest
- 2.0s: Webhook node pulses green — `Webhook received` badge
- 3.5s: LLM node border glows violet — `Classifying...` text
- 5.0s: LLM output appears — `urgent: true` label
- 6.0s: Condition node fires — amber edge pulses to true path
- 7.0s: HTTP node glows cyan — `POST api.slack.com/chat.postMessage`
- 8.0s: All nodes show green checkmark overlay
- 9.5s: Reset — loop

**Edge animation:** Pulsing dots traveling along edges from source to target. Color matches node that just fired.

**Background texture:** Faint dot grid at 20px intervals, opacity 0.08.

---

## Section 2: Templates

**Heading:** `Start with proven automations` — text-2xl, white, font-semibold, text-center

**Subheading:** `Pick a template and have a working workflow in minutes.` — text-slate-400, text-center, mt-2

**Grid:** 3 columns × 2 rows, gap-6

**Card (×6):**
- Background: `#0F172A`, border `border-slate-800`, rounded-2xl, p-5
- Hover: border-indigo-500/30, box-shadow glow-indigo-500/10
- Top: Template emoji + name (white, font-semibold, text-base)
- Middle: Mini node graph — horizontal line of 5-6 tiny colored circles (4px) connected by 2px lines. Each circle colored by node type (violet=LLM, cyan=HTTP, amber=condition, gray=webhook)
- Bottom: `Use template →` — text-indigo-400, text-sm, font-medium

**Template cards:**
1. 🔧 Support Ticket Triage — `Webhook → LLM → Condition → HTTP`
2. 📇 Lead Enrichment — `Form → LLM → HTTP → Email`
3. 📝 AI Content Summarizer — `Webhook → LLM → HTTP`
4. 💬 Slack Notifier — `Schedule → LLM → HTTP`
5. 📊 API Health Monitor — `Schedule → HTTP → Condition → Alert`
6. 📋 Form Submission Router — `Form → LLM → Condition → HTTP×2`

**Stock assets (free):**
- Unsplash: search `automation network dark`, `technology abstract dark`
- Pexels: search `workflow diagram abstract`, `technology connections dark`
- Use as subtle background texture behind template section — very low opacity

---

## Section 3: Canvas Section

**Heading:** `The canvas is the product.` — text-2xl, white, font-bold, text-center

**Subheading:** `Drag nodes, wire connections, watch your automation come alive.` — text-slate-400, text-center, mt-2

**Centered screenshot frame:**
- Browser chrome: three dots (red/yellow/green), URL bar `app.flowforge.io/editor/support-triage`
- Content: Light canvas (`#F8FAFC`) showing the editor with sidebar + canvas + inspector
- Frame: `rounded-2xl border border-slate-700`, shadow-2xl, max-w-5xl, mx-auto

**Below screenshot — 3 feature callouts in a row, text-center:**
| Icon | Label | Description |
|------|-------|-------------|
| 🔧 | `Drag-and-drop editor` | Snaps, zooms, pans — feels like Figma |
| ⚡ | `Run and observe` | Watch nodes execute in real time |
| 🔗 | `Webhook or manual trigger` | Live URL for every workflow |

Icon: small indigo circle with icon centered. Label: white bold. Description: text-slate-400.

---

## Section 4: CTA

**Background:** `#070A12` with radial violet glow at center, fading outward

**Layout:** Centered, py-24

**Heading:** `Ready to forge your first workflow?` — text-3xl, white, font-bold, text-center

**Subheading:** `Join teams building AI automations without writing a single line of code.` — text-slate-400, text-center, mt-3

**Buttons (centered, flex gap-4):**
- Primary: `Start building — free` — bg-indigo-600, white, px-8, py-4, rounded-xl, font-semibold
- Secondary: `Watch 2-min demo` — border-white/30, white, px-8, py-4, rounded-xl

**Below:** `No credit card required · 10k runs free per month` — text-slate-500, text-sm, text-center, mt-4

---

## GSAP Animation Specs

**Hero animation (canvas element):**
- Built with HTML Canvas API + GSAP for timeline control
- No video file — pure code animation, 10-second loop
- Nodes rendered as rounded rectangles with SVG-style edges (bezier curves)
- Each node has: icon, label, border glow on fire, checkmark overlay on complete

**Scroll trigger:**
- On scroll into viewport, hero animation starts
- Stays synced — scroll position controls animation progress for first 30% of page
- After scroll past hero, animation runs free on 10s loop

**Edge animation:**
- Dashed stroke-dashoffset animation — dots travel along bezier edges
- Speed: 800ms from source to target
- Color: gradient from source node color to target node color

**Node glow on execution:**
- box-shadow: `0 0 20px <node-color>` pulsing twice at 0.3s interval
- Border: `2px solid <node-color>` with opacity 0.8 → 1.0 → 0.8

---

## Free Asset Sources

| Asset | Source | Search Terms |
|-------|--------|-------------|
| Template section background | Pexels.com | `automation network dark`, `technology abstract dark` |
| Grid texture | Custom CSS | radial-gradient dot pattern |
| Node icons | Lucide icons (free) | sparkle, globe, git-branch, plug, zap |
| Brand photography | None needed | Hero is the product — no people shots |

---

## Color Palette

| Role | Hex | Usage |
|------|-----|-------|
| Background | `#070A12` | Page background, CTA section |
| Canvas bg | `#0F172A` | Cards, panels |
| Canvas light | `#F8FAFC` | Editor canvas surface |
| Border | `#1E293B` | Card borders, dividers |
| Primary | `#6366F1` | Indigo — CTAs, active states |
| Accent cyan | `#22D3EE` | HTTP node, active edges |
| Accent violet | `#A78BFA` | LLM node |
| Accent amber | `#F59E0B` | Condition node, warnings |
| Success | `#10B981` | Emerald — checkmarks |
| Text primary | `#F8FAFC` | Headlines |
| Text secondary | `#94A3B8` | Body text, descriptions |