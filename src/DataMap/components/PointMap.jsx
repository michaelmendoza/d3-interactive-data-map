import * as d3 from 'd3';
import React, { useEffect, useRef, useState } from 'react';
import {  createPointMapData } from '../services/Data';
import Loader from './Loading/Loader';
import '../styles/DataMap.scss';
import { MapConstants } from './MapConstants';
import { MapOptions } from './MapSelect';

const PointMap = (props) => {

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
            resolve(createPointMapData(100000, props.entityData, props.map, props.filter, props.max))
        });
    };

    const { map, width, height} = props;

    return (
        
        <div className='point-map'> 
            { 
                svgReady ? <MapGraphic data={mapData} map={map} width={width} height={height}></MapGraphic> : <Loader></Loader>
            }
        </div>
    )
}

const MapGraphic = (props) => {
    const d3Container = useRef(null);
    const mapContainer = useRef(null);
    const fillColor = "#4682b4"; //'#69b3a2'; 
    const fillColor2 =  '#69b3a2'; //'#DB6F68'; //"#4682b4"; // #DB6F68
    const strokeColor = '#222222'; 
    const pointRadius = 3;

    useEffect(()=> {
        drawMap();
    })

    const drawMap = () => {
        const {geoData, pointData} = props.data;

        var svg = d3.select(d3Container.current);
        var divCanvas = d3.select(mapContainer.current);

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
                .style("fill", (d)=> { return fillColor })

                tooltip.transition()		
                .duration(500)		
                .style("opacity", 0); 
            })
        
            const drawPoints  = (canvas, pointData) => {
                const scale = 2;
                const context = canvas.getContext('2d');
                canvas.height = props.height * scale;
                canvas.width = props.width * scale;
                canvas.style.width = props.width + 'px';
                canvas.style.height = props.height + 'px'; 
                context.clearRect(0, 0,props.width, props.height);
                context.globalAlpha = 0.8;
                context.setTransform(scale, 0, 0, scale, 0, 0);
                
                pointData.forEach((d) => {
                    context.beginPath();
                    
                    const x = projection(d.geo)[0];
                    const y = projection(d.geo)[1];
                    context.arc(x, y, pointRadius, 0, 2*Math.PI);
                    context.fillStyle = fillColor2;
                    context.strokeStyle = strokeColor;
                    context.lineWidth   = 1;
                    context.fill();
                    context.stroke()
                })
            }
            var canvas = divCanvas.append('canvas')  
                .style('position', 'absolute')
                .style('left', '0')
                .style('pointer-events', 'none');
    
            drawPoints(canvas.node(), pointData)

            /*
            // Data Points
            let g = svg.append("g")
            g.selectAll("circle")
                .data(pointData)
                .enter().append("circle")
                .attr('r', pointRadius)
                .attr('cx',function(d) { 
                    let v = projection(d.geo)[0];
                    return v;
                })
                .attr('cy',function(d) { return projection(d.geo)[1]})
                .attr('opacity', 0.2)
                .style("fill", fillColor2)
                .style("stroke", strokeColor)
                .on("mouseover",function(e, d) {
                    d3.select(this)
                        .style("fill", "gray")

                    tooltip
                        .style("left", (e.pageX) + "px")		
                        .style("top", (e.pageY - 28) + "px")
                        .transition()		
                        .duration(200)		
                        .style("opacity", .9)		
                    
                    let text = 'Name: ' + d.name + ' Geo:[' + d.geo[0].toFixed(2) + ', ' + d.geo[1].toFixed(2) + ']' +
                        '\n a: ' + d.attr.a.toFixed(2) + ' b: ' + d.attr.b.toFixed(2) + 
                        ' c: ' + d.attr.c.toFixed(2) + ' d: ' + d.attr.d.toFixed(2);
                    tooltip.text(text);
                })
                .on("mouseout",function(d){
                    d3.select(this)
                        .style("fill", fillColor2)

                    tooltip.transition()		
                        .duration(500)		
                        .style("opacity", 0); 
                })
        */
    }

    return (
        <div ref={mapContainer}>
            <svg ref={d3Container} width={props.width} height={props.height}></svg>
        </div>
    )
}

export default PointMap;