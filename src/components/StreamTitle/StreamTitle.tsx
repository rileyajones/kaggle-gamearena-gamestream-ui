import { useContext } from "preact/hooks";
import { StreamContext } from "../../context/StreamContext";
import './style.css'

export const StreamTitle = () => {
    const streamContext = useContext(StreamContext);

    return <h1 class="stream-title">Game Arena - {streamContext.game.name}</h1>;
}
