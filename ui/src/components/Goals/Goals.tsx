import targetIcon from '../../assets/target.png';
import { useContext } from "preact/hooks"
import { StreamContext } from "../../context/StreamContext"
import './style.css';

export const Goals = () => {
    const { currentModelId, goals } = useContext(StreamContext);
    if (!currentModelId) <></>;
    const currentGoals = goals[currentModelId] ?? [];
    return <>
        <h2 className="goals-header"><img src={targetIcon} /> Goals</h2>
        <div className="goals-container">
            {currentGoals.map((goal, index) => <pre key={`${currentModelId}-${index}`}>{goal}</pre>)}
            {
                !currentGoals.length &&
                <>{currentModelId} - No goals</>
            }
        </div>
    </>
}
