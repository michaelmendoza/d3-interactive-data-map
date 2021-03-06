import React, { useState } from 'react';

export const Continents = {
    Africa: "Africa",
    Asia: "Asia",
    Antarctica: "Antarctica",
    Europe: "Europe",
    NorthAmerica: "North America",
    Oceania: "Oceania",
    SouthAmerica: "South America",
    World: "World"
}

const ContinentSelect = (props) => {

    const [continent, setContinent] = useState(props.continent);

    const handleChange = (event) => { 
        setContinent(event.target.value);
        if(props.setContinent)
            props.setContinent(event.target.value);
    }

    return (
        <div className='Continent-select'>
            <select onChange={handleChange} value={continent}>
                { Object.keys(Continents).map((c, i)=> {
                    return <option value={ Continents[c] }> {Continents[c]} </option>
                })}
            </select>
        </div>
    )
}

export default ContinentSelect;