import { createContext } from "preact";
import { PropsWithChildren, useState, useEffect } from "preact/compat";
import { ModelMetadata, GameMetadata, Step, Thought, Goal, Episode, Playback } from "./types";
import { readStreamChunks, sleep, streamString } from "./utils";

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
    thoughts: { [modelId: string]: Thought[] };
    goals: { [modelId: string]: Goal[] };
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
    thoughts: {},
    goals: {},
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

const backend = import.meta.env.DEV ? 'http://localhost:3001' : window.location.origin; 

async function fetchEpisode(id: string): Promise<Episode & StepsChunk> {
    const response = await fetch(`${backend}/api/episode/${id}`);
    return response.json();
}

async function fetchEpisodeFile(filename: string): Promise<Episode & StepsChunk> {
    const response = await fetch(`${backend}/static/${filename}`);
    return response.json();
}

const textStreams: AbortController[] = [];
const stepStreams: AbortController[] = [];

export const StreamContextProvider = (props: StreamContextProviderProps) => {
    const [models, setModels] = useState(defaultStreamContext.models);
    const [game, setGame] = useState(defaultStreamContext.game);
    const [steps, setSteps] = useState(defaultStreamContext.steps);
    const [episode, setEpisode] = useState(defaultStreamContext.episode);
    const [thoughts, setThoughts] = useState(defaultStreamContext.thoughts);
    const [playback, setPlayback] = useState(defaultStreamContext.playback);

    const params = new URLSearchParams(window.location.search);
    const episodeId = params.get('episodeId');
    const episodeFile = params.get('episodeFile');
    const showControls = params.has('showControls');

    useEffect(() => {
        if (!episodeId && !episodeFile) return;
        let nextModels = [...models];
        (async () => {
            const episode = episodeId ? await fetchEpisode(episodeId) : await fetchEpisodeFile(episodeFile);
            setEpisode(episode);
            nextModels = episode.info.TeamNames.map((teamName) => ({ id: teamName, name: teamName }));
            setModels(nextModels);
            setGame({
                name: episode.name,
                viewerUrl: `${backend}/static/player.html`,
                rendererUrl: `${backend}/static/chess.js`,
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
                await sleep(500 / playback.speed);
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

    // DO_NOT_SUBMIT this is a hack until thoughts are ready.
    useEffect(() => {
        setThoughts({});
        let nextThoughts = {};
        while (textStreams.length) {
            const controller = textStreams.pop();
            controller.abort();
        }
        models.forEach(async (model) => {
            const board = steps[steps.length - 1]?.find((action) => action.modelId === model.id)?.observation?.board ?? '';
            const abortController = new AbortController();
            textStreams.push(abortController);
            for await (const thought of streamString(board.split(new RegExp('')), { abortController })) {
                if (abortController.signal.aborted) {
                    return;
                }
                nextThoughts = {
                    ...nextThoughts,
                    [model.id]: [thought]
                };
                setThoughts(nextThoughts);
            }
        });
    }, [models, steps]);

    const context = {
        ...defaultStreamContext,
        episode,
        models,
        game,
        steps,
        currentModelId,
        thoughts,
        playback,
        showControls,
        setPlayback,
    }

    return <StreamContext.Provider value={context}>
        {props.children}
    </StreamContext.Provider>
}
