import { useContext, useEffect, useRef, useState } from "preact/hooks";
import { StreamContext } from "../../context/StreamContext";
import { classNames } from "../../utils/classnames";
import './style.scss';
import { GameOverModal } from "./GameOverModal";
import { sleep } from "../../context/utils";
import { getActiveModelStep, getTurnTime } from "../../utils/step";

export const GameViewer = () => {
  const { steps, episode, game, playback, setPlayback } = useContext(StreamContext);
  const [loaded, setLoaded] = useState(false);
  const iframeRef = useRef();

  const currentIframe = iframeRef?.current as HTMLIFrameElement | undefined;
  const fullyInitialized = currentIframe && game.viewerUrl && loaded;
  const isDone = steps[steps.length - 1]?.every((action) => action.status === 'DONE');

  const showGameCompleteBanner = isDone && playback.currentStep === steps.length;


  useEffect(() => {
    const currentStep = steps[playback.currentStep];
    const windowKaggle = {
      'debug': false,
      'playing': false,
      'loading': false,
      'header': false,
      'controls': false,
      'mode': 'html',
      'logs': [[]],
      // Setup steps are removed from the stream ui steps, so we need to account for them here.
      'step': playback.currentStep + playback.setupStepCount,
      'environment': {
        ...episode,
        'rendererUrl': game.rendererUrl,
        'viewer': 'gamestream',
      },
    };

    // Note that the viewer blanks out the board when the final step is "done"
    if (!fullyInitialized) return;
    if (!currentStep) {
      (async () => {
        currentIframe.contentWindow.postMessage({
          ...windowKaggle,
          'step': 1
        }, currentIframe.src);
        await sleep(200);
        currentIframe.contentWindow.postMessage({ setSteps: episode.steps }, game.viewerUrl);
        if (playback.autoPlay && !playback.playing) {
          setPlayback({ ...playback, playing: true });
        }
      })();

      return;
    }
    (async () => {
      // If the game is playing, wait for the text to finish streaming.
      if (playback.playing) {
        await sleep(getTurnTime(getActiveModelStep(currentStep), playback));
      }
      currentIframe.contentWindow.postMessage(windowKaggle, currentIframe.src);
      // Waiting a couple milliseconds for the frame to rerender.
      await sleep(200);
      currentIframe.contentWindow.postMessage({ setSteps: episode.steps }, game.viewerUrl);
    })();
  }, [fullyInitialized, playback, steps]);


  function maybeSetLoaded() {
    if (!game.viewerUrl) return;
    // Kick this to the back of the stack to ensure the render is complete.
    setTimeout(() => {
      setLoaded(true);
    });
  }

  return (
    <div className={classNames('game-viewer', !fullyInitialized && 'hidden')}>
      <div className="playback-banner">
        <span className="material-icons">info</span>
        Turn times have been modified.
      </div>
      <iframe
        ref={iframeRef}
        src={game.viewerUrl}
        onLoad={maybeSetLoaded}></iframe>
      {showGameCompleteBanner && <GameOverModal />}
    </div>
  );
}
