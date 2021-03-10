import * as Stats from './Stats';
import * as StatsInPlace from './StatsInPlace';
import { MapConstants } from '../components/MapConstants';
import { random, randomCircle } from './Random';
import { range } from './Utils';
import { fetch } from './GeoJson';
import { geoFilter } from './GeoFilter';
import { entityInPolygonSearch } from './GeoSearch';

/**
 * Creates Mock Entity Data of form { id, name, geo, attr, time }
 * @param {number} N Number of Entities to Generate 
 * @param {*} geoName GeoMap name
 * @returns 
 */
export const createEntityData = (N, geoName = 'Africa') => {
    const geoCenter = MapConstants[geoName].center; 
    const radius = MapConstants[geoName].radius; 

    // Date Ranges for Uniformly Distrubuted Dates between startTime and endTime 
    const daysInTimeWindow = 30;
    const milliSecondsInDay = 1000 * 60 * 60 * 24;
    const endTime = (new Date()).getTime();
    const startTime =  endTime - daysInTimeWindow * milliSecondsInDay;

    // Create Entity DataPoints 
    const ids = range(0, N);
    const data = ids.map((id) => {
        const name = 'Lightning';
        const geo = randomCircle(geoCenter, radius);
        const attr = { a:random(0, 123), b:random(0, 50), c:random(0, 1000), d:random(0, 250)}
        const time = new Date(random(startTime, endTime))
        return { id:id, name:name, geo:geo, attr:attr, time:time }
    })

    return data;
}

export const entityDataToDataArray = (data, attribute) => {
    const dataArray = [];
    data.forEach((item)=> {  
        dataArray.push(item.attr[attribute]);
    })
    return dataArray;
}

export const reduceEntityDictToMetric = (dict, attribute, metric) => {
    const keys = Object.keys(dict);
    let result = {}
    keys.forEach((key)=> {
        result[key] = Stats.statsFactory(entityDataToDataArray(dict[key], attribute), metric);
    })
    return result;
}

// Note: 1.457s to 1.212s (16.8% decrease) by calculating in place for N = 1000000
export const reduceEntityDictToMetricInPlace = (dict, attribute, metric) => {
    const keys = Object.keys(dict);
    let result = {}
    keys.forEach((key)=> {
        result[key] = StatsInPlace.statsFactory(dict[key], attribute, metric);
    })
    return result;
}

/**
 * Creates DataMap data from entityData or new generated entityData with entityCount
 * @param {*} entityCount Entity count
 * @param {*} entityData Input entity data
 * @param {*} map 
 * @param {*} filter GeoJson with filter polygons
 * @param {*} metric DataMetric for data reduction 
 * @returns 
 */
export const createDataMapData = (entityCount, entityData, map, filter, metric) => {
    let geoData = fetch(map);
    let pointData = entityData ? entityData : createEntityData(entityCount, map);
    pointData = geoFilter(pointData, filter);

    let start = Date.now();
    let pointsInPolygons = entityInPolygonSearch(geoData, pointData);
    pointsInPolygons = reduceEntityDictToMetricInPlace(pointsInPolygons, 'a', metric); 
    let delta = Date.now() - start
    console.log(delta / 1000);

    return { geoData, pointData, pointsInPolygons };
}

/**
 * Creates DataMap data from entityData or new generated entityData with entityCount
 * @param {*} entityCount Entity count
 * @param {*} entityData Input entity data
 * @param {*} map 
 * @param {*} filter GeoJson with filter polygons
 * @param {*} max Max number of data points to render
 * @returns 
 */
export const createPointMapData = (entityCount, entityData, map, filter, max) => {
        let geoData = fetch(map);
        let pointData = entityData ? entityData : createEntityData(entityCount, map);
        pointData = geoFilter(pointData, filter);
        pointData = max ? pointData.filter((point, index)=> index < max ) : pointData;
        return {geoData, pointData};
}