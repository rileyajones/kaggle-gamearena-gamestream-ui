import { useEffect, useState } from "preact/hooks";
import { streamString } from "../../context/utils";
import { memo, PropsWithChildren } from 'preact/compat';

interface TextStreamProps {
  chunkDelay?: number;
  chunks: string[];
  afterRender?: (done: boolean) => void;
  children?: (str: string) => PropsWithChildren['children'];
}

const textStreams: AbortController[] = [];

export const TextStream = memo((props: TextStreamProps) => {
  const [text, setText] = useState('');

  useEffect(() => {
    (async () => {
      while (textStreams.length) {
        const controller = textStreams.pop();
        controller.abort();
      }
      const abortController = new AbortController();
      textStreams.push(abortController);
      for await (const nextText of streamString(props.chunks, { abortController, chunkDelay: props.chunkDelay })) {
        if (abortController.signal.aborted) {
          return;
        }
        setText(nextText);
      }
    })();

  }, [props.chunks.join('')]);

  // Ensure the afterRender function is pushed to the end of the stack.
  setTimeout(() => props.afterRender?.(text === props.chunks.join('')));
  return props.children?.(text) ?? text;
});
