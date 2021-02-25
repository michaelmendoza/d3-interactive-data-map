
export const sum = (x) => {
    if(x.length === 0) return 0;
    return x.reduce(function(a, b) { return a + b; });
}

export const mean = (x) => {
    if(x.length === 0) return 0;
    var sum = x.reduce(function(a, b) { return a + b; });
    var avg = sum / x.length;
    return avg;
}
    
export const median = (x) => {
    if(x.length === 0) return 0;
    var sortedArray = [...x];
    sortedArray.sort();
    const mid = Math.ceil(x.length / 2);
    const median = (x.length / 2) % 2 === 0 ? (sortedArray[mid] + sortedArray[mid - 1]) / 2 : sortedArray[mid - 1];
    return median;
}

export const variance = (x) => {
    if(x.length === 0) return 0;
    var _mean = mean(x);
    var variance = x.reduce(function(a, b) { return a + ((b - _mean) * (b - _mean)) });
    variance = variance / x.length;
    return variance;
}

export const std = (x) => {
    return Math.sqrt(variance(x));
}
