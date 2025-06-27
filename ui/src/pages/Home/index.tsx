import { useContext } from 'preact/hooks';
import { Controls } from '../../components/Controls/Controls';
import { EventsPanel } from '../../components/EventsPanel/EventsPanel';
import { GameViewer } from '../../components/GameViewer/GameViewer';
import { StreamTitle } from '../../components/StreamTitle/StreamTitle';
import { StreamContext } from '../../context/StreamContext';
import { Players } from '../../components/Players/Players';
import './style.scss';

export function Home() {
  const { showControls } = useContext(StreamContext);

  return (
    <div className="home">
      <div className="left-panel">
        <Players />
        <EventsPanel />
      </div>
      <div className="title">
        <StreamTitle />
      </div>
      <div className="viewer">
        <GameViewer />
        {showControls && <Controls />}
      </div>
    </div>
  );
}
