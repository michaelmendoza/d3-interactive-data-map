
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
    var mean = this.mean(x);
    var variance = x.reduce(function(a, b) { return a + ((b - mean) * (b - mean)) });
    variance = variance / x.length;
    return variance;
}

export const std = (x) => {
    return Math.sqrt(this.variance(x));
}

export const covariance = (x, y) => {
    if(x.length === 0) return 0;
    var covariance = 0;
    var mean_x = this.mean(x);
    var mean_y = this.mean(y);
    for(var i = 0; i < x.length; i++) {
        covariance += (x[i] - mean_x) * (x[i] - mean_y);
    }
    covariance = covariance / x.length;
    return covariance;
}
