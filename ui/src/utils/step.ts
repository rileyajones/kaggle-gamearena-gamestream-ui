import { Playback, Step, StepAction, StepActionObject } from "../context/types";
import { generateChunks } from "../context/utils";

export function getThoughts(step: Step) {
  if (isActionObject(step.action)) {
    const thoughts = step.action.thoughts ?? '';
    const rethinks = thoughts.split('RETHINK');
    return rethinks[rethinks.length - 1];
  }
  if (hasTimeout(step)) return 'Timeout';
  return '';
}

export function isActionObject(action: StepAction): action is StepActionObject {
  if (action == null) return false;
  return typeof action === 'object';
}

export function getActionString(step: Step) {
  if (isActionObject(step.action)) {
    return step.action.actionString;
  }

  return step.action;
}

export function isSetup(actions: Step[]) {
  return actions.every(({action}) => {
    if (isActionObject(action)) {
      return action.submission === -1;
    }
    return action == '-1';
  });
}

export function hasAction({action}: Step) {
  if (!action) return false;
  if (isActionObject(action)) {
    return action.actionString || action.thoughts;
  }
  return action !== '';
}

export function hasTimeout({status}: Step) {
  return status === 'TIMEOUT';
}

export function getActiveModelStep(steps: Step[]) {
  return steps.find(hasAction) ?? steps.find(hasTimeout);
}

export function getTurnTime(step: Step|undefined, playback: Playback) {
  const drawTime = getTextDrawTime(step, playback);
  return drawTime + 2000;
}

export function getTextDrawTime(step: Step|undefined, playback: Playback) {
  const thoughts = getThoughts(step);
  if (thoughts) {
    const chunks = generateChunks(thoughts, playback.chunkBy);
    return (chunks.length * Math.floor(playback.textSpeed / playback.speed));
  }
  const secondsTaken = step?.info?.timeTaken; 
  return secondsTaken ?  secondsTaken * 1000 : 0;
}

export function containsIllegalMove(stepIndex: number, actions: Step[]) {
  const allSubmissionsInvalid = actions.every(({action}) => {
    if (isActionObject(action)) {
      return action.submission === -1;
    }
    return action == '-1';
  });

  return stepIndex && allSubmissionsInvalid;
}
