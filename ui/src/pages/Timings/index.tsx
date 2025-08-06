import { useContext, useState } from 'preact/hooks';
import './style.scss';
import { StreamContext } from '../../context/StreamContext';
import { getActiveModelStep, getTurnTime } from '../../utils/step';


export const Timings = () => {
  const { episode, playback } = useContext(StreamContext);
  const [observeredT1, setObservedT1] = useState('');
  const [observeredT2, setObservedT2] = useState('');
  const [relativeTimings, setRelativeTimings] = useState(false)
  const allSteps = episode?.steps.slice(2) ?? [];
  const observedT1Lines = observeredT1.split('\n')
    .filter(Boolean)
    .map((timing) => Number.parseInt(timing));
  const relativeT1Lines = observedT1Lines.map((timing, index) => {
    if (index == 0) {
      return 0
    }
    return timing - observedT1Lines[index - 1];
  });

  const observedT2Lines = observeredT2.split('\n')
    .filter(Boolean)
    .map((timing) => Number.parseInt(timing));
  const relativeT2Lines = observedT2Lines.map((timing, index) => {
    if (index == 0) {
      return 0
    }
    return timing - observedT1Lines[index - 1];
  });

  const t1Lines = relativeTimings ? relativeT1Lines : observedT1Lines;
  const t2Lines = relativeTimings ? relativeT2Lines : observedT2Lines;

  return <div>
    <h1>Estimated Timings</h1>
    {/* <input type="checkbox" value={relativeTimings} onChange={(e) => setRelativeTimings(e.target.value)}></input> */}
    <textarea
      value={observeredT1}
      onChange={(e) => setObservedT1((e.target as HTMLInputElement).value)}></textarea>
    <textarea
      value={observeredT2}
      onChange={(e) => setObservedT2((e.target as HTMLInputElement).value)}></textarea>
    <table>
      <thead>
        <tr>
          <th>Index</th>
          <th>{episode?.info?.EpisodeId}</th>
          <th>T1</th>
          <th>T2</th>
          <th>Diff</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>0</td>
          <td>0</td>
          <td>{t1Lines[0]}</td>
          <td>{t2Lines[0]}</td>
          <td>0</td>
        </tr>
        {allSteps.map((steps, i) => {
          const step = getActiveModelStep(allSteps[i]);
          const timeTaken = getTurnTime(step, playback);
          const t1 = t1Lines[i + 1];
          const t2 = t2Lines[i + 1];
          const diff = t2 - t1;

          return <tr key={i}>
            <td>{i + 1}</td>
            <td>{timeTaken}</td>
            {t1 && <td>{t1}</td>}
            {t2 && <td>{t2}</td>}
            {!Number.isNaN(diff) && <td>{diff}</td>}
          </tr>;
        })}
      </tbody>
    </table>
  </div>
};
