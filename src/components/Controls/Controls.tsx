import { useContext } from "preact/hooks";
import { StreamContext } from "../../context/StreamContext";
import './style.css';
import { IconButton } from "../IconButton/IconButton";

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
        setPlayback({ ...playback, currentStep: playback.currentStep + 1 });
    }

    return (
        <div className="controls">
            <IconButton onClick={replay} disabled={!playback.currentStep}>replay</IconButton>
            <IconButton onClick={previous} disabled={!playback.currentStep}>skip_previous</IconButton>
            <IconButton onClick={togglePlayback}>{playback.playing ? 'pause' : 'play_arrow'}</IconButton>
            <IconButton onClick={next} disabled={!steps.length || playback.currentStep >= steps.length}>skip_next</IconButton>
        </div>
    );
}
