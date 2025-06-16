import { createContext } from "preact";
import { PropsWithChildren, useState, useEffect } from "preact/compat";
import { ModelMetadata, GameMetadata, Turn, Thought, Goal } from "./types";
import { readStreamChunks } from "./utils";

/** The interface definition of the StreamContext */
export interface StreamContextI {
    models: ModelMetadata[];
    game: GameMetadata;
    turns: Turn[];
    thoughts: { [modelId: string]: Thought[] };
    goals: { [modelId: string]: Goal[] };
}

const defaultStreamContext: StreamContextI = {
    models: [],
    game: {
        name: '',
        viewerUrl: '',
        matchTime: 0,
    },
    turns: [],
    thoughts: {},
    goals: {},
}

/** The injectable context object responsable for storing information about the current stream. */
export const StreamContext = createContext<StreamContextI>(defaultStreamContext)

interface StreamContextProviderProps extends PropsWithChildren { }

async function fetchMetadata() {
    const response = await fetch('http://localhost:3001/metadata');
    return response.json();
}

async function streamThoughts(modelId: string, stream: (chunk: { done: boolean, value: string | undefined }) => void) {
    for await (const chunk of readStreamChunks(`http://localhost:3001/thoughts/${modelId}`)) {
        const value = chunk.value ? new TextDecoder().decode(chunk.value) : undefined;
        stream({ value, done: chunk.done })
    }
}

async function streamGoals(modelId: string, stream: (chunk: { done: boolean, value: string }) => void) {
    for await (const chunk of readStreamChunks(`http://localhost:3001/goals/${modelId}`)) {
        const value = chunk.value ? new TextDecoder().decode(chunk.value) : undefined;
        stream({ value, done: chunk.done })
    }
}


async function streamTurns(stream: (chunk: { done: boolean, value: Turn }) => void) {
    for await (const chunk of readStreamChunks(`http://localhost:3001/turns`)) {
        const value = chunk.value ? new TextDecoder().decode(chunk.value) : undefined;
        stream({ value: JSON.parse(value), done: chunk.done })
    }
}

export const StreamContextProvider = (props: StreamContextProviderProps) => {
    const [models, setModels] = useState(defaultStreamContext.models);
    const [game, setGame] = useState(defaultStreamContext.game);
    const [thoughts, setThoughts] = useState(defaultStreamContext.thoughts);
    const [goals, setGoals] = useState(defaultStreamContext.goals);
    const [turns, setTurns] = useState(defaultStreamContext.turns);

    useEffect(() => {
        (async () => {
            const res = await fetchMetadata();
            setModels(res.models);
            setGame(res.game);

            let nextThoughts = { ...thoughts };
            res.models.forEach((model) => {
                streamThoughts(model.id, ({ value }) => {
                    if (!value) return;
                    nextThoughts = { ...nextThoughts };
                    const currentModelThoughts = (nextThoughts[model.id] ?? []);
                    nextThoughts[model.id] = currentModelThoughts.concat(value);
                    setThoughts(nextThoughts);
                });
            });

            let nextGoals = { ...goals };
            res.models.forEach((model) => {
                streamGoals(model.id, ({ value }) => {
                    if (!value) return;
                    nextGoals = { ...nextGoals };
                    const currentModelGoals = (nextGoals[model.id] ?? []);
                    nextGoals[model.id] = currentModelGoals.concat(value);
                    setGoals(nextGoals);
                });
            });

            let nextTurns = [...turns];
            streamTurns(({ value }) => {
                if (!value) return;
                nextTurns = [...nextTurns];
                nextTurns.push(value);
                setTurns(nextTurns);
            })
        })();
    }, []);

    const context = {
        ...defaultStreamContext,
        models,
        game,
        thoughts,
        goals,
        turns,
    }

    return <StreamContext.Provider value={context}>
        {props.children}
    </StreamContext.Provider>
}
