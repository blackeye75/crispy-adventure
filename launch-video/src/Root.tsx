import { Composition, Folder } from "remotion";
import { LaunchVideo } from "./LaunchVideo";
import { Canvas } from "./scenes/Canvas";
import { Cta } from "./scenes/Cta";
import { Habit } from "./scenes/Habit";
import { Hook } from "./scenes/Hook";
import { Lesson } from "./scenes/Lesson";
import { Logo } from "./scenes/Logo";
import { Numbers } from "./scenes/Numbers";
import { Play } from "./scenes/Play";
import { FPS } from "./theme";

const size = { width: 1920, height: 1080, fps: FPS };

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="LaunchVideo" component={LaunchVideo} durationInFrames={1800} {...size} />
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
