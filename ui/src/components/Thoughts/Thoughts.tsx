import neurologyIcon from '../../assets/neurology.png';
import { useContext } from "preact/hooks"
import { StreamContext } from "../../context/StreamContext"
import './style.css';

export const Thoughts = () => {
    const { currentModelId, thoughts } = useContext(StreamContext);
    if (!currentModelId) <></>;
    const currentThoughts = thoughts[currentModelId] ?? [];

    return <>
        <h2 className="thoughts-header"><img src={neurologyIcon} /> Thoughts</h2>
        <div className="thoughts-container">
            {currentThoughts.map((thought, index) => <pre key={`${currentModelId}-${index}`}>{thought}</pre>)}
            {
                !currentThoughts.length &&
                <>{currentModelId} - No thoughts</>
            }
        </div>
    </>
}
