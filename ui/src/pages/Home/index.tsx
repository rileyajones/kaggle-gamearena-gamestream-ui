import { useContext, useState } from 'preact/hooks';
import { Controls } from '../../components/Controls/Controls';
import { EventsPanel } from '../../components/EventsPanel/EventsPanel';
import { GameViewer } from '../../components/GameViewer/GameViewer';
import { StreamTitle } from '../../components/StreamTitle/StreamTitle';
import { StreamContext } from '../../context/StreamContext';
import { Players } from '../../components/Players/Players';
import './style.scss';
import { classNames } from '../../utils/classnames';
import { IconButton } from '../../components/IconButton/IconButton';

export function Home() {
  const { showControls } = useContext(StreamContext);
  const [leftPanelExpanded, setLeftPanelExpanded] = useState(true);

  return (
    <div className="home">
      <div className="title">
        <StreamTitle />
      </div>
      <div className={classNames('left-panel', leftPanelExpanded && 'expanded')}>
        <Players />
        <EventsPanel />
      </div>
      <div className="viewer">
        <GameViewer />
        {showControls && <Controls />}
        {/* Putting the left panel expander in the right panel allows the
          left panel to be overflow hidden */}
        <IconButton
          className="left-panel-expander"
          onClick={() => setLeftPanelExpanded(!leftPanelExpanded)}>
          {leftPanelExpanded ? 'navigate_before' : 'navigate_next'}
        </IconButton>
      </div>
    </div>
  );
}
