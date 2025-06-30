import { Step, StepAction, StepActionObject } from "../context/types";

export function getThoughts(step: Step) {
  if (isActionObject(step.action)) {
    return step.action.thoughts ?? '';
  }
  // DO_NOT_SUBMIT this is a placeholder.
  return 'Model is thinking';
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
    return action.actionString !== '' || action.thoughts !== '';
  }
  return action !== '';
}

export function getActiveModelStep(steps: Step[]) {
  return steps.find(hasAction);
}

export function getDelay(step: Step) {
  return step.info?.timeTaken ?? 500;
}
