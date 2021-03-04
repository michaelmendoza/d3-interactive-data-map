import 'normalize.css';
import './App.scss';
import DataMap from './DataMap/components/DataMap';
import PointMap from './DataMap/components/PointMap';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        Interactive Map Playground 
      </header>
      <section className="layout-row-center">
        <PointMap max={2000} width={500} height={500}></PointMap>
        <DataMap width={500} height={500}></DataMap> 
      </section>
    </div>
  );
}

export default App;
