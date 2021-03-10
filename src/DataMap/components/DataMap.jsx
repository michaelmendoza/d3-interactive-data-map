import * as d3 from 'd3';
import React, { useEffect, useRef, useState } from 'react';
import { createDataMapData } from '../services/Data';
import MetricSelect from './MetricSelect';
import Loader from './Loading/Loader';
import { MapConstants } from './MapConstants';
import { MapOptions } from './MapSelect';
import { DataMetrics } from '../services/Stats';
import '../styles/DataMap.scss';

const DataMap = (props) => {

    const [metric, setMetric] = useState(DataMetrics.Count);
    const [mapData, setMapData] = useState(null);
    const [svgReady, setSvgReady] = useState(false);

    useEffect(()=> {
        updateMap();
    }, [metric, props])
    
    const updateMap = () => {
        setSvgReady(false);

        const fetch = async () => {
            const result = await fetchMapData(metric);
            setMapData(result);
            setSvgReady(true);
        }
        fetch();
    }

    const fetchMapData = async (metric) => { 
        return new Promise((resolve, reject) => {
            resolve(createDataMapData(100000, props.entityData, props.map, props.filter, metric))
        });
    };

    const { map, width, height} = props;

    return (
        <div className='data-map'> 
            <MetricSelect metric={metric} setMetric={setMetric}></MetricSelect> 
            { 
                svgReady ? <MapSVG data={mapData} map={map} width={width} height={height}></MapSVG> : <Loader></Loader>
            }
        </div>
    )
}

const MapSVG = (props) => {
    const d3Container = useRef(null);
    const fillColor = "#4682b4"; //'#69b3a2'; 
    const fillColor2 =  '#69b3a2'; //'#DB6F68'; //"#4682b4"; // #DB6F68
    const strokeColor = '#222222'; 
    const pointRadius = 3;

    useEffect(()=> {
        drawMap();
    })

    const drawMap = () => {
        const {geoData, pointData, pointsInPolygons} = props.data;

        var svg = d3.select(d3Container.current);
        var max = 0;
        var keys = Object.keys(pointsInPolygons);
        keys.forEach(function(key){
            max = max > pointsInPolygons[key] ? max : pointsInPolygons[key];
        });
        var color = d3.scaleLinear().domain([0,max])
            .range([fillColor, fillColor2]);

        // Define the div for the tooltip
        var tooltip = d3.select("body")
            .append("div")	
            .attr("class", "tooltip")				
            .style("opacity", 0)
            .text("a simple tooltip");

        //Define map projection
        var projection = d3.geoMercator()
            .translate([props.width/2, props.height/2])
            .center(MapConstants[props.map].center)
            .rotate(MapConstants[props.map].rotate)
            .scale(MapConstants[props.map].scale);

        if(props.map == MapOptions.USAStates || props.map == MapOptions.USACounties) {
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
            .style("fill", (d)=> { return color(pointsInPolygons[d.properties.name]); }) //"steelblue")
            .style("stroke", "white")
            .style("stroke-width", 0.1)
            .style("opacity", 0.8)
            .on("mouseover",function(e, d) {
                d3.select(this)
                .style("fill", "gray")
                
                tooltip
                .style("left", (e.pageX) + "px")		
                .style("top", (e.pageY - 28) + "px")
                .transition()		
                .duration(200)		
                .style("opacity", .9)		

                tooltip.text(d.properties.name + ' ' + pointsInPolygons[d.properties.name]);	
            }) 
            .on("mouseout",function(d){
                d3.select(this)
                .style("fill", (d)=> { return color(pointsInPolygons[d.properties.name]); })

                tooltip.transition()		
                .duration(500)		
                .style("opacity", 0); 
            })
        
            /*
            let g = svg.append("g")
            const delay = 1000 / pointData.length;
            g.selectAll("circle")
                .data(pointData)
                .enter().append("circle")
                .attr('r',0)
                .attr('cx',function(d) { return projection(d.geo)[0]})
                .attr('cy',function(d) { return projection(d.geo)[1]})
                .attr('opacity', 0.2)
                .style("fill", fillColor)
                .style("stroke", strokeColor)
                .on("mouseover",function(d) {
                    d3.select(this)
                        .style("fill", "gray")
                })
                .on("mouseout",function(d){
                    d3.select(this)
                        .style("fill", fillColor)
                })
                .transition()        
                .duration(800)
                .attr("r", pointRadius)
                .delay(function(d,i){ return(i * delay)})
            */
    }

    return (
        <svg ref={d3Container} width={props.width} height={props.height}></svg>
    )
}

export default DataMap;