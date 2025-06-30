import { Episode } from "../context/types";
import { staticFilePath } from "./backend";

/** Returns the static file used to retrieve the player for the provided episode */
export function getEpisodePlayerPath(episode: Episode) {
  return staticFilePath(`${episode.name}.js`);
}
