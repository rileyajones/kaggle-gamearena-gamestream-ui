import { Step, StepAction, StepActionObject } from "../context/types";

export function getThoughts(step: Step) {
  if (isActionObject(step.action)) {
    return step.action.thoughts ?? '';
  }
  return '';
}

export function isActionObject(action: StepAction): action is StepActionObject {
  return typeof action === 'object';
}

export function getActionString(step: Step) {
  if (isActionObject(step.action)) {
    return step.action.actionString;
  }

  return step.action;
}

export function hasAction({action}: Step) {
  if (isActionObject(action)) {
    if (action.submission === -1) {
      return false;
    }
    return action.actionString !== '' || action.thoughts !== '';
  }
  return action !== '';
}

export function getActiveModelStep(steps: Step[]) {
  return steps.find(hasAction);
}

export function getDelay(step: Step|undefined) {
  const secondsTaken = step?.info?.timeTaken; 
  return secondsTaken ?  secondsTaken * 1000 : 0;
}
