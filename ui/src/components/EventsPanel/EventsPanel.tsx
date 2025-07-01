import { useContext, useRef, useState } from 'preact/hooks';
import { StreamContext } from '../../context/StreamContext';
import { ModelMetadata, Step } from '../../context/types';
import { PropsWithChildren, memo } from 'preact/compat';
import { classNames } from '../../utils/classnames';
import { AgentResponding } from './AgentResponding';
import { ModelIcon } from '../ModelIcon/ModelIcon';
import { Move } from './Move';
import { TextStream } from '../TextStream/TextStream';
import { getActiveModelStep, getDelay, getThoughts } from '../../utils/step';
import Markdown from 'react-markdown';
import './style.scss';

interface StepOutlineProps extends PropsWithChildren {
  step: Step;
  model: ModelMetadata;
  stepIndex: number;
  playerNumber: number;
  className?: string;
  expanded?: boolean;
  onExpand?: () => void;
}

const StepOutline = (props: StepOutlineProps) => {
  return <div className={classNames('step-outline', props.className, props.expanded && 'expanded', props.onExpand && 'expandable')}
    role={props.onExpand ? 'button' : 'feed'}
    onClick={props.onExpand}>
    <div className="metadata-section">
      <span className="metadata">{props.model.name}</span>
      <span className="metadata">step {props.stepIndex}</span>
      <span className="metadata">player {props.playerNumber}</span>
    </div>
    <div className="content">
      <div className="model">
        {props.model.icon ? <ModelIcon model={props.model} /> : props.model.name}
      </div>
      {props.children}
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
  speed: number;
  afterRender?: () => void;
}

const CurrentStep = memo((props: CurrentStepProps) => {
  const thoughts = getThoughts(props.step);
  const chunks = thoughts.split('');
  const totalTime = getDelay(props.step) / props.speed;
  const chunkDelay = Math.floor(totalTime / chunks.length);
  return <StepOutline {...props} className='current-step'>
    <div class="thoughts">
      {thoughts ?
        <TextStream
          chunks={thoughts.split('')}
          chunkDelay={chunkDelay}
          afterRender={props.afterRender}>
          {(str) =>
            <Markdown>
              {str}
            </Markdown>
          }
        </TextStream> :
        'No thoughts'}
    </div>
  </StepOutline>
});


export const EventsPanel = () => {
  const { steps, models, playback } = useContext(StreamContext);
  const [expandedSteps, setExpandedSteps] = useState(new Set<number>());
  const stepsContainer = useRef<HTMLDivElement | null>();
  const currentStep = steps[steps.length - 1] ?? [];
  const currentStepAction = getActiveModelStep(currentStep);
  const currentModelIndex = models.findIndex((model) => model.id === currentStepAction?.modelId);
  const currentModel = models[currentModelIndex];

  if (!currentStepAction || !currentModel) {
    return <div className="events-panel empty">No steps have been taken yet</div>;
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
    const lineHeight = parseFloat(getComputedStyle(scrollContainer)?.lineHeight);
    const atBottom = scrollContainer.scrollTop + scrollContainer.offsetHeight + lineHeight >= scrollContainer.scrollHeight;
    if (atBottom) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight - scrollContainer.offsetHeight;
    }
  }

  return (
    <div className="events-panel">
      <div className="steps" ref={stepsContainer}>
        {
          steps.map((step, index) => {
            const activeModelStep = getActiveModelStep(step ?? []);
            if (!activeModelStep) return <></>;
            const stepIndex = index + 1;
            const modelId = activeModelStep.modelId;
            const modelIndex = models.findIndex((model) => model.id === modelId);
            const model = models[modelIndex];
            return <PreviousStep
              key={`${modelId}-${index}`}
              step={activeModelStep}
              model={model}
              stepIndex={stepIndex}
              playerNumber={modelIndex + 1}
              expanded={expandedSteps.has(stepIndex)}
              onExpand={() => toggleStepExpandion(stepIndex)} />;
          })
        }
        <CurrentStep
          step={currentStepAction}
          model={currentModel}
          stepIndex={steps.length}
          speed={playback.speed}
          afterRender={maybeScroll}
          playerNumber={currentModelIndex + 1} />
      </div>

      {!isDone && playback.playing && <AgentResponding model={currentModel} />}
    </div>
  );
}
