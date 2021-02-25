import PolygonLookup from 'polygon-lookup';

export const random = (min, max) => {
    return Math.random() * (max - min) + min;
};

export const randomCircle = (center, radius) => {
    let rRadius = random(0, radius);
    let rAngle = random(-Math.PI, Math.PI)    
    let x = rRadius * Math.cos(rAngle) + center[0];
    let y = rRadius * Math.sin(rAngle) + center[1];
    return [x, y]
}

export const mockData = (N) => {
    let geoCenter = [15, 5];
    let geoLocs = Array.from({ length:N }, (_, i) => randomCircle(geoCenter, 40))
    return geoLocs;
}

export const polygonSearch = (features, points) => {
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