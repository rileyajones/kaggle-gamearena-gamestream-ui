import { useContext } from "preact/hooks";
import { StreamContext } from "../../context/StreamContext";
import { IconButton } from "../IconButton/IconButton";
import { Button } from "../Button/Button";
import './style.scss';

const SPEEDS = [
  0.25,
  0.5,
  0.75,
  1,
  1.5,
  2,
  3,
  5,
]

export const Controls = () => {
  const { playback, setPlayback, steps } = useContext(StreamContext);

  function togglePlayback() {
    setPlayback({ ...playback, playing: !playback.playing });
  }

  function replay() {
    setPlayback({ ...playback, currentStep: 0 });
  }

  function previous() {
    setPlayback({ ...playback, currentStep: playback.currentStep - 1 });
  }

  function next() {
    setPlayback({ ...playback, currentStep: Math.min(playback.currentStep + 1, steps.length - 1) });
  }

  function toggleSpeed() {
    const currentIndex = SPEEDS.indexOf(playback.speed);
    const nextIndex = (currentIndex + 1) % SPEEDS.length;
    setPlayback({ ...playback, speed: SPEEDS[nextIndex] });
  }

  return (
    <div className="controls">
      <IconButton onClick={replay} disabled={!playback.currentStep}>replay</IconButton>
      <IconButton onClick={previous} disabled={!playback.currentStep}>skip_previous</IconButton>
      <IconButton onClick={togglePlayback}>{playback.playing ? 'pause' : 'play_arrow'}</IconButton>
      <IconButton onClick={next} disabled={!steps.length || playback.currentStep >= steps.length - 1}>skip_next</IconButton>
      <Button onClick={toggleSpeed}>{playback.speed}x</Button>
    </div>
  );
}
