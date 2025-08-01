import { useContext, useState } from "preact/hooks";
import { StreamContext } from "../../context/StreamContext";
import { containsIllegalMove } from "../../utils/step";
import './style.scss';
import { IconButton } from "../IconButton/IconButton";

export const GameOverModal = () => {
  const { steps, playback, episode } = useContext(StreamContext);
  const [open, setOpen] = useState(true);
  const currentStep = steps[Math.min(playback.currentStep, steps.length - 1)];
  const endedDueToIllegalMove = currentStep && containsIllegalMove(playback.currentStep, currentStep);
  const winnerIndex = episode.rewards.find((reward) => reward !== 0);
  const isDraw = winnerIndex === undefined;
  const winner = episode.info.TeamNames[winnerIndex];

  if (!open) {
    return <></>;
  }

  return (
    <dialog open={open} className="game-over-modal">
      <IconButton className="close-btn" onClick={() => setOpen(false)}>close</IconButton>
      {endedDueToIllegalMove && 'The game ended due to an illegal move'}
      {isDraw && 'The game has ended in a draw'}
      {winner && `${winner} wins`}
    </dialog >
  )
};
