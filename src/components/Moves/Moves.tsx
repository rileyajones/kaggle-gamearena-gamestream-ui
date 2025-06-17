import { useContext, useRef, useEffect } from "preact/hooks";
import { StreamContext } from "../../context/StreamContext"
import {type Step} from '../../context/types';
import './style.css';

export const Moves = () => {
    const {models, steps} = useContext(StreamContext);
    const movesContainer = useRef();

    // Pivot the steps by model, then join by index
    const stepsByModelIndex = models.map((model, index) => {
        return steps.flat().filter((step) => step.modelId === model.id && step?.gameData?.action);
    });
    const rows: Array<[Step|undefined, Step|undefined]> = [];
    for(let i = 0; i < stepsByModelIndex[0]?.length ?? 0; i++) {
        rows.push(
            stepsByModelIndex.map((modelSteps) => modelSteps[i])
        );
    }
    useEffect(() => {
        const element = movesContainer?.current;
        if (!element) return;
        element.scrollTop = element.scrollHeight;
    }, [movesContainer, rows.length]);

    return (
        <div class="moves-table-container" ref={movesContainer}>
            <table class="moves-table">
                <thead>
                    <tr>
                        {models.map((model) => <th key={model.id}>
                            {model.icon ? <img src={model.icon} /> : model.name}
                        </th>)}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((steps) =>
                        <tr>
                            {steps.map((step) => <td>{(step?.gameData as any)?.action ?? ''}</td>)}
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
