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

export function isSetup(actions: Step[]) {
  return actions.every(({action}) => {
    if (isActionObject(action)) {
      return action.submission === -1;
    }
    return action == '-1';
  });
}

export function hasAction({action}: Step) {
  if (isActionObject(action)) {
    return action.actionString || action.thoughts;
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

export function containsIllegalMove(stepIndex: number, actions: Step[]) {
  const allSubmissionsInvalid = actions.every(({action}) => {
    if (isActionObject(action)) {
      return action.submission === -1;
    }
    return action == '-1';
  });

  return stepIndex && allSubmissionsInvalid;
}
