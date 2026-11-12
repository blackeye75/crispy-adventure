# Fretkey — The Theory Canvas

Save as `docs/CANVAS.md`. The Canvas is the signature screen of the product: one clean view where a fretboard, a keyboard and a theory panel always show the same musical idea. It is used in three places: the Practice room (free exploration), inside lessons (the "Learn" step, pre-set by the lesson), and the landing-page demo.

## Goal

A learner should look at the screen for three seconds and know: what am I looking at, which notes are in it, which note is home, and how it sounds. If any element does not help answer those, it is removed.

## Layout

Desktop (≥ 1024px):

```
┌──────────────────────────────────────────────────────────────────────┐
│  Key: [C ▾] [Major ▾]     Show: Scale · Chord · Interval · Progression│
│                            Labels: Notes · Degrees · Intervals        │
├───────────────────────────────────────────────┬──────────────────────┤
│                                               │  C major scale       │
│   FRETBOARD  (full width, frets 0–15)         │  C D E F G A B       │
│                                               │  1 2 3 4 5 6 7       │
│                                               │  W W H W W W H       │
├───────────────────────────────────────────────┤                      │
│                                               │  "Seven notes. C is  │
│   KEYBOARD   (E2–E6)                          │   home."             │
│                                               │                      │
│                                               │  Chords in this key  │
│                                               │  C Dm Em F G Am B°   │
├───────────────────────────────────────────────┴──────────────────────┤
│   ▶ Play     ↻ Loop     ♩ 80 bpm     Up · Down · Chord      🔊        │
└──────────────────────────────────────────────────────────────────────┘
```

Mobile (< 768px): top bar collapses to one row of chips; fretboard (horizontal scroll with snap) above keyboard (horizontal scroll, auto-centred on the active octave); theory panel becomes a bottom sheet with a one-line summary always visible; transport bar is fixed at the bottom.

In a lesson, the top bar is hidden and the lesson controls what is shown; the learner can tap "Explore" to unlock it.

## The four parts

### 1. Control bar
- **Key:** root note (12 choices, spelled correctly for the key) and quality.
- **Show:** one mode at a time.
  - *Scale* — pick from the scale list in `CURRICULUM.md`.
  - *Chord* — pick quality; optional inversion.
  - *Interval* — root plus one other note.
  - *Progression* — a row of chords in the key; the active chord is highlighted as it plays.
- **Labels:** note names, scale degrees, or intervals from the root. One at a time.
- Secondary options sit behind one "View" menu: left-handed, tuning, fret range, show/hide all octaves, staff notation.

### 2. Fretboard
- Horizontal SVG, low E string at the bottom (standard diagram orientation), nut on the left; mirrored when left-handed.
- Fret markers at 3, 5, 7, 9, 12 (double), 15. Fret numbers under the board.
- Only notes in the current selection are drawn. Everything else is empty wood.
- Optional position window: a soft highlighted region (for example frets 5–8) with notes outside it dimmed, used for CAGED and position lessons.

### 3. Keyboard
- SVG, E2 to E6, octave labels on each C, middle C subtly marked.
- Same marker style and colours as the fretboard, so the eye links them without thinking.

### 4. Theory panel
Always in this order, each line short:
1. Name ("C major scale", "Am7", "Perfect fifth")
2. The notes
3. The degrees or formula
4. The step pattern (scales) or interval stack (chords)
5. One plain sentence about the sound or use
6. Related items as tappable chips (chords in the key, relative minor, parallel mode). Tapping one changes the whole canvas.
7. Small staff notation (optional, off by default for beginners)

### 5. Technique lane (optional, shown only when a lesson or tool needs it)
One lane between the instruments and the transport bar that shows *time*, left to right, with a moving playhead. It displays exactly one of:
- **Strum pattern** — beat grid with counts ("1 e & a"), down/up arrows, accents (bolder), mutes (×) and ghost strums (faint).
- **Tab** — guitar tablature with rhythm.
- **Picking pattern** — six string lines with p i m a on each plucked note.
- **Piano hands** — two rows, left and right, with finger numbers.

