import neurologyIcon from '../../assets/neurology.png';
import { useContext } from "preact/hooks"
import { StreamContext } from "../../context/StreamContext"
import './style.css';

export const Thoughts = () => {
    const {currentModelId, thoughts} = useContext(StreamContext);
    const currentThoughts = thoughts[currentModelId] ?? [];

    return <>
        <h2 class="thoughts-header"><img src={neurologyIcon} /> Thoughts</h2>
        <div class="thoughts-container">
            {currentThoughts.map((thought, index) => <pre key={`${currentModelId}-${index}`}>{thought}</pre>)}
            {currentModelId} - {!currentThoughts.length && `No thoughts`}
        </div>
    </>
}
