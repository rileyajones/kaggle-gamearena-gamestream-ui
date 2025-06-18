import { useContext, useRef, useEffect } from "preact/hooks";
import { StreamContext } from "../../context/StreamContext"
import { type Step } from '../../context/types';
import './style.css';

export const Moves = () => {
    const { models, steps } = useContext(StreamContext);
    const movesContainer = useRef();

    // Pivot the steps by model, then join by index
    const stepsByModelIndex = models.map((model) => {
        return steps.flat().filter((step) => step.modelId === model.id && step?.action);
    });
    const rows: Array<Array<Step | undefined>> = [];
    for (let i = 0; i < stepsByModelIndex[0]?.length ?? 0; i++) {
        rows.push(
            stepsByModelIndex.map((modelSteps) => modelSteps[i])
        );
    }
    useEffect(() => {
        const element = movesContainer?.current as HTMLElement | undefined;
        if (!element) return;
        element.scrollTop = element.scrollHeight;
    }, [movesContainer, rows.length]);

    return (
        <div className="moves-table-container" ref={movesContainer}>
            <table className="moves-table">
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
                            {steps.map((step) => <td>{step?.action ?? ''}</td>)}
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
