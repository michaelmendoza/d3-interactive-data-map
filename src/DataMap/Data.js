import PolygonLookup from 'polygon-lookup';
import * as Stats from './Stats';

export const DataMetrics = {
    Count : "Count",
    Sum : 'Sum', 
    Mean : 'Mean', 
    StdDev : 'StdDev', 
    Median : 'Median'
}

export const random = (min, max) => {
    return Math.random() * (max - min) + min;
};

export const randomInt = function(min, max) {		
    return Math.round(Math.random() * (max - min) + min);
}

export const randomCircle = (center, radius) => {
    let rRadius = random(0, radius);
    let rAngle = random(-Math.PI, Math.PI)    
    let x = rRadius * Math.cos(rAngle) + center[0];
    let y = rRadius * Math.sin(rAngle) + center[1];
    return [x, y]
}

export const range = (start, end) => {
    const length = end - start;
    return Array.from({ length }, (_, i) => start + i);
}

export const createGeoData = (N) => {
    const geoCenter = [15, 5];
    return Array.from({ length:N }, (_, i) => randomCircle(geoCenter, 40));
}

export const createEntityData = (N) => {
    const geoCenter = [15, 5];

    // Date Ranges for Uniformly Distrubuted Dates between startTime and endTime 
    const daysInTimeWindow = 30;
    const milliSecondsInDay = 1000 * 60 * 60 * 24;
    const endTime = (new Date()).getTime();
    const startTime =  endTime - daysInTimeWindow * milliSecondsInDay;

    // Create Entity DataPoints 
    const ids = range(0, N);
    const data = ids.map((id) => {
        const name = 'Lightning';
        const geo = randomCircle(geoCenter, 40);
        const attr = { a:random(0, 123), b:random(0, 50), c:random(0, 1000), d:random(0, 250)}
        const time = new Date(random(startTime, endTime))
        return { id:id, name:name, geo:geo, attr:attr, time:time }
    })

    return data;
}

export const pointInPolygonSearchCount = (features, points) => {
    let keys = features.features.map((item)=> {
        return item.properties.name;
    })
    let dict = {}
    keys.forEach((key)=> {
        dict[key] = 0;
    })

    var lookup = new PolygonLookup(features);
    points.forEach((point)=> {
        var search = lookup.search(point[0], point[1]);
        if(search)
            dict[search.properties.name] += 1;
    })

    return dict;
}

export const entityInPolygonSearchCount = (features, points) => {
    let keys = features.features.map((item)=> {
        return item.properties.name;
    })
    let dict = {}
    keys.forEach((key)=> {
        dict[key] = 0;
    })

    var lookup = new PolygonLookup(features);
    points.forEach((point)=> {
        var search = lookup.search(point.geo[0], point.geo[1]);
        if(search)
            dict[search.properties.name] += 1;
    })

    return dict;
}

export const entityInPolygonSearch = (features, points) => {

    // Create dictionary with country name as key, value is array of entities
    let keys = features.features.map((item)=> {
        return item.properties.name;
    })
    let dict = {}
    keys.forEach((key)=> {
        dict[key] = [];
    })

    // Do polygon look to find all polygons which contain a point feature 
    var lookup = new PolygonLookup(features);
    points.forEach((point)=> {
        var search = lookup.search(point.geo[0], point.geo[1]);
        if(search)
            dict[search.properties.name].push(point);
    })

    return dict;
}

export const calculateStat = (data, metric) => {
    switch(metric) {
        case DataMetrics.Count:
            return data.length;
        case DataMetrics.Sum:
            return Stats.sum(data);
        case DataMetrics.Mean:
            return Stats.mean(data);
        case DataMetrics.Median:
            return Stats.median(data);
        case DataMetrics.StdDev:
            return Stats.std(data);
        default:
            return 0;
    }
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
        result[key] = calculateStat( entityDataToDataArray(dict[key], attribute), metric);
    })
    return result;
}

export const entityInPolygonSearcyByMetric  = (features, points, metric) => {

}