import { useContext } from "preact/hooks";
import { StreamContext } from "../../context/StreamContext"
import './style.css';

export const Moves = () => {
    const streamContext = useContext(StreamContext);
    return (
        <div class="moves-table-container">
            <table class="moves-table">
                <thead>
                    <tr>
                        {streamContext.models.map((model) => <th key={model.id}>
                            <img src={model.icon} />
                        </th>)}
                    </tr>
                </thead>
                <tbody>
                    {streamContext.turns.map((turn) =>
                        <tr>
                            {streamContext.models.map((model) => <td>{turn.modelId === model.id ? turn.gameData as any : ''}</td>)}
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
