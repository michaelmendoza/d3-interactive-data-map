
import countriesByContinent from './json/country-by-continent.json';
import countriesGeoJson from './json/world.json';

export function fetch() {    
    let filteredGeoJsons = filterCountryByContinent("Africa", countriesByContinent, countriesGeoJson);
    return filteredGeoJsons;
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
        return GetContinentFromCountry(item.properties.name) == continent;
    })

    // Returns a filtered geoJson 
    return { 
        type:"FeatureCollection",
        features:features,
    }
}
