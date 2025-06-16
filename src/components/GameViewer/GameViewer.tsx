import { useContext } from "preact/hooks"
import { StreamContext } from "../../context/StreamContext"

export const GameViewer = () => {
    const streamContext = useContext(StreamContext);

    return <iframe src={streamContext.game.viewerUrl}></iframe>
}
