import { useContext } from "preact/hooks";
import { StreamContext } from "../../context/StreamContext";

export const StreamTitle = () => {
    const streamContext = useContext(StreamContext);

    return <h1>Game Arena - {streamContext.game.name}</h1>;
}
