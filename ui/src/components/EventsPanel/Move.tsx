import { memo } from "preact/compat";
import { Step } from "../../context/types";
import './style.scss';
import { getActionString } from "../../utils/step";

interface MoveProps {
  step: Step;
}

export const Move = memo(({ step }: MoveProps) => {
  if (!step.action) return <></>;

  return (
    <div className="move">
      <span className="material-icons">arrow_forward</span>
      <span className="action">{getActionString(step)}</span>
    </div>
  );
});
