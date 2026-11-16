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
