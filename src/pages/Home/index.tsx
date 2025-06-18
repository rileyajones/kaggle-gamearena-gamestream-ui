import { GameViewer } from '../../components/GameViewer/GameViewer';
import { Goals } from '../../components/Goals/Goals';
import { Moves } from '../../components/Moves/Moves';
import { Players } from '../../components/Players/Players';
import { StreamTitle } from '../../components/StreamTitle/StreamTitle';
import { Thoughts } from '../../components/Thoughts/Thoughts';
import './style.css';

export function Home() {
	return (
		<div className="home">
			<div className="title">
				<StreamTitle />
				<Players />
			</div>
			<div className="viewer">
				<GameViewer />
			</div>
			<div className="right-panel">
				<Moves />
				<Goals />
				<Thoughts />
			</div>
		</div>
	);
}
