import { useContext } from 'preact/hooks';
import { StreamContext } from '../../context/StreamContext';
import './style.css';
import { classNames } from '../../utils/classnames';

export const Players = () => {
    const { models, currentModelId } = useContext(StreamContext);
    return <ul className="players-list">
        {models.map((model, index) =>
            <>
                <li key={model.id} className={classNames(model.id === currentModelId && 'active')}>
                    <div className="name">
                        {model.name}
                    </div>
                    {
                        model.rank &&
                        <div className="rank">
                            {model.rank.numerator}/{model.rank.denominator}
                        </div>
                    }

                    {model.icon && <img src={model.icon} />}
                </li>
                {index < models.length - 1 && 'vs'}
            </>
        )}
    </ul>
}
