import { useContext, useEffect, useRef } from "preact/hooks";
import { StreamContext } from "../../context/StreamContext";
import './style.css';

export const windowKaggle = {
    "debug": false,
    "playing": false,
    "step": 0,
    "controls": true,
    "environment": {
        "id": "04301b28-4b0f-11f0-92de-42004e494300",
        "name": "chess",
        "title": "Chess",
        "description": "Classic Chess with full rule set",
        "version": "1.0.0",
        "configuration": {
            "episodeSteps": 1000,
            "actTimeout": 0.1,
            "runTimeout": 300,
            "seed": 0,
            "agentTimeout": 10
        },
        "specification": {
            "action": {
                "description": "Move in UCI notation (e.g., e2e4)",
                "type": "string",
                "default": ""
            },
            "agents": [
                2
            ],
            "configuration": {
                "episodeSteps": {
                    "description": "Maximum number of steps in the episode.",
                    "type": "integer",
                    "minimum": 1,
                    "default": 1000
                },
                "actTimeout": {
                    "description": "Maximum runtime (seconds) to obtain an action from an agent.",
                    "type": "number",
                    "minimum": 0,
                    "default": 0.1
                },
                "runTimeout": {
                    "description": "Maximum runtime (seconds) of an episode (not necessarily DONE).",
                    "type": "number",
                    "minimum": 0,
                    "default": 300
                },
                "seed": {
                    "description": "Integer random value to use to seed the match",
                    "type": "number",
                    "default": 0
                },
                "agentTimeout": {
                    "description": "Obsolete field kept for backwards compatibility, please use observation.remainingOverageTime.",
                    "type": "number",
                    "minimum": 0,
                    "default": 10
                }
            },
            "info": {},
            "observation": {
                "remainingOverageTime": {
                    "description": "Total remaining banked time (seconds) that can be used in excess of per-step actTimeouts -- agent is disqualified with TIMEOUT status when this drops below 0.",
                    "shared": false,
                    "type": "number",
                    "minimum": 0,
                    "default": 10
                },
                "step": {
                    "description": "Current step within the episode.",
                    "type": "integer",
                    "shared": true,
                    "minimum": 0,
                    "default": 0
                },
                "board": {
                    "description": "FEN string representation of the board",
                    "type": "string",
                    "shared": true,
                    "default": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
                },
                "mark": {
                    "description": "Player color, white or black",
                    "defaults": [
                        "white",
                        "black"
                    ],
                    "enum": [
                        "white",
                        "black"
                    ]
                },
                "opponentRemainingOverageTime": {
                    "description": "Amount of overage time remaining for the opponent.",
                    "type": "number",
                    "default": 10
                },
                "lastMove": {
                    "description": "Previous move to get to this position.",
                    "type": "string",
                    "default": ""
                }
            },
            "reward": {
                "description": "0 = Lost/Ongoing, 0.5 = Draw, 1 = Won",
                "enum": [
                    0,
                    0.5,
                    1
                ],
                "default": 0,
                "type": [
                    "number",
                    "null"
                ]
            }
        },
        "steps": [
            [
                {
                    "action": "",
                    "reward": 0,
                    "info": {},
                    "observation": {
                        "remainingOverageTime": 10,
                        "step": 0,
                        "board": "rnbqk1nr/ppppppbp/6p1/8/3P4/4PN2/PPP2PPP/RN1QKB1R w KQkq - 1 5",
                        "mark": "white",
                        "opponentRemainingOverageTime": 10,
                        "lastMove": ""
                    },
                    "status": "ACTIVE"
                },
                {
                    "action": "",
                    "reward": 0,
                    "info": {},
                    "observation": {
                        "remainingOverageTime": 10,
                        "mark": "black",
                        "opponentRemainingOverageTime": 10,
                        "lastMove": "",
                        "board": "rnbqk1nr/ppppppbp/6p1/8/3P4/4PN2/PPP2PPP/RN1QKB1R w KQkq - 1 5"
                    },
                    "status": "INACTIVE"
                }
            ]
        ],
        "rewards": [
            0,
            0
        ],
        "statuses": [
            "ACTIVE",
            "INACTIVE"
        ],
        "schema_version": 1,
        "info": {}
    },
    "logs": [
        []
    ],
    "mode": "html",
    "loading": false
}


export const GameViewer = () => {
    const streamContext = useContext(StreamContext);
    const iframeRef = useRef();

    useEffect(() => {
        const currentIframe = iframeRef?.current as HTMLIFrameElement | undefined;
        if (!currentIframe || !streamContext.game.viewerUrl) return;
        currentIframe.contentWindow.postMessage(windowKaggle, streamContext.game.viewerUrl);
        currentIframe.contentWindow.postMessage({ setSteps: streamContext.steps.map((step) => [step[0].gameData, step[1].gameData]) }, streamContext.game.viewerUrl);
    }, [windowKaggle, iframeRef, streamContext.steps]);

    return <iframe ref={iframeRef} src={streamContext.game.viewerUrl}></iframe>
}
