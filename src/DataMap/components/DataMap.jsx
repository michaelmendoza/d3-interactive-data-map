import * as d3 from 'd3';
import React, { useEffect, useRef, useState } from 'react';
import { fetch } from '../services/GeoJson';
import { createEntityData, createGeoData, pointInPolygonSearchCount, entityInPolygonSearch,reduceEntityDictToMetric, reduceEntityDictToMetricInPlace,  DataMetrics } from '../services/Data';
import MetricSelect from './MetricSelect';
import Loader from './Loading/Loader';

const DataMap = (props) => {

    const [metric, setMetric] = useState(DataMetrics.Count);
    const [mapData, setMapData] = useState(null);
    const [svgReady, setSvgReady] = useState(false);

    useEffect(()=> {
        updateMap();
    }, [metric])
    
    const updateMap = () => {
        setSvgReady(false);

        const fetch = async () => {
            const result = await fetchMapData(metric);
            setMapData(result);
            //drawMap(mapData);
            setSvgReady(true);
        }
        fetch();
    }

    const reduceEntityDataToMapData = (metric) => {
        let geoData = fetch();
        //let pointData = createGeoData(1000);
        let pointData = createEntityData(1000000);
        let start = Date.now();
        
        //let pointsInPolygons = pointInPolygonSearchCount(data, points);
        let pointsInPolygons = entityInPolygonSearch(geoData, pointData);
        //pointsInPolygons = reduceEntityDictToMetric(pointsInPolygons, 'a', DataMetrics.Sum);
        pointsInPolygons = reduceEntityDictToMetricInPlace(pointsInPolygons, 'a', metric); 
        
        let delta = Date.now() - start
        console.log(pointsInPolygons);
        console.log(delta / 1000);

        return {geoData, pointData, pointsInPolygons};
    }

    const fetchMapData = async (metric) => { 
        return new Promise((resolve, reject) => {
            resolve(reduceEntityDataToMapData(metric));
        });
    };

    return (
        <div> 
            <MetricSelect metric={metric} setMetric={setMetric}></MetricSelect> 
            { 
                svgReady ? <MapSVG data={mapData} width={props.width} height={props.height}></MapSVG> : <Loader></Loader>
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
            .scale([250]);

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