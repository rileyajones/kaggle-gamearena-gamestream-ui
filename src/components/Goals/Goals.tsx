import targetIcon from '../../assets/target.png';
import { useContext } from "preact/hooks"
import { StreamContext } from "../../context/StreamContext"
import './style.css';

export const Goals = () => {
    const streamContext = useContext(StreamContext);
    const currentModelId = streamContext.turns[streamContext.turns.length - 1]?.modelId;
    const currentGoals = streamContext.goals[currentModelId] ?? [];
    return <>
        <h2 class="goals-header"><img src={targetIcon} /> Goals</h2>
        <div>
            {currentGoals.map((goal, index) => <pre key={`${currentModelId}-${index}`}>{goal}</pre>)}
        </div>
    </>
}
