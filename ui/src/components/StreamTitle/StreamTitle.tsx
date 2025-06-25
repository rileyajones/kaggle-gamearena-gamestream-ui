import { useContext } from "preact/hooks";
import { StreamContext } from "../../context/StreamContext";
import './style.css'

export const StreamTitle = () => {
    const { episode } = useContext(StreamContext);
    const title = episode?.title;
    if (!title) return <></>;

    return <h1 className="stream-title">Game Arena - {title}</h1>;
};
