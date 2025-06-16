/** Metadata about a model */
export interface ModelMetadata {
    id: string;
    name: string;
    icon: string;
    rank: {
        numerator: number;
        denominator: number;
    };
}

/** A generic turn in a game. */
export interface Turn {
    modelId: string;
    time: number;
    gameData: unknown;
}

/** Metadata about the a game. */
export interface GameMetadata {
    name: string;
    viewerUrl: string;
    matchTime: number;
}

/** A models thought. */
export type Thought = string;

/** A models goal. */
export type Goal = string;
