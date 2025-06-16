import { createContext } from "preact";
import { PropsWithChildren, useState } from "preact/compat";
import { ModelMetadata, GameMetadata, Turn, Thought, Goal } from "./types";

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
    },
    turns: [],
    thoughts: {},
    goals: {},
}

/** The injectable context object responsable for storing information about the current stream. */
export const StreamContext = createContext<StreamContextI>(defaultStreamContext)

interface StreamContextProviderProps extends PropsWithChildren { }

export const StreamContextProvider = (props: StreamContextProviderProps) => {
    const [currentContext, setContext] = useState(defaultStreamContext);

    return <StreamContext.Provider value={currentContext}>
        {props.children}
    </StreamContext.Provider>
}
