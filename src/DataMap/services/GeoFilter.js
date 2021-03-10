
import PolygonLookup from 'polygon-lookup';

// 1/60 degree is about a mile
const milesToDeg = ( 1.0 / 60.0 );

/**
 * Filters an entity array by an array geojson shapes (filters polygons and multipolygons)
 * @param {*} entityArray Entity array
 * @param {*} filterFeatures GeoJson features
 * @returns Filtered entity array
 */
export const geoFilter = (entityArray, filterFeatures) => {
    return geoFilterByPolygons(entityArray, filterFeatures);
}

/**
 * Filters an entity array by an array geojson shapes (filters polygons and multipolygons)
 * @param {*} entityArray Entity array
 * @param {*} filterFeatures GeoJson features
 * @returns Filtered entity array
 */
export const geoFilterByPolygons = (entityArray, filterFeatures) => {
    if(!filterFeatures) return entityArray;

    var lookup = new PolygonLookup(filterFeatures);
    return entityArray.filter( (entity) => { 
        return lookup.search(entity.geo[0], entity.geo[1]);
    });
}

/**
 * Filters an entity array by a circle with center location [lat, lon] and a radius (in miles)
 * @param {*} entityArray Entity Array
 * @param {[number, number]} center Center location [lat, lon]
 * @param {number} radius Radius in miles 
 * @returns Filtered entity array
 */
export const geoFilterByCircle = (entityArray, center, radius) => {
    const c = center;
    const r2 = (radius * milesToDeg) * (radius * milesToDeg);

    return entityArray.filter((e)=> {
        const x = (e.geo[0] - c[0]);
        const y = (e.geo[1] - c[1]);
        const dist = x*x + y*y;
        return dist <= r2;
    })
}

/**
 * Filters an entity array by an bounding box
 * @param {*} entityArray 
 * @param {{ minX, minY, maxX, maxY }} bbox 
 * @returns Filtered entity array
 */
export const geoFilterByBoundingBox = (entityArray, bbox) => {
    const { minX, minY, maxX, maxY } = bbox;
    return entityArray.filter((e)=> {
        return minX <= e.geo[0] && e.geo[0] <= maxX && maxY <= e.geo[1] && e.geo[1] <= maxY;
    })
}
