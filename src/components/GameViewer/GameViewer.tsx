import { useContext, useEffect, useRef, useState } from "preact/hooks";
import { StreamContext } from "../../context/StreamContext";
import './style.css';
import { classNames } from "../../utils/classnames";

export const GameViewer = () => {
    const { steps, episode, game } = useContext(StreamContext);
    const [initialized, setInitialized] = useState(false)
    const iframeRef = useRef();
    useEffect(() => {
        const currentIframe = iframeRef?.current as HTMLIFrameElement | undefined;
        if (!currentIframe || !game.viewerUrl) return;
        const windowKaggle = {
            'debug': false,
            'playing': false,
            'loading': false,
            'header': false,
            'controls': false,
            'mode': 'html',
            'logs': [[]],
            'step': steps.length,
            'environment': {
                ...episode,
                'gamestream': true,
            },
        };

        currentIframe.contentWindow.postMessage(windowKaggle, currentIframe.src);
        // Waiting a couple milliseconds for the frame to rerender.
        setTimeout(() => {
            currentIframe.contentWindow.postMessage({ setSteps: steps.map((step) => [step[0], step[1]]) }, game.viewerUrl);
            setInitialized(true);
        }, 200);
    }, [iframeRef, steps]);

    return <iframe ref={iframeRef} src={game.viewerUrl} className={classNames(!initialized && 'hidden')}></iframe>
}
