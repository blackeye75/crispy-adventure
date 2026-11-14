# Fretkey — Architecture and Development Blueprint

Save this file as `docs/BLUEPRINT.md` in the repo. `CLAUDE.md` points to it.

## 1. Product in one paragraph

A subscription app that teaches music theory from zero to advanced through guitar and piano. Each lesson runs **Understand → Listen → Learn → Practice**. Theory is taught once and shown on whichever instrument the learner picks, so a guitarist and a pianist follow the same path. Daily review keeps earlier material fresh. Web first, then Android and iOS on the same backend.

**What makes it worth paying for**

- Theory is always tied to sound and to the instrument, never abstract.
- An interactive fretboard and keyboard that look and sound excellent.
- A single clear path, so the learner never wonders what to study next.
- Smart review that brings back exactly what the learner is about to forget.
- Depth: it keeps going into modes, voice leading and jazz harmony, so experienced players stay.

## 2. System architecture

```
            Browser / PWA                     (later) Expo app: Android + iOS
                 │                                        │
                 └──────────────┬─────────────────────────┘
                                │  HTTPS, JSON
                     Next.js on Vercel
        ┌────────────────────────────────────────────────┐
        │ App Router pages (Server + Client Components)  │
        │ Route Handlers  /api/v1/*   (thin controllers) │
        │ Services        src/server/services            │
        │ Core            src/core  (pure TS, shared)    │
        └───────┬───────────────┬───────────────┬────────┘
                │               │               │
         MongoDB Atlas     Razorpay        Object storage + CDN
         (Mumbai region)   Subscriptions   (audio samples, images)
                           + webhooks
```

**Layers**

| Layer | Location | Responsibility |
|---|---|---|
| UI | `src/app`, `src/features`, `src/components` | Pages, lesson player, instruments, drills |
| API | `src/app/api/v1` | Validate input, check session and entitlement, call a service |
| Services | `src/server/services` | Progress, review scheduling, billing, content access |
| Data | `src/server/db` | Mongoose models, connection |
| Core | `src/core` | Theory engine, instrument geometry, review algorithm, Zod schemas |

`src/core` has no framework imports. When the mobile app starts, move it into a shared package unchanged.

## 3. Tech choices and why

| Need | Choice | Reason |
|---|---|---|
| Framework | Next.js 16 (App Router) | Your requirement; pages and API in one deploy |
| API | Next.js Route Handlers | Your requirement; versioned REST that mobile can call |
| Database | MongoDB Atlas + Mongoose | Your requirement; lesson documents fit a document store |
| Auth | Better Auth + Mongo adapter | Works with MongoDB and has an Expo plugin for mobile |
| Payments | Razorpay Subscriptions | UPI Autopay and cards in one integration for India |
| Theory maths | `tonal` | Reliable note, interval, scale and chord calculations |
| Audio | Tone.js + sampled guitar and piano | Real instrument sound, precise timing |
| Notation | VexFlow (lazy-loaded) | Staff notation where a lesson needs it |
| UI | Tailwind, shadcn/ui, Motion | Fast to build, easy to make consistent and polished |
| Client data | TanStack Query | Caching and optimistic progress updates |
| Hosting | Vercel + Atlas + a CDN bucket | Low ops for a solo builder |
| Monitoring | Sentry + a privacy-friendly analytics tool | See errors and where learners drop off |

## 4. Data model (MongoDB collections)

Better Auth creates and owns `user`, `session`, `account`, `verification`. App collections:

**profiles** — one per user
```
userId, displayName, instrument: "guitar" | "piano", leftHanded: bool,
noteNaming: "letters" | "solfege", level: "beginner" | "intermediate" | "advanced",
dailyGoalMinutes, streak: { current, longest, lastActiveDate }, timezone
```

**subscriptions** — one per user
```
userId, provider: "razorpay", providerSubscriptionId, providerCustomerId,
plan: "monthly" | "yearly", status: "none" | "trialing" | "active" | "past_due" | "cancelled" | "expired",
currentPeriodEnd, cancelAtPeriodEnd
```

**paymentEvents** — webhook log, used for idempotency
```
providerEventId (unique), type, payload, processedAt
```

**tracks → modules → lessons** — content, written by the seed script only
```
tracks:  slug, title, order, description
modules: slug, trackSlug, title, order, summary, isFree
lessons: slug, moduleSlug, title, order, minutes, isFree, version,
         concepts: [conceptId], steps: [Step]
```

A `Step` is `{ kind: "understand" | "listen" | "learn" | "practice", blocks: [Block] }`.
A `Block` is a typed unit; the lesson player has one renderer per type:

| Block type | Purpose |
|---|---|
| `text` | Short explanation (markdown) |
| `audio` | Play notes, an interval, a chord, a progression or a rhythm, defined as data |
| `instrument` | Show notes on fretboard and keyboard; optional guitar-only or piano-only variant |
| `notation` | Staff snippet |
| `quiz-choice` | Multiple choice |
| `quiz-ear` | Hear it, identify it |
| `quiz-find` | Tap the right note(s) on the fretboard or keyboard |
| `quiz-build` | Build a scale or chord by tapping notes |
| `play-along` | Backing track with a tempo control and on-screen guide |
| `video`, `tab`, `strum-pattern`, `picking-pattern`, `hands` | Technique lessons; defined in `docs/PLAYING.md` |

