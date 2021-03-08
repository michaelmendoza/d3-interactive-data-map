import 'normalize.css';
import { useState, useReducer } from 'react';
import './App.scss';
import MapSelect, { MapOptions } from './DataMap/components/MapSelect';
import DataMap from './DataMap/components/DataMap';
import PointMap from './DataMap/components/PointMap';
import StateSelect from './DataMap/components/StateSelect';
import { MapTypes } from './DataMap/components/MapConstants';



const reducer = (state, action) => {
  switch (action.type) {
    case 'updateContinent':
      return { ...state, continent: action.continent };
    case 'updateMapType':
      return { ...state, mapType: action.mapType }
    default:
      throw new Error();
  }
}

function App() {

  const initialState = { continent:MapOptions.Africa, mapType: MapTypes.DataMap };
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div className="App">
      <header className="App-header">
        Interactive Map Playground 
      </header>
      <section>
        <div>
          <button onClick={() => { dispatch({type:"updateMapType", mapType:MapTypes.DataMap})} }> Data Map </button>
          <button onClick={() => { dispatch({type:"updateMapType", mapType:MapTypes.PointMap})} }> Point Map </button>
        </div>

        <div> 
          <MapSelect continent={state.continent} setContinent={(d)=>{ dispatch({type:"updateContinent", continent:d})}}></MapSelect>
        </div>
        <div className="layout-row-center">
          {
            state.mapType == MapTypes.DataMap ? <DataMap map={state.continent} width={500} height={500}></DataMap> : null

          }
          {
            state.mapType == MapTypes.PointMap ? <PointMap map={state.continent} max={1000} width={500} height={500}></PointMap> : null
          }
        </div>

      </section>
    </div>
  );
}

export default App;
