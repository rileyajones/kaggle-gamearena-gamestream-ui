import { useEffect, useState } from "preact/hooks";
import { streamString } from "../../context/utils";

interface TextStreamProps {
  chunkDelay?: number;
  chunks: string[];
}

const textStreams: AbortController[] = [];

export const TextStream = (props: TextStreamProps) => {
  const [text, setText] = useState('')

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

  }, [props.chunks]);

  return <>{text}</>;
}
