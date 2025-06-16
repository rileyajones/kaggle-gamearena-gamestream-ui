import { useContext } from "preact/hooks";
import { StreamContext } from "../../context/StreamContext"

export const Moves = () => {
    const streamContext = useContext(StreamContext);
    return <table class="moves-table">
        <thead>
            {streamContext.models.map((model) => <th key={model.id}>
                <img src={model.icon} />
            </th>)}
        </thead>
        <tbody>
            {streamContext.turns.map((turn) =>
                <tr>
                    {streamContext.models.map((model) => <td>{turn.modelId === model.id ? turn.gameData as any : ''}</td>)}
                </tr>
            )}
        </tbody>
    </table>
}
