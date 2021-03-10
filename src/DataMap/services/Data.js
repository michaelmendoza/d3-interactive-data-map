import { fetch } from './GeoJson';
import { geoFilter } from './GeoFilter';
import { entityInPolygonSearch } from './GeoSearch';
import { reduceEntityDictToMetricInPlace } from './DataAggregator';
import { createEntityData } from './MockEntityData';

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