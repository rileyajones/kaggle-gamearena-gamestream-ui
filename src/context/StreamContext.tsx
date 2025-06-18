import { createContext } from "preact";
import { PropsWithChildren, useState, useEffect } from "preact/compat";
import { ModelMetadata, GameMetadata, Step, Thought, Goal, Episode } from "./types";
import { readStreamChunks, sleep, streamString } from "./utils";

/** The interface definition of the StreamContext */
export interface StreamContextI {
    models: ModelMetadata[];
    game: GameMetadata;
    episode: Episode | undefined;
    gameState: {
        step: number;
    };
    steps: Step[][];
    thoughts: { [modelId: string]: Thought[] };
    goals: { [modelId: string]: Goal[] };
    currentModelId: string;
}

const defaultStreamContext: StreamContextI = {
    models: [],
    game: {
        name: '',
        viewerUrl: '',
        matchTime: 0,
    },
    episode: undefined,
    gameState: {
        step: 0,
    },
    steps: [],
    thoughts: {},
    goals: {},
    currentModelId: '',
}

/** The injectable context object responsable for storing information about the current stream. */
export const StreamContext = createContext<StreamContextI>(defaultStreamContext)

interface StreamContextProviderProps extends PropsWithChildren { }

interface StepsChunk {
    steps: Step[][];
}

async function fetchEpisode(id: string): Promise<Episode & StepsChunk> {
    const response = await fetch(`http://localhost:3001/download/episode/${id}`);
    return response.json();
}

// DO_NOT_SUBMIT
const textStreams: AbortController[] = [];
const stepStreams: AbortController[] = [];

export const StreamContextProvider = (props: StreamContextProviderProps) => {
    const [models, setModels] = useState(defaultStreamContext.models);
    const [game, setGame] = useState(defaultStreamContext.game);
    const [steps, setSteps] = useState(defaultStreamContext.steps);
    const [episode, setEpisode] = useState(defaultStreamContext.episode);
    const [thoughts, setThoughts] = useState(defaultStreamContext.thoughts);

    const params = new URLSearchParams(window.location.search);
    const episodeId = params.get('episodeId');

    useEffect(() => {
        let nextModels = [...models];
        let nextSteps = [...steps];
        (async () => {
            const episode = await fetchEpisode(episodeId);
            setEpisode(episode);
            nextModels = episode.info.TeamNames.map((teamName) => ({ id: teamName, name: teamName }));
            setModels(nextModels);
            setGame({
                name: episode.name,
                viewerUrl: 'http://localhost:8081/chess_player.html',
            });
            while (stepStreams.length) {
                const controller = stepStreams.pop();
                controller.abort();
            }
            const controller = new AbortController();
            stepStreams.push(controller);
            for (let i = 0; i < episode.steps.length; i++) {
                // DO_NOT_SUBMIT this speed should be configurable. This will also break if rerenders occur.
                await sleep(500);
                nextSteps = episode.steps.slice(0, i).map((step) => {
                    return step.map((actions, index) => {
                        const modelId = nextModels[index % (nextModels.length)]?.id;
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
            }

        })();
    }, [episodeId]);

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
    }

    return <StreamContext.Provider value={context}>
        {props.children}
    </StreamContext.Provider>
}
