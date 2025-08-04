import { useContext, useState } from "preact/hooks";
import { StreamContext } from "../../context/StreamContext";
import './style.scss';
import { IconButton } from "../IconButton/IconButton";
import { getGameOverText } from "../../context/utils";

export const GameOverModal = () => {
  const { steps, playback, episode } = useContext(StreamContext);
  const [open, setOpen] = useState(true);
  const gameOverText = getGameOverText(episode, playback, steps);

  if (!open) {
    return <></>;
  }

  return (
    <dialog open={open} className="game-over-modal">
      <IconButton className="close-btn" onClick={() => setOpen(false)}>close</IconButton>
      {gameOverText}
    </dialog >
  )
};
