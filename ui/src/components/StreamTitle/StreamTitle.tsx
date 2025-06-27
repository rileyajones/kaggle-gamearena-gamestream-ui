import { useContext } from "preact/hooks";
import { StreamContext } from "../../context/StreamContext";
import './style.scss'

export const StreamTitle = () => {
  const { episode } = useContext(StreamContext);
  const title = episode?.title;
  if (!title) return <></>;

  return (
    <>
      <h1 className="stream-title">Game Arena - {title}</h1>
      <h2 className="sub-title" contentEditable={true} role="input"></h2>
    </>
  );
};
