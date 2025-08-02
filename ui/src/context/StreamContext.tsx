import { createContext } from "preact";
import { PropsWithChildren, useState, useEffect } from "preact/compat";
import { ModelMetadata, GameMetadata, Step, Episode, Playback } from "./types";
import { sleep } from "./utils";
import { BACKEND, staticFilePath } from "../utils/backend";
import { estimateIcon, formatModelName } from "../utils/models";
import { getActiveModelStep, getTurnTime, isSetup } from "../utils/step";
import { getEpisodePlayerPath } from "../utils/games";

/** The interface definition of the StreamContext */
export interface StreamContextI {
  models: ModelMetadata[];
  game: GameMetadata;
  episode: Episode | undefined;
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
  playback: {
    playing: false,
    autoPlay: false,
    currentStep: 0,
    setupStepCount: 0,
    speed: 1,
    textSpeed: 50,
    alwaysScroll: false,
    chunkBy: 'char',
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

async function recordMove(episodeId: string, initialize = false) {
  await fetch(`${BACKEND}/api/episode/${episodeId}/move`, {
    method: 'POST',
    headers: {
      ['Content-Type']: 'application/json',
    },
    body: JSON.stringify({
      initialize,
    })
  });
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
  const alwaysScroll = params.has('alwaysScroll');
  const autoPlay = params.has('autoPlay');
  const textSpeed = params.has('textSpeed') ?
    Number.parseInt(params.get('textSpeed')) :
    defaultStreamContext.playback.textSpeed;
  const chunkBy = params.has('chunkBy') ?
    params.get('chunkBy') :
    'char';
  const turnTimeOverride = params.has('turnTimeOverride') ?
    Number.parseInt(params.get('turnTimeOverride')) :
    undefined;


  useEffect(() => {
    const nextAutoPlay = !showControls || autoPlay;
    setPlayback({ ...playback, autoPlay: nextAutoPlay, alwaysScroll, textSpeed, chunkBy });
  }, [showControls, alwaysScroll, textSpeed, chunkBy]);

  useEffect(() => {
    if (!episodeId && !episodeFile) return;
    let nextModels = [...models];
    (async () => {
      const episode = episodeId ? await fetchEpisode(episodeId) : await fetchEpisodeFile(episodeFile);
      if (params.has('subtitle')) {
        if (!episode.metadata) {
          episode.metadata = {};
        }
        episode.metadata.stage = params.get('subtitle');
      }
      setEpisode(episode);
      nextModels = episode.info.TeamNames.map((teamName) => ({
        id: teamName,
        name: formatModelName(teamName),
        icon: estimateIcon(teamName),
        edgeIcon: estimateIcon(teamName, true)
      }));
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
      if (playback.currentStep === 0) {
        recordMove(episodeId, true);
      }
      const controller = new AbortController();
      stepStreams.push(controller);
      const firstNoNSetup = episode.steps.findIndex((actions) => !isSetup(actions));
      const allSteps = episode.steps.slice(firstNoNSetup);
      const setupStepCount = episode.steps.length - allSteps.length;
      for (let i = playback.currentStep; i < allSteps.length; i++) {
        const step = getActiveModelStep(allSteps[i]);
        const timeTaken = turnTimeOverride ?? getTurnTime(step, playback);
        nextSteps = allSteps.slice(0, i + 1).map((step) => {
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
          setupStepCount,
          currentStep: i,
        });
        await sleep(timeTaken / playback.speed);
        recordMove(episodeId);
      }
    })();
  }, [playback.playing, playback.speed, episode]);

  useEffect(() => {
    if (episode?.steps.length) {
      console.log(`There are ${episode.steps.length} steps`);
      const estimatedTotalTime = episode.steps.reduce((sum, step) => {
        const activeStep = getActiveModelStep(step);
        if (!activeStep) return sum;
        return sum + getTurnTime(activeStep, playback);
      }, 0);
      function formatMilliseconds(ms: number): string {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(seconds).padStart(2, '0');

        return `${formattedMinutes}:${formattedSeconds}`;
      }
      console.log(`The game is estiamted to take ${formatMilliseconds(estimatedTotalTime)}`);
    }
  }, [episode]);

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
