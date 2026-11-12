import type { Module, Track } from "@/core/schemas/content";

export const tracks: Track[] = [
  { slug: "theory", title: "Music theory", order: 1, description: "From your first note to jazz harmony, always on the instrument." },
];

// The whole theory path from docs/CURRICULUM.md. Modules without lessons yet show as "coming soon".
const outline: [level: number, slug: string, title: string, summary: string][] = [
  [1, "sound-and-pitch", "Sound and pitch", "What a note is, the octave, and how your instrument is laid out."],
  [1, "musical-alphabet", "The musical alphabet", "The twelve notes, their names, and the steps between them."],
  [1, "finding-notes", "Finding notes on your instrument", "Name any note on the fretboard or the keyboard."],
  [1, "rhythm-1", "Rhythm I", "Pulse, tempo, bars, and the basic note lengths."],
  [1, "reading-music", "Reading music", "The staff, the clefs, tab and chord diagrams."],
  [1, "ear-1", "Ear I", "Higher or lower, same or different, singing a note back."],
  [2, "intervals", "Intervals", "The distance between two notes, by sight and by ear."],
  [2, "major-scale", "The major scale", "The formula, scale degrees, and building it in any key."],
  [2, "keys", "Keys and key signatures", "What a key is, the circle of fifths, relative major and minor."],
  [2, "rhythm-2", "Rhythm II", "Dotted notes, ties, sixteenths, 3/4 and 6/8."],
  [2, "ear-2", "Ear II", "Major or minor, intervals going up, finding the home note."],
  [3, "triads", "Triads", "Stacking thirds into major, minor, diminished and augmented chords."],
  [3, "chords-of-a-key", "Chords of a key", "Harmonising the major scale, Roman numerals, chord function."],
  [3, "progressions", "Progressions", "The common progressions, the 12-bar blues, cadences, transposing."],
  [3, "minor-keys", "Minor keys", "Natural, harmonic and melodic minor, and their chords."],
  [3, "inversions", "Inversions and slash chords", "The same chord with a different note in the bass."],
  [3, "chords-on-your-instrument", "Chords on your instrument", "Open and barre chords, block and broken chords."],
  [3, "ear-3", "Ear III", "Triad quality, hearing I, IV and V, common progressions."],
  [4, "pentatonic-and-blues", "Pentatonic and blues scales", "Five-note scales and the blue note."],
  [4, "whole-instrument", "Owning the whole instrument", "CAGED and full-neck scales, or all twelve keys at the piano."],
  [4, "seventh-chords", "Seventh chords", "The seventh-chord family and how the dominant 7 resolves."],
  [4, "chord-tones-and-melody", "Chord tones and melody", "Targeting chord tones, passing tones, guide tones."],
  [4, "rhythm-3", "Rhythm III", "Triplets, swing, syncopation, odd meters."],
  [4, "expression", "Expression", "Bends, slides and vibrato, or dynamics, articulation and pedal."],
  [4, "ear-4", "Ear IV", "Seventh chords, pentatonic phrases, descending intervals."],
  [5, "modes", "Modes", "The seven modes, their characteristic notes and progressions."],
  [5, "secondary-dominants", "Secondary dominants", "V of V and other chords that point somewhere new."],
  [5, "borrowed-chords", "Borrowed chords", "Modal interchange, the Picardy third, the Neapolitan chord."],
  [5, "voice-leading", "Voice leading", "Common tones, stepwise motion, guide-tone lines."],
  [5, "extended-chords", "Extended and altered chords", "6ths, 9ths, 11ths, 13ths and altered dominants."],
  [5, "modulation", "Modulation", "Changing key by pivot chord, directly, or by common tone."],
  [5, "ear-5", "Ear V", "Recognising modes, borrowed chords and secondary dominants."],
  [6, "jazz-harmony", "Jazz harmony", "ii–V–I in major and minor, turnarounds, jazz blues."],
  [6, "substitution", "Substitution", "Tritone substitution, diminished passing chords, the backdoor."],
  [6, "minor-modes", "Modes of melodic and harmonic minor", "Lydian dominant, the altered scale, Phrygian dominant."],
  [6, "symmetric-scales", "Symmetric scales", "Whole-tone, diminished and augmented scales."],
  [6, "improvisation", "Improvisation", "Chord-scale thinking, motifs, approach notes, playing outside."],
  [6, "arranging", "Arranging and reharmonisation", "Reharmonising a melody; chord-melody and solo piano."],
  [6, "form-and-analysis", "Form, analysis and writing", "Song forms, analysing real songs, writing your own."],
  [6, "further-topics", "Further topics", "Quartal harmony, upper structures, and a bridge to Indian music."],
];

export const modules: Module[] = outline.map(([level, slug, title, summary], order) => ({
  slug, trackSlug: "theory", level, title, order, summary, isFree: level === 1, // Level 1 is free
}));
