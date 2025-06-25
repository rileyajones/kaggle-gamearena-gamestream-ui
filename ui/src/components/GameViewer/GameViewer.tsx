import { useContext, useEffect, useRef, useState } from "preact/hooks";
import { StreamContext } from "../../context/StreamContext";
import { classNames } from "../../utils/classnames";
import './style.css';

export const GameViewer = () => {
    const { steps, episode, game, playback } = useContext(StreamContext);
    const [loaded, setLoaded] = useState(false);
    const iframeRef = useRef();

    const currentIframe = iframeRef?.current as HTMLIFrameElement | undefined;
    const fullyInitialized = currentIframe && game.viewerUrl && loaded;

    useEffect(() => {
        if (!fullyInitialized) return;
        const windowKaggle = {
            'debug': false,
            'playing': false,
            'loading': false,
            'header': false,
            'controls': false,
            'mode': 'html',
            'logs': [[]],
            'step': playback.currentStep,
            'environment': {
                ...episode,
                'rendererUrl': game.rendererUrl,
                'viewer': 'gamestream',
            },
        };

        currentIframe.contentWindow.postMessage(windowKaggle, currentIframe.src);
        // Waiting a couple milliseconds for the frame to rerender.
        setTimeout(() => {
            currentIframe.contentWindow.postMessage({ setSteps: steps }, game.viewerUrl);
        }, 200);
    }, [fullyInitialized, playback, steps]);


    function maybeSetLoaded() {
        if (!game.viewerUrl) return;
        // Kick this to the back of the stack to ensure the render is complete.
        setTimeout(() => {
            setLoaded(true);
        });
    }

    return <iframe
        ref={iframeRef}
        src={game.viewerUrl}
        className={classNames(!fullyInitialized && 'hidden')}
        onLoad={maybeSetLoaded}></iframe>;
}
