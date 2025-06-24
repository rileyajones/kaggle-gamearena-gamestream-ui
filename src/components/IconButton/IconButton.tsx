import { PropsWithChildren, memo } from "preact/compat";
import './style.css';

interface IconButtonProps extends PropsWithChildren {
    onClick?: () => void;
    disabled?: boolean;
}

export const IconButton = memo((props: IconButtonProps) => {
    return <button className="icon-button" onClick={props.onClick} disabled={props.disabled}>
        <div className="background"></div>
        <span className="material-icons icon">{props.children}</span>
    </button>
});
