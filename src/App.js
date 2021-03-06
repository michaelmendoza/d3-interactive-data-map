import 'normalize.css';
import { useState, useReducer } from 'react';
import './App.scss';
import ContinentSelect, { Continents } from './DataMap/components/ContinentSelect';
import DataMap from './DataMap/components/DataMap';
import PointMap from './DataMap/components/PointMap';


const reducer = (state, action) => {
  switch (action.type) {
    case 'updateContinent':
      return { ...state, continent: action.continent };
    default:
      throw new Error();
  }
}

function App() {

  const initialState = {continent:Continents.Africa};
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div className="App">
      <header className="App-header">
        Interactive Map Playground 
      </header>
      <section>
        <div> 
          <ContinentSelect continent={state.continent} setContinent={(d)=>{ dispatch({type:"updateContinent", continent:d})}}></ContinentSelect>
        </div>
        <div className="layout-row-center">
          <PointMap continent={state.continent} max={2000} width={500} height={500}></PointMap>
          <DataMap continent={state.continent} width={500} height={500}></DataMap> 
        </div>

      </section>
    </div>
  );
}

export default App;
