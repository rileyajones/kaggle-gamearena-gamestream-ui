/** Metadata about a model */
export interface ModelMetadata {
    id: string;
    name: string;
    icon?: string;
    winLoss?: {
        numerator: number;
        denominator: number;
    };
    rank?: number;
}

/** Metadata about the a game. */
export interface GameMetadata {
    name: string;
    viewerUrl: string;
    matchTime?: number;
    rendererUrl: string;
}

export interface Playback {
    playing: boolean;
    currentStep: number;
    speed: number;
}

export interface Episode {
    configuration: {
        actTimeout: number;
        agentTimeout: number;
        episodeSteps: number;
        runTimeout: number;
        seed: number;
    };
    description: string;
    id: string;
    info: {
        EpisodeId: number;
        LiveVideoPath: null;
        TeamNames: string[];
    };
    name: string;
    rewards: number[];
    schema_version: number;
    specification: {
        action: {
            default: string;
            description: string;
            type: string;
        };
        agents: number[];
        configuration: {
            actTimeout: {
                default: number;
                description: string;
                minimum: number;
                type: string;
            };
            agentTimeout: {
                default: number;
                description: string;
                minimum: number;
                type: string;
            };
            episodeSteps: {
                default: number;
                description: string;
                minimum: number;
                type: string;
            };
            runTimeout: {
                default: number;
                description: string;
                minimum: number;
                type: string;
            };
            seed: {
                default: number;
                description: string;
                type: string;
            };
        };
        info: {};
        observation: {
            board: {
                default: string;
                description: string;
                shared: boolean;
                type: string;
            };
            lastMove: {
                default: string;
                description: string;
                type: string;
            };
            mark: {
                defaults: string[];
                description: string;
                enum: string[];
            };
            opponentRemainingOverageTime: {
                default: number;
                description: string;
                type: string;
            };
            remainingOverageTime: {
                default: number;
                description: string;
                minimum: number;
                shared: boolean;
                type: string;
            };
            step: {
                default: number;
                description: string;
                minimum: number;
                shared: boolean;
                type: string;
            };
        };
        reward: {
            default: number;
            description: string;
            enum: number[];
            type: (string | null)[];
        };
    };
    statuses: string[];
    title: string;
    version: string;
    steps: Array<Exclude<Step, 'modelId'>[]>;
};

export interface StepActionObject {
    submission?: number;
    actionString?: string;
    thoughts?: string;
}

export type StepAction = string|StepActionObject;

export interface Step {
    modelId: string;
    action: StepAction;
    info: {
      timeTaken?: number;
    };
    observation: {
        board: string;
        lastMove: string;
        mark: string;
        opponentRemainingOverageTime: number;
        remainingOverageTime: number;
        step?: number; // Optional as it's not present in all steps for 'black' player
    };
    reward: number;
    status: string;
};
