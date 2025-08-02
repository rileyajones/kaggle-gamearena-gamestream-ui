import { useContext, useRef, useState } from 'preact/hooks';
import { StreamContext } from '../../context/StreamContext';
import { ModelMetadata, Step } from '../../context/types';
import { PropsWithChildren, memo } from 'preact/compat';
import { classNames } from '../../utils/classnames';
import { AgentResponding } from './AgentResponding';
import { ModelIcon } from '../ModelIcon/ModelIcon';
import { Move } from './Move';
import { TextStream } from '../TextStream/TextStream';
import { getActiveModelStep, getThoughts } from '../../utils/step';
import { IconButton } from '../IconButton/IconButton';
import Markdown from 'react-markdown';
import './style.scss';
import { staticFilePath } from '../../utils/backend';
import { generateChunks } from '../../context/utils';

interface StepOutlineProps extends PropsWithChildren {
  step: Step;
  model: ModelMetadata;
  stepIndex: number;
  playerNumber: number;
  currentStepIndex: number;
  className?: string;
  expanded?: boolean;
  onExpand?: () => void;
  setAsCurrent?: () => void;
}

const StepOutline = (props: StepOutlineProps) => {
  return <div className={classNames('step-outline', props.className, props.expanded && 'expanded', props.onExpand && 'expandable')}
    role={props.onExpand ? 'button' : 'feed'}
    onClick={props.onExpand}>
    <div className="metadata-section">
      <span className="metadata">{props.model.name}</span>
      <span className="metadata">step {props.stepIndex + 1}</span>
      <span className="metadata">player {props.playerNumber}</span>
    </div>
    <div className="content">
      <div className="model">
        {props.model.icon ? <ModelIcon model={props.model} /> : props.model.name}
      </div>
      {props.children}

      <IconButton
        className={classNames('drill-down-btn', props.stepIndex === props.currentStepIndex && 'hidden')}
        disabled={props.stepIndex === props.currentStepIndex}
        tooltip="Show Move"
        onClick={(event) => { event.stopPropagation(); props.setAsCurrent() }}>
        output
      </IconButton>
    </div>
  </div>
}

type PreviousStepProps = StepOutlineProps;

const PreviousStep = (props: PreviousStepProps) => {
  return <StepOutline {...props}>
    <div className="previous-steps-content">
      <Move step={props.step} />
      <div class="thoughts">
        <Markdown>
          {getThoughts(props.step)}
        </Markdown>
      </div>
    </div>
  </StepOutline>;
}


interface CurrentStepProps extends StepOutlineProps {
  step: Step;
  textSpeed: number;
  afterRender?: () => void;
}

const CurrentStep = memo((props: CurrentStepProps) => {
  const { playback } = useContext(StreamContext);
  const thoughts = getThoughts(props.step);
  return <StepOutline {...props} className='current-step'>
    <div className="current-thoughts">
      {thoughts ?
        <TextStream
          chunks={generateChunks(thoughts, playback.chunkBy)}
          chunkDelay={props.textSpeed}
          afterRender={props.afterRender}>
          {(str) =>
            <Markdown>
              {str + ' '}
            </Markdown>
          }
        </TextStream> :
        'No thoughts'}
    </div>
  </StepOutline>
});


export const EventsPanel = () => {
  const { steps, models, playback, setPlayback } = useContext(StreamContext);
  const [expandedSteps, setExpandedSteps] = useState(new Set<number>());
  const stepsContainer = useRef<HTMLDivElement | null>();
  const previousSteps = [...steps];
  const currentStep = previousSteps.pop() ?? [];
  const currentStepAction = getActiveModelStep(currentStep);
  const currentModel = models[currentStepAction?.modelIndex];

  const decoration = currentStepAction?.modelIndex === 0 ?
    'https://upload.wikimedia.org/wikipedia/commons/f/f0/Chess_kdt45.svg' : // Black king
    'https://upload.wikimedia.org/wikipedia/commons/4/42/Chess_klt45.svg'; // White king

  if (!steps.length) {
    return <div className="events-panel empty">
      <img src={staticFilePath("empty_start.svg")} />
      No steps have been taken yet
    </div>;
  }

  if (!currentStepAction || !currentModel) {
    return <div className="events-panel empty">
      Could not interpret the current step
    </div>;
  }

  function toggleStepExpandion(index: number) {
    const nextExpandedSteps = new Set(expandedSteps);
    if (nextExpandedSteps.has(index)) {
      nextExpandedSteps.delete(index);
    } else {
      nextExpandedSteps.add(index);
    }
    setExpandedSteps(nextExpandedSteps);
  }

  const isDone = currentStep.every((action) => action.status === 'DONE');

  // Ensure the left panel scrolls as thoughts are rendered.
  function maybeScroll() {
    const scrollContainer = stepsContainer.current;
    if (!scrollContainer) return;
    const estimatedElementHeight = 100;
    const atBottom = scrollContainer.scrollTop +
      scrollContainer.offsetHeight +
      estimatedElementHeight >= scrollContainer.scrollHeight;
    if (atBottom || playback.alwaysScroll) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight - scrollContainer.offsetHeight;
    }
  }

  function setStep(index: number) {
    setPlayback({ ...playback, currentStep: index, playing: false });
  }

  return (
    <div className="events-panel">
      <div className="steps" ref={stepsContainer}>
        {
          previousSteps.map((step, index) => {
            const activeModelStep = getActiveModelStep(step ?? []);
            if (!activeModelStep) return <></>;
            const stepIndex = index;
            const modelId = activeModelStep.modelId;
            const modelIndex = models.findIndex((model) => model.id === modelId);
            const model = models[modelIndex];
            return <PreviousStep
              key={`${modelId}-${index}`}
              step={activeModelStep}
              model={model}
              stepIndex={stepIndex}
              currentStepIndex={playback.currentStep}
              setAsCurrent={() => setStep(stepIndex)}
              playerNumber={modelIndex + 1}
              expanded={expandedSteps.has(stepIndex)}
              onExpand={() => toggleStepExpandion(stepIndex)} />;
          })
        }
        <CurrentStep
          step={currentStepAction}
          model={currentModel}
          stepIndex={steps.length - 1}
          setAsCurrent={() => setStep(steps.length - 1)}
          currentStepIndex={playback.currentStep}
          textSpeed={Math.floor(playback.textSpeed / playback.speed)}
          afterRender={maybeScroll}
          playerNumber={currentStepAction.modelIndex + 1} />
      </div>

      {!isDone && playback.playing && <AgentResponding model={currentModel} decoration={decoration} />}
    </div>
  );
}
