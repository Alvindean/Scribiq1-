import { registerRoot } from "remotion";
import { RemotionRoot } from "./Root";

registerRoot(RemotionRoot);

export { RemotionRoot } from "./Root";
export { LessonVideo } from "./compositions/LessonVideo";
export type { LessonVideoProps } from "./compositions/LessonVideo";
