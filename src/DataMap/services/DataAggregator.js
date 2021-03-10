import * as Stats from './Stats';
import * as StatsInPlace from './StatsInPlace';

/**
 * Transforms an entity data array into an attribute data array
 * @param {*} data Entity data array
 * @param {*} attribute attribute
 * @returns 
 */
 export const entityDataToDataArray = (data, attribute) => {
    const dataArray = [];
    data.forEach((item)=> {  
        dataArray.push(item.attr[attribute]);
    })
    return dataArray;
}

/**
 * Reduces a dictionary with entity arrays to a data metric 
 * @param {*} dict 
 * @param {string} attribute 
 * @param {*} metric 
 * @returns 
 */
export const reduceEntityDictToMetric = (dict, attribute, metric) => {
    const keys = Object.keys(dict);
    let result = {}
    keys.forEach((key)=> {
        result[key] = Stats.statsFactory(entityDataToDataArray(dict[key], attribute), metric);
    })
    return result;
}

// 
/**
 * Reduces a dictionary with entity arrays to a data metric. Caluculations are done in place using Entity 
 * object structure for attributes. Note: 1.457s to 1.212s (16.8% decrease) by calculating in place for N = 1000000
 * @param {*} dict 
 * @param {string} attribute 
 * @param {*} metric 
 * @returns 
 */
export const reduceEntityDictToMetricInPlace = (dict, attribute, metric) => {
    const keys = Object.keys(dict);
    let result = {}
    keys.forEach((key)=> {
        result[key] = StatsInPlace.statsFactory(dict[key], attribute, metric);
    })
    return result;
}