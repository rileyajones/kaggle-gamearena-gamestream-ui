import { PropsWithChildren, memo } from "preact/compat";
import { classNames } from '../../utils/classnames';
import './style.css';

export interface ButtonProps extends PropsWithChildren {
  onClick?: (event: MouseEvent) => void;
  disabled?: boolean;
  className?: string;
  tooltip?: string;
}

export const Button = memo((props: ButtonProps) => {
  return <button className={classNames('button', props.className)}
    title={props.tooltip}
    onClick={props.onClick}
    disabled={props.disabled}>
    <div className="background"></div>
    <span class="contents">{props.children}</span>
  </button>
});
