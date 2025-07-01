import { memo } from "preact/compat";
import { Button, ButtonProps } from "../Button/Button";
import './style.css';

type IconButtonProps = ButtonProps;

export const IconButton = memo((props: IconButtonProps) => {
  return <Button {...props}>
    <span className="material-icons icon">{props.children}</span>
  </Button>
});
