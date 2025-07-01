import { PropsWithChildren, memo } from "preact/compat";
import {classNames} from '../../utils/classnames';
import './style.css';

interface ButtonProps extends PropsWithChildren {
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
}

export const Button = memo((props: ButtonProps) => {
    return <button className={classNames('button', props.className)}
              onClick={props.onClick}
              disabled={props.disabled}>
        <div className="background"></div>
        <span class="contents">{props.children}</span>
    </button>
});
