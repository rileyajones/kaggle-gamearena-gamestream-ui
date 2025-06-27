import { useEffect, useState } from 'preact/hooks';
import { ModelMetadata } from '../../context/types';
import { sleep } from '../../context/utils';
import './style.scss';

interface AgentRespondingProps {
    model: ModelMetadata;
}

export const AgentResponding = (props: AgentRespondingProps) => {
    const [dotCount, setDotCount] = useState(0);
    useEffect(() => {
        (async () => {
            await sleep(250);
            setDotCount((dotCount + 1) % 4);
        })();
    }, [dotCount]);

    return <div className="agent-responding">
        {props.model.name} is responding{Array.from({ length: dotCount }, () => <>.</>)}
    </div>
}

