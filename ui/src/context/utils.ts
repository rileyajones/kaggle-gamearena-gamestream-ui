import { containsIllegalMove, hasTimeout } from "../utils/step";
import { Episode, Playback, Step } from "./types";

/** Reads a stream of data */
export async function* readStreamChunks(
  url: string,
  options?: RequestInit
): AsyncGenerator<{ value: Uint8Array | undefined, done: boolean }, void, undefined> {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    if (!response.body) {
      throw new Error('Response body is null or undefined. No stream to read.');
    }

    const reader = response.body.getReader();

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        yield { done, value };
        break;
      }

      if (value) {
        yield { done, value };
      }
    }
  } catch (error) {
    console.error('Error reading stream:', error);
    throw error;
  }
}

/** Waits for a specified number of milliseconds */
export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Generates a list of numbers of a specified length whose sum is a specified value
 * and who match a bezier curve distribution.
 *
 * @param length The desired number of values to generate.
 * @param sum The target sum of the generated values.
 * @param p1 The y-coordinate of the first control point of the Bezier curve (p0 is at (0,0)).
 * @param p2 The y-coordinate of the second control point of the Bezier curve (p3 is at (1,0)).
 * @returns An array of numbers that follow the specified distribution and sum.
 */
function generateBezierDistribution(length: number, sum: number, p1: number, p2: number): number[] {
  if (length <= 0) {
    return [];
  }

  // Helper function to calculate a point on a cubic Bezier curve.
  // The curve is defined by four points: P0, P1, P2, and P3.
  // We assume P0 at (0, 0) and P3 at (1, 0) to create a distribution shape.
  const cubicBezier = (t: number, p1_y: number, p2_y: number): number => {
    const p0_y = 0;
    const p3_y = 0;

    // The Bernstein polynomial for a cubic Bezier curve
    const y =
      Math.pow(1 - t, 3) * p0_y +
      3 * Math.pow(1 - t, 2) * t * p1_y +
      3 * (1 - t) * Math.pow(t, 2) * p2_y +
      Math.pow(t, 3) * p3_y;
    return y;
  };

  const rawValues: number[] = [];
  let rawSum = 0;

  // Generate the raw values from the Bezier curve
  for (let i = 0; i < length; i++) {
    const t = i / (length - 1);
    const value = cubicBezier(t, p1, p2);
    rawValues.push(value);
    rawSum += value;
  }

  // If the raw sum is zero, we can't scale. Return an array of zeros.
  if (rawSum === 0) {
    return Array(length).fill(0);
  }

  // Calculate the scaling factor
  const scale = sum / rawSum;

  // Scale the raw values to match the desired sum
  const finalValues = rawValues.map(value => value * scale);

  return finalValues;
}

/**
 * Generates a list of numbers following an "ease-in" distribution.
 * The distribution starts slowly and accelerates, based on a quadratic curve (t^2).
 *
 * @param length The desired number of values to generate.
 * @param sum The target sum of the generated values.
 * @returns An array of numbers that follow the ease-in distribution and sum.
 */
function generateEaseInDistribution(length: number, sum: number): number[] {
    if (length <= 0) {
        return [];
    }
    // Handle the edge case of a single value.
    if (length === 1) {
        return [sum];
    }

    // An "ease-in" quadratic easing function. y = t^2
    const easeIn = (t: number): number => {
        return t * t;
    };

    const rawValues: number[] = [];
    let rawSum = 0;

    // Generate the raw values from the easing curve
    for (let i = 0; i < length; i++) {
        const t = i / (length - 1); // Safe now because length > 1
        const value = easeIn(t);
        rawValues.push(value);
        rawSum += value;
    }

    // If the raw sum is zero, we can't scale. This shouldn't happen for ease-in with length > 1.
    if (rawSum === 0) {
        return Array(length).fill(0);
    }

    // Calculate the scaling factor
    const scale = sum / rawSum;

    // Scale the raw values to match the desired sum
    const finalValues = rawValues.map(value => value * scale);

    return finalValues;
}


function generateDelayDistribution(chunkCount: number, average: number, min: number): number[] {
  if (average <= min) {
    return Array.from({length: chunkCount}).fill(average) as number[];
  }
  
  const totalTime = (average ?? 10) * chunkCount;
  return generateEaseInDistribution(chunkCount, totalTime);
}

/** Simulates text streaming in */
export async function* streamString(chunks: string[], options?: { abortController: AbortController, chunkDelay?: number }) {
  let buffer = '';
  const delays = generateDelayDistribution(chunks.length, options?.chunkDelay ?? 10, 1);
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    if (options.abortController?.signal.aborted) {
      return;
    }
    await sleep(delays[i]);
    buffer += chunk;
    yield buffer;
  }
}

export function generateChunks(str: string, chunkBy?: string) {
  if (chunkBy === 'word') {
    return str.split(' ').map((chunk) => chunk + ' ');
  }
  return str.split('');
}

export function getGameOverText(episode: Episode, playback: Playback, steps: Step[][]) {
  const currentStep = steps[Math.min(playback.currentStep, steps.length - 1)];
  const endedDueToIllegalMove = currentStep && containsIllegalMove(playback.currentStep, currentStep);
  const winnerIndex = episode.rewards.findIndex((reward) => reward > 0);
  const isDraw = winnerIndex === undefined;
  const winner = episode.info.TeamNames[winnerIndex];
  const isTimeout = currentStep.some((step) => hasTimeout(step));

  if (endedDueToIllegalMove) {
    return 'The game ended due to an illegal move';
  }
  if (isDraw) {
    return 'The game has ended in a draw';
  }
  if (winner) {
    return `${winner} wins`;
  }

  if (isTimeout) {
    return `The game ended in a timeout`;
  }

  return undefined;
}
