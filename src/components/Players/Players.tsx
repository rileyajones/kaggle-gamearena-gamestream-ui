import { useContext } from "preact/hooks"
import { StreamContext } from "../../context/StreamContext"

export const Players = () => {
    const streamContext = useContext(StreamContext);
    return <ul>
        {streamContext.models.map((model) => <li key={model.id}>{model.name}</li>)}
    </ul>
}
