import neurologyIcon from '../../assets/neurology.png';
import { useContext } from "preact/hooks"
import { StreamContext } from "../../context/StreamContext"
import './style.css';

export const Thoughts = () => {
    const streamContext = useContext(StreamContext);
    const currentModelId = streamContext.turns[streamContext.turns.length - 1]?.modelId;
    const currentThoughts = streamContext.thoughts[currentModelId] ?? [];

    return <>
        <h2 class="thoughts-header"><img src={neurologyIcon} /> Thoughts</h2>
        <div>
            {currentThoughts.map((thought, index) => <pre key={`${currentModelId}-${index}`}>{thought}</pre>)}
        </div>
    </>
}
