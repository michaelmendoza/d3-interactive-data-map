
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

export const randomNormal = (mean, std) => {
    // Box-Muller transform (https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve/36481059#36481059)
    var u = 0, v = 0;
    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    var standard = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
    return mean + standard * std; 
}
