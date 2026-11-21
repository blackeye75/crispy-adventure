import { Composition, Folder } from "remotion";
import { LaunchVideo } from "./LaunchVideo";
import { Canvas } from "./scenes/Canvas";
import { Cover } from "./scenes/Cover";
import { Cta } from "./scenes/Cta";
import { Habit } from "./scenes/Habit";
import { Hook } from "./scenes/Hook";
import { Lesson } from "./scenes/Lesson";
import { Logo } from "./scenes/Logo";
import { Numbers } from "./scenes/Numbers";
import { Play } from "./scenes/Play";
import { PromoCover } from "./promo/PromoCover";
import { PROMO_FRAMES, PromoVideo } from "./promo/PromoVideo";
import { BLUES_SEGMENTS, BluesReel } from "./reels/BluesReel";
import { LEARN_SEGMENTS, LearnReel } from "./reels/LearnReel";
import { LESSON_SEGMENTS, LessonReel } from "./reels/LessonReel";
import { PosterJourney, PosterLesson, PosterUsp } from "./reels/Posters";
import { reelFrames } from "./reels/Reel";
import { BEGINNER_FRAMES, BeginnerReel } from "./beginner/BeginnerReel";
import { FOUR_CHORDS_FRAMES, FourChordsReel } from "./vertical/four-chords/FourChordsReel";
import { MAJOR_MINOR_FRAMES, MajorMinorReel } from "./vertical/major-minor/MajorMinorReel";
import { HARMONY_FRAMES, HarmonyReel } from "./vertical/harmony/HarmonyReel";
import { HarmonyPlateReel } from "./vertical/harmony/HarmonyPlate";
import { EAR_TEST_FRAMES, EarTestReel } from "./vertical/ear-test/EarTestReel";
import { CoverEarTest, CoverFourChords, CoverMajorMinor, CoverTwelve } from "./vertical/Covers";
import { FPS } from "./theme";

const size = { width: 1920, height: 1080, fps: FPS };

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="LaunchVideo" component={LaunchVideo} durationInFrames={1800} {...size} />
    {/* The same scenes in 9:16 for Reels and Shorts; each scene has its own tall layout. */}
    <Composition id="LaunchVideoVertical" component={LaunchVideo} durationInFrames={1800} width={1080} height={1920} fps={FPS} />
    {/* The longer promo: about 84 seconds, with its own soundtrack. */}
    <Composition id="PromoVideo" component={PromoVideo} durationInFrames={PROMO_FRAMES} {...size} />
    <Composition id="PromoVideoVertical" component={PromoVideo} durationInFrames={PROMO_FRAMES} width={1080} height={1920} fps={FPS} />
    {/* Narrated reels. Their length follows the voice-over: see src/reels/voice.json and scripts/make-voice.mjs. */}
    <Composition id="ReelLearn" component={LearnReel} durationInFrames={reelFrames("learn", LEARN_SEGMENTS)} {...size} />
    <Composition id="ReelLesson" component={LessonReel} durationInFrames={reelFrames("lesson", LESSON_SEGMENTS)} {...size} />
    <Composition id="ReelBlues" component={BluesReel} durationInFrames={reelFrames("blues", BLUES_SEGMENTS)} {...size} />
    {/* A beginner lesson taught in full, 9:16 for Reels, narrated with Kokoro: see scripts/make-beginner-voice.py. */}
    <Composition id="ReelBeginner" component={BeginnerReel} durationInFrames={BEGINNER_FRAMES} width={1080} height={1920} fps={FPS} />
    <Composition id="ReelHarmony" component={HarmonyReel} durationInFrames={HARMONY_FRAMES} width={1080} height={1920} fps={FPS} />
    <Composition id="ReelHarmonyPlate" component={HarmonyPlateReel} durationInFrames={HARMONY_FRAMES} width={1080} height={1920} fps={FPS} />
    <Composition id="ReelEarTest" component={EarTestReel} durationInFrames={EAR_TEST_FRAMES} width={1080} height={1920} fps={FPS} />
    <Composition id="ReelMajorMinor" component={MajorMinorReel} durationInFrames={MAJOR_MINOR_FRAMES} width={1080} height={1920} fps={FPS} />
    <Composition id="ReelFourChords" component={FourChordsReel} durationInFrames={FOUR_CHORDS_FRAMES} width={1080} height={1920} fps={FPS} />
    {/* Covers for the 9:16 lesson reels. */}
    <Composition id="CoverTwelve" component={CoverTwelve} durationInFrames={1} width={1080} height={1920} fps={FPS} />
    <Composition id="CoverMajorMinor" component={CoverMajorMinor} durationInFrames={1} width={1080} height={1920} fps={FPS} />
    <Composition id="CoverEarTest" component={CoverEarTest} durationInFrames={1} width={1080} height={1920} fps={FPS} />
    <Composition id="CoverFourChords" component={CoverFourChords} durationInFrames={1} width={1080} height={1920} fps={FPS} />
    {/* Story posters: stills, 1080 × 1920. */}
    <Composition id="PosterUsp" component={PosterUsp} durationInFrames={1} width={1080} height={1920} fps={FPS} />
    <Composition id="PosterLesson" component={PosterLesson} durationInFrames={1} width={1080} height={1920} fps={FPS} />
    <Composition id="PosterJourney" component={PosterJourney} durationInFrames={1} width={1080} height={1920} fps={FPS} />
    {/* Still images for the launch post: render with `npx remotion still`. */}
    <Composition id="CoverReel" component={Cover} durationInFrames={1} width={1080} height={1920} fps={FPS} />
    <Composition id="CoverFeed" component={Cover} durationInFrames={1} width={1080} height={1350} fps={FPS} />
    <Composition id="PromoCoverReel" component={PromoCover} durationInFrames={1} width={1080} height={1920} fps={FPS} />
    <Composition id="PromoCoverFeed" component={PromoCover} durationInFrames={1} width={1080} height={1350} fps={FPS} />
    <Folder name="Scenes">
      <Composition id="Hook" component={Hook} durationInFrames={144} {...size} />
      <Composition id="Logo" component={Logo} durationInFrames={144} {...size} />
      <Composition id="Canvas" component={Canvas} durationInFrames={288} {...size} />
      <Composition id="Lesson" component={Lesson} durationInFrames={360} {...size} />
      <Composition id="Play" component={Play} durationInFrames={288} {...size} />
      <Composition id="Numbers" component={Numbers} durationInFrames={216} {...size} />
      <Composition id="Habit" component={Habit} durationInFrames={216} {...size} />
      <Composition id="Cta" component={Cta} durationInFrames={144} {...size} />
    </Folder>
  </>
);
