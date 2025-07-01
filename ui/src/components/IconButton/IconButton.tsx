import { PropsWithChildren, memo } from "preact/compat";
import { Button } from "../Button/Button";
import './style.css';

interface IconButtonProps extends PropsWithChildren {
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export const IconButton = memo((props: IconButtonProps) => {
  return <Button {...props}>
    <span className="material-icons icon">{props.children}</span>
  </Button>
});

