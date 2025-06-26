import { useContext, useEffect, useState } from 'preact/hooks';
import { StreamContext } from '../../context/StreamContext';
import { ModelMetadata, Step, Thought } from '../../context/types';
import { PropsWithChildren } from 'preact/compat';
import { classNames } from '../../utils/classnames';
import { sleep } from '../../context/utils';
import './style.scss';


interface StepOutlineProps extends PropsWithChildren {
    step: Step;
    model: ModelMetadata;
    stepIndex: number;
    playerNumber: number;
    className?: string;
}

const StepOutline = (props: StepOutlineProps) => {
    return <div className={classNames('step-outline', props.className)}>
        <div className="metadata-section">
            <span className="metadata">{props.model.name}</span>
            <span className="metadata">step {props.stepIndex}</span>
            <span className="metadata">player {props.playerNumber}</span>
        </div>
        <div className="content">
            <div className="model">
                {props.model.icon ? <img src={props.model.icon} /> : props.model.name}
            </div>
            {props.children}
        </div>
    </div>
}

type PreviousStepProps = StepOutlineProps;

const PreviousStep = (props: PreviousStepProps) => {
    return <StepOutline {...props}>
        <div className="arrow">→</div>
        <div className="action">
            {props.step.action}
        </div>
    </StepOutline>;
}


interface CurrentStepProps extends StepOutlineProps {
    step: Step;
    thoughts: Thought[];
}

const CurrentStep = (props: CurrentStepProps) => {
    return <StepOutline {...props} className='current-step'>
        {props.thoughts?.length ? props.thoughts.map((thought, index) =>
            <div key={`${props.step.modelId}-${index}`}>{thought}</div>
        ) : 'No thoughts'}
    </StepOutline>
}

interface AgentRespondingProps {
    model: ModelMetadata;
}

const AgentResponding = (props: AgentRespondingProps) => {
    const [dotCount, setDotCount] = useState(0);
    useEffect(() => {
        (async () => {
            await sleep(250);
            setDotCount((dotCount + 1) % 4);
        })();
    }, [dotCount]);

    return <div className="agent-responding">
        {props.model.icon ? <img src={props.model.icon} /> : props.model.name}
        Agent is responding{Array.from({ length: dotCount }, () => <>.</>)}
    </div>
}

function getActiveModelStep(steps: Step[]) {
    return steps.find((step) => step.action !== '');
}

const LEFT_PANEL_EVENTS = 4;

export const EventsPanel = () => {
    const { steps, models, thoughts, playback } = useContext(StreamContext);
    const latestSteps = steps.slice(-LEFT_PANEL_EVENTS);
    const currentStep = latestSteps.pop() ?? [];
    const currentStepAction = getActiveModelStep(currentStep);
    const currentThoughts = thoughts[currentStepAction?.modelId] ?? [];
    const currentModelIndex = models.findIndex((model) => model.id === currentStepAction?.modelId);
    const currentModel = models[currentModelIndex];

    if (!currentStepAction || !currentModel) {
        return <div className="events-panel empty">No steps have been taken yet</div>;
    }

    const isDone = currentStep.every((action) => action.status === 'DONE');

    return (
        <div className="events-panel">
            <div className="steps">

                {
                    latestSteps.map((step, index) => {
                        const activeModelStep = getActiveModelStep(step ?? []);
                        if (!activeModelStep) return <></>;
                        const stepIndex = (steps.length - LEFT_PANEL_EVENTS) + index + 1;
                        const modelId = activeModelStep.modelId;
                        const modelIndex = models.findIndex((model) => model.id === modelId);
                        const model = models[modelIndex];
                        return <PreviousStep
                            key={`${modelId}-${index}`}
                            step={activeModelStep}
                            model={model}
                            stepIndex={stepIndex}
                            playerNumber={modelIndex + 1} />;
                    })
                }
                <CurrentStep
                    step={currentStepAction}
                    model={currentModel}
                    stepIndex={steps.length}
                    playerNumber={currentModelIndex + 1}
                    thoughts={currentThoughts} />
            </div>

            {!isDone && playback.playing && <AgentResponding model={currentModel} />}
        </div>
    );
}
