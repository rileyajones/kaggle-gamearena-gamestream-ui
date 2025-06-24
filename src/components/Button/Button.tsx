import { PropsWithChildren, memo } from "preact/compat";
import './style.css';

interface ButtonProps extends PropsWithChildren {
    onClick?: () => void;
    disabled?: boolean;
}

export const Button = memo((props: ButtonProps) => {
    return <button className="button" onClick={props.onClick} disabled={props.disabled}>
        <div className="background"></div>
        <span class="contents">{props.children}</span>
    </button>
});
