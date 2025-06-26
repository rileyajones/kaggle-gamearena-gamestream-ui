import 'preact/debug';
import { render } from 'preact';
import { LocationProvider, Router, Route } from 'preact-iso';
import { Home } from './pages/Home/index.jsx';
import { NotFound } from './pages/_404.jsx';
import { StreamContextProvider } from './context/StreamContext';
import './style.scss';

export function App() {
	return (
		<LocationProvider>
			<main>
				<StreamContextProvider>
					<Router>
						<Route path="/" component={Home} />
						<Route default component={NotFound} />
					</Router>
				</StreamContextProvider>
			</main>
		</LocationProvider>
	);
}

render(<App />, document.getElementById('app'));
