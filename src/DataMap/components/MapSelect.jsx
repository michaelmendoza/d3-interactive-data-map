import React, { useState } from 'react';

export const MapOptions = {
    Africa: "Africa",
    Asia: "Asia",
    Antarctica: "Antarctica",
    Europe: "Europe",
    NorthAmerica: "North America",
    Oceania: "Oceania",
    SouthAmerica: "South America",
    World: "World",
    USACounties: "USA Counties",
    USAStates: "USA States"
}

const MapSelect = (props) => {

    const [continent, setContinent] = useState(props.continent);

    const handleChange = (event) => { 
        setContinent(event.target.value);
        if(props.setContinent)
            props.setContinent(event.target.value);
    }

    return (
        <div className='Continent-select'>
            <select onChange={handleChange} value={continent}>
                { Object.keys(MapOptions).map((c, i)=> {
                    return <option key={MapOptions[c]} value={ MapOptions[c] }> {MapOptions[c]} </option>
                })}
            </select>
        </div>
    )
}

export default MapSelect;