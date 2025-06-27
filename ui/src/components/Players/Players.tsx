import { useContext } from 'preact/hooks';
import { StreamContext } from '../../context/StreamContext';
import { classNames } from '../../utils/classnames';
import { ModelIcon } from '../ModelIcon/ModelIcon';
import './style.scss';

export const Players = () => {
  const { models, currentModelId } = useContext(StreamContext);
  return <ul className="players-list">
    {models.map((model, index) =>
      <>
        <li key={model.id} className={classNames(model.id === currentModelId && 'active')}>
          {model.icon && <ModelIcon model={model} retro={true} />}
          <div className="text">
            <div className="name">
              {model.name}
            </div>
            {
              model.winLoss &&
              <div className="win-loss">
                Win {model.winLoss.numerator} Loss {model.winLoss.denominator}
              </div>
            }</div>
          <h2 className="rank" contentEditable={true} role="input">{model.rank}</h2>
        </li>
        {index < models.length - 1 && <span className="vs">vs</span>}
      </>
    )}
  </ul>
}
