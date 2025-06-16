import { GameViewer } from '../../components/GameViewer/GameViewer';
import { Goals } from '../../components/Goals/Goals';
import { Moves } from '../../components/Moves/Moves';
import { Players } from '../../components/Players/Players';
import { StreamTitle } from '../../components/StreamTitle/StreamTitle';
import { Thoughts } from '../../components/Thoughts/Thoughts';
import './style.css';

export function Home() {
	return (
		<div class="home">
			<div class="title">
				<StreamTitle />
				<Players />
			</div>
			<div class="viewer">
				<GameViewer />
			</div>
			<div class="right-panel">

				<Moves />
				<Goals />
				<Thoughts />
			</div>
		</div>
	);
}