As the playhead crosses an event, the matching notes pulse on the fretboard or keyboard. On the instruments, fingers are shown as small labels (p i m a, or 1–5 with L/R), never as extra colours. Tempo, loop and slow-down apply to the lane. Hidden by default in free exploration so the screen stays clean.

## Linking behaviour (what removes the confusion)

- **One state, three views.** A single `CanvasState` drives fretboard, keyboard and panel. They can never disagree.
- **Hover or tap a note on either instrument:**
  - that exact pitch lights up on the other instrument (C4 on the keyboard ↔ every place C4 exists on the fretboard),
  - the same note in other octaves glows faintly,
  - the matching note and degree in the theory panel are underlined,
  - the note plays.
- **Tap a degree or note in the panel:** it pulses on both instruments.
- **Playback:** as each note sounds, its marker pulses on both instruments at the same moment, and the panel entry lights up. In Progression mode the chord tones change in time with the audio.
- **Changing key or selection:** markers slide/fade to new positions over 200ms rather than jumping, so the learner sees what changed.

## Visual rules

Three roles only; colour is never the only signal:

| Role | Look |
|---|---|
| Root / home note | Filled accent gold, slightly larger, always labelled |
| Chord tones (3rd, 5th, 7th) | Filled light neutral |
| Other scale notes | Outlined ring, no fill |
| Not in selection | Not drawn |
| Currently sounding | Soft glow + scale up 1.15× for the note's duration |

- No rainbow-per-note colouring by default. An optional "colour by interval" view can be added later, off by default.
- Background: deep neutral. Fretboard: dark, low-contrast wood tone with thin metallic fret lines. Keys: off-white and near-black with soft shadows, no heavy skeuomorphism.
- Labels inside markers: 12–13px, medium weight, high contrast. Use proper ♯ and ♭ glyphs.
- One accent colour across the whole screen. Generous padding. Nothing touches the edges.
- Motion 150–250ms, ease-out. Respect `prefers-reduced-motion` (swap movement for fades).
- 60fps on a mid-range Android phone. No canvas re-layout during playback; animate transform and opacity only.

## State and components

```ts
// src/core/schemas/canvas.ts  (pure, shared with mobile)
type CanvasState = {
  root: string;                       // "C", "F#", "Bb"
  show:
    | { kind: "scale"; scale: string }
    | { kind: "chord"; chord: string; inversion?: 0 | 1 | 2 | 3 }
    | { kind: "interval"; interval: string }
    | { kind: "progression"; numerals: string[]; activeIndex: number };
  labels: "notes" | "degrees" | "intervals";
  focusPitch?: string;                // "C4": hovered or playing
  position?: { fromFret: number; toFret: number };
  guitar: { tuning: string[]; frets: number; leftHanded: boolean };
  keyboard: { from: string; to: string };
};
```

- `src/core/instruments/resolveCanvas.ts` turns `CanvasState` into a list of `Marker { pitch, pitchClass, role, label }` plus fretboard positions and key indexes. Fully unit-tested.
- `features/canvas/TheoryCanvas.tsx` owns the state and layout.
- `features/fretboard/Fretboard.tsx` and `features/keyboard/Keyboard.tsx` are dumb renderers: they take markers and emit `onNoteHover` / `onNoteTap`.
- `features/canvas/TheoryPanel.tsx` renders the panel from the same resolved data.
- `features/audio` plays notes and reports the currently sounding pitch back into `focusPitch`.
- Canvas state is encoded in the URL (`/practice?root=C&scale=major`) so any view can be shared or linked from a lesson.

## Acceptance checklist

- [ ] Fretboard, keyboard and panel never show different notes.
- [ ] Hovering C4 on the keyboard highlights exactly the C4 positions on the fretboard, and the reverse.
- [ ] Notes are spelled correctly in every key (F♯ major shows E♯).
- [ ] Root is identifiable without colour (size and label).
- [ ] Playback pulses are in time with audio on both instruments.
- [ ] Usable one-handed on a 360px-wide phone; touch targets ≥ 44px.
- [ ] Left-handed mode mirrors the fretboard only.
- [ ] Works with keyboard navigation and a screen reader announces the selection ("C major scale: C D E F G A B").
- [ ] First render shows the instruments without waiting for audio samples.
- [ ] The owner can explain the screen to a beginner in one sentence.
