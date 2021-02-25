
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
    const median = (x.length / 2) % 2 === 0 ? (sortedArray[mid] + sortedArray[mid - 1]) / 2 : sortedArray[mid - 1];
    return median;
}

export const variance = (x, attr) => {
    if(x.length === 0) return 0;
    var mean = this.mean(x, attr);
    var variance = x.reduce(function(a, b) { return a + ((fn(b, attr) - mean) * (fn(b, attr) - mean)) }, 0);
    variance = variance / x.length;
    return variance;
}

export const std = (x, attr) => {
    return Math.sqrt(this.variance(x, attr));
}
