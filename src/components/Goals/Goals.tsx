import targetIcon from '../../assets/target.png';
import { useContext } from "preact/hooks"
import { StreamContext } from "../../context/StreamContext"
import './style.css';

export const Goals = () => {
    const {currentModelId, goals} = useContext(StreamContext);
    const currentGoals = goals[currentModelId] ?? [];
    return <>
        <h2 class="goals-header"><img src={targetIcon} /> Goals</h2>
        <div class="goals-container">
            {currentGoals.map((goal, index) => <pre key={`${currentModelId}-${index}`}>{goal}</pre>)}
            {currentModelId} - {!currentGoals.length && 'No goals'}
        </div>
    </>
}
