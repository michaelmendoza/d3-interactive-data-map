import 'normalize.css';
import './App.css';
import DataMap from './DataMap/components/DataMap';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        Interactive Map Playground 
      </header>
      <section>
        <DataMap width={500} height={500}></DataMap>
      </section>
    </div>
  );
}

export default App;
