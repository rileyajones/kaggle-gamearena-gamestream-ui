import { ModelMetadata } from "../../context/types";
import { classNames } from '../../utils/classnames';
import './style.scss';

interface ModelIconProps {
  model: ModelMetadata;
  retro?: boolean;
}

export const ModelIcon = ({ model, retro }: ModelIconProps) => {
  return <div className={classNames("model-icon", retro && 'retro')}>
    {
      retro &&
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
        <path d="M33.7778 0H14.2222V3.11102H7.55556V7.11111H3.55556V14.2222H0V33.7778H3.55556V40.8889H7.55556V44.8888H14.2222V48H33.7778V44.8888H40.4444V40.8889H44.4444V33.7778H48V14.2222H44.4444V7.11111H40.4444V3.11102H33.7778V0Z" fill="#E8EAED" />
      </svg>
    }
    <img className="icon" src={model.icon} />
  </div>
};
