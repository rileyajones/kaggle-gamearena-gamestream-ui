import { useContext } from 'preact/hooks';
import { StreamContext } from '../../context/StreamContext';
import './style.css';

export const Players = () => {
    const streamContext = useContext(StreamContext);
    return <ul class="players-list">
        {streamContext.models.map((model, index) =>
            <>
                <li key={model.id}>
                    <div class="name">
                        {model.name}
                    </div>
                    <div class="rank">
                        {model.rank.numerator}/{model.rank.denominator}
                    </div>
                    <img src={model.icon} />
                </li>
                {index < streamContext.models.length - 1 && 'vs'}
            </>
        )}
    </ul>
}
