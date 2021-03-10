import React, { useContext, useState } from 'react';
import { DataMetrics } from '../services/Stats';

const MetricSelect = (props) => {

    const [metric, setMetric] = useState(props.metric);

    const handleChange = (event) => {
        setMetric(event.target.value);
        props.setMetric(event.target.value);
    }

    return (
        <div className='metric-select'>
            <select onChange={handleChange} value={metric}>
                <option value={DataMetrics.Count}>Count</option>
                <option value={DataMetrics.Sum}>Sum</option>
                <option value={DataMetrics.Mean}>Mean</option>
                <option value={DataMetrics.Median}>Median</option>
                <option value={DataMetrics.StdDev}>Std Dev</option>
            </select>
        </div>
    )
}

export default MetricSelect;