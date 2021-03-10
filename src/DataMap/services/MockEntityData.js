import { MapConstants } from '../components/MapConstants';
import { random, randomCircle } from './Random';
import { range } from './Utils';

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