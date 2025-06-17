import { createContext } from "preact";
import { PropsWithChildren, useState, useEffect } from "preact/compat";
import { ModelMetadata, GameMetadata, Step, Thought, Goal, Episode } from "./types";
import { readStreamChunks } from "./utils";

/** The interface definition of the StreamContext */
export interface StreamContextI {
    models: ModelMetadata[];
    game: GameMetadata;
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

async function fetchMetadata() {
    const response = await fetch('http://localhost:3001/metadata');
    return response.json();
}

async function streamTurns(stream: (chunk: { done: boolean, value: Step }) => void) {
    for await (const chunk of readStreamChunks(`http://localhost:3001/turns`)) {
        const value = chunk.value ? new TextDecoder().decode(chunk.value) : undefined;
        stream({ value: JSON.parse(value), done: chunk.done });
    }
}

interface StepsChunk {
    steps: Step[][];
}

async function streamEpisode(stream: (chunk: { done: boolean, value: Episode | StepsChunk }) => void) {
    for await (const chunk of readStreamChunks('http://localhost:3001/episode')) {
        const value = chunk.value ? JSON.parse(new TextDecoder().decode(chunk.value)) : undefined;
        stream({ value, done: chunk.done });
    }
}

async function fetchEpisode(id: string): Promise<Episode & StepsChunk> {
    const response = await fetch(`http://localhost:3001/download/episode/${id}`);
    return response.json();
}

function isStepsChunk(value: Episode | StepsChunk): value is StepsChunk {
    return Boolean((value as StepsChunk).steps);
}

export const StreamContextProvider = (props: StreamContextProviderProps) => {
    const [models, setModels] = useState(defaultStreamContext.models);
    const [game, setGame] = useState(defaultStreamContext.game);
    const [thoughts, setThoughts] = useState(defaultStreamContext.thoughts);
    const [goals, setGoals] = useState(defaultStreamContext.goals);
    const [steps, setSteps] = useState(defaultStreamContext.steps);

    const params = new URLSearchParams(window.location.search);
    const episodeId = params.get('episodeId');

    useEffect(() => {
        let nextModels = [...models];
        let nextThoughts = { ...thoughts };
        let nextGoals = { ...goals };
        let nextSteps = [...steps];
        (async () => {
            const episode = await fetchEpisode(episodeId);
            nextModels = episode.info.TeamNames.map((teamName) => ({ id: teamName, name: teamName }));
            setModels(nextModels);
            setGame({
                name: episode.name,
                viewerUrl: 'http://localhost:8081/chess_player.html',
            });
            nextSteps = episode.steps.map((step) => {
                return step.map((s, index) => {
                    const modelId = nextModels[index % (nextModels.length)]?.id;
                    return {
                        modelId,
                        ...s,
                    };
                })
            });
            setSteps(nextSteps);

        })();
        // streamEpisode(({ value }) => {
        //     if (!value) return;
        //     if (isStepsChunk(value)) {
        //         nextSteps = [...nextSteps, value.steps.map((step, index) => {
        //             const modelId = nextModels[nextSteps.length % (nextModels.length)]?.id;
        //             return {
        //                 modelId,
        //                 time: Date.now(),
        //                 gameData: step,
        //             };
        //         })];
        //         setSteps(nextSteps);
        //         return;
        //     }

        //     const episode = value as Episode;

        //     nextModels = episode.info.TeamNames.map((teamName) => ({ id: teamName, name: teamName }));
        //     setModels(nextModels);
        //     setGame({
        //         name: episode.name,
        //         viewerUrl: 'http://localhost:8081/chess_player.html',
        //     })
        // });
    }, [episodeId]);

    const currentModelId = models[(steps.length - 1) % models.length]?.id;
    const context = {
        ...defaultStreamContext,
        models,
        game,
        thoughts,
        goals,
        steps,
        currentModelId,
    }

    return <StreamContext.Provider value={context}>
        {props.children}
    </StreamContext.Provider>
}
