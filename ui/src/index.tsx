import 'preact/debug';
import { render } from 'preact';
import { LocationProvider, Router, Route } from 'preact-iso';
import { Home } from './pages/Home/index';
import { NotFound } from './pages/_404.jsx';
import { StreamContextProvider } from './context/StreamContext';
import './style.scss';
import { Timings } from './pages/Timings';

export function App() {
  return (
    <LocationProvider>
      <main>
        <StreamContextProvider>
          <Router>
            <Route path="/" component={Home} />
            <Route path="/timings" component={Timings} />
            <Route default component={NotFound} />
          </Router>
        </StreamContextProvider>
      </main>
    </LocationProvider>
  );
}

render(<App />, document.getElementById('app'));