Lessons also carry `track` (theory or a playing track such as `guitar-strumming`), `stage` (basic, intermediate, advanced) and `needs: [lessonSlug]` so the app can unlock technique stages when the required theory is complete.

Audio is defined as data (for example `{ type: "chord", notes: ["C4","E4","G4"] }`) and synthesised from samples, so lessons need no recorded files.

**lessonProgress**
```
userId, lessonSlug, status: "started" | "completed", stepIndex, score, attempts,
completedAt        index: { userId, lessonSlug } unique
```

**reviewItems** — spaced repetition, one per user per concept
```
userId, conceptId, ease, intervalDays, dueAt, lapses, lastResult
index: { userId, dueAt }
```

**practiceSessions**
```
userId, date, minutes, lessonsCompleted, drillsAnswered, accuracy
```

## 5. API surface (`/api/v1`)

| Method and path | Purpose | Access |
|---|---|---|
| `/api/auth/*` | Better Auth handler | public |
| `GET /me` | Profile, subscription status, streak | signed in |
| `PATCH /me` | Update instrument and preferences | signed in |
| `GET /tracks` | Full path with locked/unlocked flags and progress | public (progress if signed in) |
| `GET /lessons/:slug` | Lesson content | free lessons: signed in; paid: subscriber |
| `POST /progress` | Save step or completion; creates review items | signed in |
| `GET /review/due` | Today's review drills | subscriber |
| `POST /review/answer` | Record result, reschedule | subscriber |
| `GET /stats` | Streak, minutes, accuracy, mastery by topic | signed in |
| `POST /billing/subscribe` | Create Razorpay subscription, return checkout details | signed in |
| `POST /billing/cancel` | Cancel at period end | subscriber |
| `POST /billing/webhook` | Razorpay events; verify signature, idempotent | Razorpay only |

All inputs are validated with Zod schemas from `src/core/schemas`, which the mobile app will import too.

## 6. Screens

- **Landing** — hero with a playable fretboard/keyboard demo, the path, pricing, sign-up.
- **Onboarding** — pick instrument, level and daily goal; a 2-minute placement quiz skips known material.
- **Home** — "Continue" card, today's review count, streak, daily goal ring.
- **Path** — the whole curriculum as a map; locked, available and mastered states.
- **Lesson player** — full-screen, four-step progress bar, instrument toggle, one action per screen.
- **Review** — a quick mixed drill session of due items.
- **Practice room** — the Theory Canvas (linked fretboard, keyboard and theory panel; full spec in `docs/CANVAS.md`), plus metronome and ear trainer.
- **Progress** — mastery by topic, accuracy trends, practice history.
- **Settings and billing** — preferences, plan, cancel.

## 7. Curriculum outline

This is the summary. The full lesson-by-lesson list for theory, guitar, piano, ear and rhythm, with reference tables, is in `docs/CURRICULUM.md`. Each module has roughly 5–8 lessons. Level 1 is free.

| Level | Modules |
|---|---|
| 1. Foundations (free) | Sound and pitch · The musical alphabet · Finding notes on your instrument · Beat, tempo and basic rhythm |
| 2. Building blocks | Half steps and whole steps · Intervals by sight and by ear · The major scale · Keys and key signatures · Circle of fifths |
| 3. Harmony basics | Triads · Chords of a key · Common progressions · Minor scales and minor keys · Rhythm II: subdivisions, syncopation |
| 4. Fluency on the instrument | Pentatonic scales · Guitar: CAGED and full-neck scales / Piano: inversions and hand positions · Seventh chords · Chord tones and melody |
| 5. Colour and movement | Modes · Secondary dominants · Borrowed chords · Voice leading · Extended chords |
| 6. Advanced | Jazz harmony and ii–V–I · Substitutions and reharmonisation · Melodic and harmonic minor modes · Improvisation strategy · Analysing real songs |

Alongside theory run the **playing tracks** in `docs/PLAYING.md`: guitar strumming, lead and solos, and fingerstyle; piano accompaniment, melody and solos, and solo piano; and musicianship for both. Each has basic, intermediate and advanced stages tied to the theory levels.

Your experience is most valuable in levels 4–6; that is where the product earns long-term subscribers.

## 8. Build phases

Tick tasks as they complete. Each phase ends in something you can use.

### Phase 0 — Setup (about 1 week)
- [x] Create Next.js 16 app, TypeScript strict, Tailwind, shadcn/ui, ESLint, Vitest, Playwright
- [x] Folder structure from `CLAUDE.md`; `.env.example`
- [ ] MongoDB Atlas cluster and connection helper
- [x] Design tokens, fonts, dark and light themes, base components
- [ ] Deploy an empty shell to Vercel

