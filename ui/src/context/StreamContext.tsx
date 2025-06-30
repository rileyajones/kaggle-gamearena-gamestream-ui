import { createContext } from "preact";
import { PropsWithChildren, useState, useEffect } from "preact/compat";
import { ModelMetadata, GameMetadata, Step, Episode, Playback } from "./types";
import { sleep } from "./utils";
import { BACKEND, staticFilePath } from "../utils/backend";
import { estimateIcon } from "../utils/models";
import { getDelay } from "../utils/step";
import { getEpisodePlayerPath } from "../utils/games";

/** The interface definition of the StreamContext */
export interface StreamContextI {
  models: ModelMetadata[];
  game: GameMetadata;
  episode: Episode | undefined;
  gameState: {
    step: number;
  };
  playback: Playback;
  steps: Step[][];
  currentModelId: string;
  showControls: boolean;
  setPlayback: (playback: Playback) => void;
}

const defaultStreamContext: StreamContextI = {
  models: [],
  game: {
    name: '',
    viewerUrl: '',
    rendererUrl: '',
    matchTime: 0,
  },
  episode: undefined,
  gameState: {
    step: 0,
  },
  playback: {
    playing: false,
    currentStep: 0,
    speed: 1,
  },
  steps: [],
  currentModelId: '',
  showControls: false,
  setPlayback: () => { },
}

/** The injectable context object responsable for storing information about the current stream. */
export const StreamContext = createContext<StreamContextI>(defaultStreamContext)

interface StreamContextProviderProps extends PropsWithChildren { }

interface StepsChunk {
  steps: Step[][];
}

async function fetchEpisode(id: string): Promise<Episode & StepsChunk> {
  const response = await fetch(`${BACKEND}/api/episode/${id}`);
  return response.json();
}

async function fetchEpisodeFile(filename: string): Promise<Episode & StepsChunk> {
  const response = await fetch(`${BACKEND}/static/${filename}`);
  return response.json();
}

const stepStreams: AbortController[] = [];

export const StreamContextProvider = (props: StreamContextProviderProps) => {
  const [models, setModels] = useState(defaultStreamContext.models);
  const [game, setGame] = useState(defaultStreamContext.game);
  const [steps, setSteps] = useState(defaultStreamContext.steps);
  const [episode, setEpisode] = useState(defaultStreamContext.episode);
  const [playback, setPlayback] = useState(defaultStreamContext.playback);

  const params = new URLSearchParams(window.location.search);
  const episodeId = params.get('episodeId');
  const episodeFile = params.get('episodeFile');
  const showControls = params.has('showControls');


  useEffect(() => {
    if (!showControls) {
      setPlayback({ ...playback, playing: true });
    }
  }, [showControls]);

  useEffect(() => {
    if (!episodeId && !episodeFile) return;
    let nextModels = [...models];
    (async () => {
      const episode = episodeId ? await fetchEpisode(episodeId) : await fetchEpisodeFile(episodeFile);
      setEpisode(episode);
      nextModels = episode.info.TeamNames.map((teamName) => ({ id: teamName, name: teamName, icon: estimateIcon(teamName) }));
      setModels(nextModels);
      setGame({
        name: episode.name,
        viewerUrl: staticFilePath('player.html'),
        rendererUrl: getEpisodePlayerPath(episode),
      });
    })();
  }, [episodeId]);

  useEffect(() => {
    if (!episode) return;
    (async () => {
      let nextSteps = [...steps];
      while (stepStreams.length) {
        const controller = stepStreams.pop();
        controller.abort();
      }
      if (!episode || !playback.playing) return;
      const controller = new AbortController();
      stepStreams.push(controller);
      for (let i = playback.currentStep; i <= episode.steps.length; i++) {
        const step = episode.steps[i]?.find((action) => action.info.timeTaken);
        const timeTaken = step ? getDelay(step) : 0;
        await sleep(timeTaken / playback.speed);
        nextSteps = episode.steps.slice(0, i).map((step) => {
          return step.map((actions, index) => {
            const modelId = models[index % (models.length)]?.id;
            return {
              modelId,
              ...actions,
            };
          })
        });
        if (controller.signal.aborted) {
          return;
        }
        setSteps(nextSteps);
        setPlayback({
          ...playback,
          currentStep: i,
        });
      }
    })();
  }, [playback.playing, playback.speed, episode])

  const currentModelId = models[(steps.length - 1) % models.length]?.id;

  const context = {
    ...defaultStreamContext,
    episode,
    models,
    game,
    steps,
    currentModelId,
    playback,
    showControls,
    setPlayback,
  }

  return <StreamContext.Provider value={context}>
    {props.children}
  </StreamContext.Provider>
}
