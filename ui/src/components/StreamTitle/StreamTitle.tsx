import { useContext } from 'preact/hooks';
import { memo } from 'preact/compat';
import { StreamContext } from '../../context/StreamContext';
import './style.scss'
import { streamString } from '../../context/utils';

export const StreamTitle = memo(() => {
  const { episode } = useContext(StreamContext);

  return (
    <>
      <h1 className="stream-title">Kaggle Game Arena</h1>
      <h2 className="sub-title" contentEditable={true} role="input">{episode?.metadata?.stage}</h2>
    </>
  );
});
