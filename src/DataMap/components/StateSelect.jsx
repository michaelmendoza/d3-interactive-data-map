import React, { useState } from 'react';

import usa from '../json/world/usa.json';
export const States = usa.features.map((s)=> { return s.properties.name } );

const StateSelect = (props) => {

    const [state, setState] = useState();

    const handleChange = (event) => { 
        setState(event.target.value);
        if(props.setState)
            props.setState(event.target.value);
    }

    return (
        <div className='state-select'>
            <select onChange={handleChange} value={state}>
                { States.map((state)=> {
                    return <option key={state} value={ state }> { state } </option>
                })}
            </select>
        </div>
    )
}

export default StateSelect;