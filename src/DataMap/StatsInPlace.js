
const fn = (x, attr) => {
    return x.attr[attr];
}

export const sum = (x, attr) => {
    if(x.length === 0) return 0;
    return x.reduce(function(a, b) { return a + fn(b, attr); }, 0);
}

export const mean = (x, attr) => {
    if(x.length === 0) return 0;
    var sum = x.reduce(function(a, b) { return a + fn(b, attr); }, 0);
    var avg = sum / x.length;
    return avg;
}

export const median = (x, attr) => {
    if(x.length === 0) return 0;
    var sortedArray = [...x];
    sortedArray.sort((a, b)=> {
        return a.attr[attr] - fn(b, attr);
    });
    const mid = Math.ceil(x.length / 2);
    const median = (x.length / 2) % 2 === 0 ? (fn(sortedArray[mid], attr) + fn(sortedArray[mid - 1], attr)) / 2 : fn(sortedArray[mid - 1], attr);
    return median;
}

export const variance = (x, attr) => {
    if(x.length === 0) return 0;
    var _mean = mean(x, attr);
    var variance = x.reduce(function(a, b) { return a + ((fn(b, attr) - _mean) * (fn(b, attr) - _mean)) }, 0);
    variance = variance / x.length;
    return variance;
}

export const std = (x, attr) => {
    return Math.sqrt(variance(x, attr));
}
