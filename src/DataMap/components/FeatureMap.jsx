import * as d3 from 'd3';
import React, { useEffect, useRef, useState } from 'react';
import { fetch } from '../services/GeoJson';
import Loader from './Loading/Loader';
import '../styles/DataMap.scss';
import { MapConstants } from './MapConstants';
import { MapOptions } from './MapSelect';

const FeatureMap = (props) => {

    const [mapData, setMapData] = useState(null);
    const [svgReady, setSvgReady] = useState(false);

    useEffect(()=> {
        updateMap();
    }, [props])
    
    const updateMap = () => {
        setSvgReady(false);

        const fetch = async () => {
            const result = await fetchMapData();
            setMapData(result);
            setSvgReady(true);
        }
        fetch();
    }
    
    const fetchMapData = async () => { 
        return new Promise((resolve, reject) => {
            resolve({geoData:fetch(props.map)});
        });
    };

    const { features, map, width, height} = props;

    return (
        
        <div className='point-map'> 
            { 
                svgReady ? <MapGraphic data={mapData} features={features} map={map} width={width} height={height}></MapGraphic> : <Loader></Loader>
            }
        </div>
    )
}

const MapGraphic = (props) => {
    const d3Container = useRef(null);
    const mapContainer = useRef(null);
    const fillColor = "#4682b4"; //'#69b3a2'; 
    const featureColor = "#f2564b";

    useEffect(()=> {
        drawMap();
    })

    const drawMap = () => {
        const {geoData} = props.data;

        var svg = d3.select(d3Container.current);

        // Define the div for the tooltip
        var tooltip = d3.select("body")
            .append("div")	
            .attr("class", "tooltip")				
            .style("opacity", 0)
            .text("");

        //Define map projection
        var projection = d3.geoMercator()
            .translate([props.width/2, props.height/2])
            .center(MapConstants[props.map].center)
            .rotate(MapConstants[props.map].rotate)
            .scale(MapConstants[props.map].scale);

        if(props.map === MapOptions.USAStates || props.map === MapOptions.USACounties) {
            projection = d3.geoAlbers()
                .scale(700)
                .center([24, 38.7]);    
        }

        //Define path generator
        var path = d3.geoPath()
            .projection(projection);
        
        console.log(geoData.features);

        let mapG = svg.append("g")
        mapG.selectAll("path")
            .data(geoData.features)
            .enter()
            .append("path")
            .attr("d", path)
            .style("stroke-dasharray", ("3, 3"))
            .style("fill", (d)=> { return fillColor }) 
            .style("stroke", "white")

        console.log(props.features)

        let mapF = svg.append("g")
        mapF.selectAll("path")
            .data(props.features)
            .enter()
            .append("path")
            .attr("d", path)
            .style("stroke-dasharray", ("3, 3"))
            .style("fill", (d)=> { return featureColor }) 
            .style("stroke", "white")
            .on("mouseover",function(e, d) {
                d3.select(this)
                .style("fill", "gray")
                
                tooltip
                .style("left", (e.pageX) + "px")		
                .style("top", (e.pageY - 28) + "px")
                .transition()		
                .duration(200)		
                .style("opacity", .9)		

                tooltip.text(d.properties.name);	
            }) 
            .on("mouseout",function(d){
                d3.select(this)
                .style("fill", (d)=> { return featureColor })

                tooltip.transition()		
                .duration(500)		
                .style("opacity", 0); 
            })
    }

    return (
        <div ref={mapContainer}>
            <svg ref={d3Container} width={props.width} height={props.height}></svg>
        </div>
    )
}

export default FeatureMap;