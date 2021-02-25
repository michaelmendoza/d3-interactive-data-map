import './App.css';
import Map from './DataMap/Map';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        Interactive Map Playground 
      </header>
      <section>
        <Map width={500} height={500}></Map>
      </section>
    </div>
  );
}

export default App;
