
import countriesByContinent from '../json/country-by-continent.json';
import countriesGeoJson from '../json/world.json';
import usaGeoJson from '../json/world/counties-10m.json'; //https://github.com/topojson/us-atlas#us/10m.json
import * as topojson from 'topojson';

const cache = {};

export function fetch(continent = "Africa") {    
    if(continent === "USA Counties")
        return getUSACountyGeoJson();
    if(continent === "USA States")
        return getUSAStatesGeoJson();
    
    let filteredGeoJsons = filterCountryByContinent(continent, countriesByContinent, countriesGeoJson);
    return filteredGeoJsons;
}

const getUSACountyGeoJson = () => {
    const topology = usaGeoJson;
    return topojson.feature(topology, topology.objects.counties);
}

const getUSAStatesGeoJson = () => {
    const topology = usaGeoJson;
    return topojson.feature(topology, topology.objects.states);
}

const filterCountryByContinent = (continent, countriesByContinent, countriesGeoJson) => {

    // Get continent from country
    var GetContinentFromCountry = (country) => {
        let results = countriesByContinent.find(item => { 
            return item.country === country; 
        })
        
        // Validate find results
        if(results === undefined) {
            console.log(country + ' not found');
            return '';
        }
        else {
            return results.continent;
        }
    }
    
    // Filter geoJson by continent
    let features = countriesGeoJson.features.filter((item) => {
        return GetContinentFromCountry(item.properties.name) === continent;
    })
    features = continent === "World" ? countriesGeoJson.features : features;

    // Returns a filtered geoJson 
    return { 
        type:"FeatureCollection",
        features:features,
    }
}
