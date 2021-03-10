
import PolygonLookup from 'polygon-lookup';

/**
 * Filters an entity array by an array geojson shapes
 * @param {*} entityArray Entity array
 * @param {*} filterFeatures GeoJson features
 * @returns Filtered entity array
 */
export const geoFilter = (entityArray, filterFeatures) => {
    if(!filterFeatures) return entityArray;

    var lookup = new PolygonLookup(filterFeatures);
    return entityArray.filter( (entity) => { 
        return lookup.search(entity.geo[0], entity.geo[1]);
    });
}