### Phase 1 — Core engine and instruments (about 2 weeks)
- [x] `src/core/theory`: notes, intervals, scales, chords, keys, with tests
- [x] `src/core/instruments`: fretboard mapping (any tuning, left-handed) and keyboard mapping, with tests
- [x] `Fretboard` SVG component: highlight, label, tap, responsive
- [x] `Keyboard` SVG component with the same props
- [ ] Audio engine: load samples, play note, chord, sequence, metronome
- [x] `resolveCanvas` in `src/core/instruments`: one `CanvasState` in, markers for both instruments out, with tests
- [ ] Theory Canvas page per `docs/CANVAS.md`: control bar, linked fretboard and keyboard, theory panel, transport; passes its acceptance checklist

*Milestone: a free tool worth sharing publicly to test interest.*

### Phase 2 — Lessons (about 2 weeks)
- [x] Zod content schemas and the `npm run seed` script
- [x] Lesson player with the four steps and all block renderers
- [x] Drill types: choice, ear, find, build
- [x] Write Level 1 completely and the first module of Level 2
- [x] Path page and Home page

### Phase 3 — Accounts and progress (about 1 week)
- [x] Better Auth: email and Google sign-in
- [x] Onboarding and placement quiz
- [x] Progress saving, streaks, daily goal
- [x] Spaced-repetition engine in `src/core/review` and the Review screen

### Phase 4 — Subscription (about 1 week)
- [x] Razorpay plans (monthly, yearly), checkout, webhook with signature check
- [x] Server-side entitlement checks on lessons and review
- [x] Paywall screen, billing settings, cancel flow
- [ ] Test the full cycle in Razorpay test mode: subscribe, renew, fail, cancel

### Phase 5 — Polish and launch (about 1–2 weeks)
- [x] Landing page with playable demo, pricing, SEO basics
- [x] PWA: installable, offline shell
- [x] Motion pass, empty states, error states, loading skeletons
- [x] Sentry, analytics, privacy policy, terms, refund policy
- [ ] Beta with 20–30 players; fix what they stumble on

### Phase 6 — After launch
- [x] Rest of Levels 2–6, released module by module
- [ ] Technique lane and blocks: `strum-pattern`, `tab`, `picking-pattern`, `hands`, `video` (see `docs/PLAYING.md`)
- [ ] Guitar strumming Basic and lead Basic stages, then fingerstyle Basic; piano tracks after
  - [x] Guitar strumming Basic (7 lessons; technique wording and demo videos await the owner)
  - [x] `tab` block and guitar lead Basic (9 lessons; same caveats)
  - [x] Picking patterns (tab with p i m a and 3/4) and guitar fingerstyle Basic (7 lessons; same caveats)
  - [x] `hands` block and piano accompaniment Basic (6 lessons; same caveats)
- [x] Tempo trainer and section looping (practice room: metronome, trainer, loop a range of chords; looping bars of written music in lessons is still open)
- [x] Play-along backing tracks (synth chords over a click, with chord display; real recorded tracks are still open)
- [ ] Piano: MIDI keyboard input (Web MIDI)
- [ ] Guitar: microphone single-note detection for "play this note" drills
- [ ] Indian note names (Sa Re Ga) and Hindi language option

### Phase 7 — Android and iOS
- [ ] Expo (React Native) app using the same `/api/v1` and `src/core`
- [ ] Better Auth Expo plugin for sign-in
- [ ] Native audio engine and instrument components
- [ ] Decide billing per store before building (see risks)

## 9. Risks to decide early

| Risk | What to do |
|---|---|
| **₹50 per month is very thin.** After payment fees and tax, 1,000 subscribers bring in under ₹50,000 a month. | Keep ₹50 as a launch price for India, add a yearly plan, and set a separate higher price for users outside India. Build pricing as configuration, not code. |
| **App stores usually require their own billing** for digital subscriptions and take a commission. | Launch the web app and PWA first. Check current Google Play and Apple rules for India before Phase 7 and price for the commission. |
| **Content is the real workload.** Six levels is roughly 150–200 lessons. | Launch with Levels 1–2, then publish a module every week or two. A steady release rhythm also keeps subscribers. |
| **Technique needs demo videos**, and piano footage needs a real pianist. | Film guitar demos yourself in batches; find a pianist partner or launch guitar technique first with piano theory only. Host video on a streaming service, not in the app bundle. |
| **Song licensing.** Popular songs, tabs and recordings are copyrighted. | Use original study pieces, original backing tracks and public-domain tunes. |
| **Audio on mobile browsers** is strict about user gestures and latency. | Test on real low-end Android phones from Phase 1, not at the end. |
| **Free theory videos are everywhere.** | Compete on interactivity, the single path and review, not on explanations. |

## 10. First prompts for Claude Code

1. "Read `CLAUDE.md` and `docs/BLUEPRINT.md`. Do Phase 0. Show me the plan before creating files."
2. "Implement `src/core/theory` with tests, per Phase 1. Ask me about any theory rule you are unsure of."
3. "Build the `Fretboard` component per the design rules, then a demo page showing the C major scale."

Work through one phase at a time and review each milestone on your own phone and guitar before moving on.
