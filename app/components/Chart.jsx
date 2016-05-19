import React from 'react';
import { connect } from 'react-redux';
import ReactFauxDOM from 'react-faux-dom';
import 'd3';
import 'd3-helpers';
import 'd3-transform';

const parseTime = d3.time.format.iso.parse;

const mapStateToProps = ({data}) => { return {data}; };

const Chart = ({data}) => {
  data = data.map(function (d) {
    return {
      value: d.value,
      utc: parseTime(d.date.utc)
    };
  });

  const readings = d3.nest()
                     .key(d3h("parameter"))
                     .map(data, d3.map);

  var margin = {
    top: 10,
    right: 80,
    bottom: 100,
    left: 40
  };

  var margin2 = {
    top: 430,
    right: 80,
    bottom: 20,
    left: 40
  };

  var width = 960 - margin.left - margin.right;
  var height = 500 - margin.top - margin.bottom;
  var height2 = 500 - margin2.top - margin2.bottom;

  var x = d3.time.scale().range([0, width]);
  var x2 = d3.time.scale().range([0, width]);
  var y = d3.scale.linear().range([height, 0]);
  var y2 = d3.scale.linear().range([height2, 0]);

  var xAxis = d3.svg.axis().scale(x).orient("bottom");
  var xAxis2 = d3.svg.axis().scale(x2).orient("bottom");
  var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left")
                .innerTickSize(-width)
                .tickPadding(8);

  var color = d3.scale.category10();

  var line = d3.svg.line()
               .interpolate("linear")
               .x(d3h("utc", x))
               .y(d3h("value", y));

  var line2 = d3.svg.line()
                .interpolate("linear")
                .x(d3h("utc", x2))
                .y(d3h("value", y2));

  var svgNode = ReactFauxDOM.createElement('div');

  var svg = d3.select(svgNode).append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom);

  svg.append("defs").append("clipPath")
     .attr("id", "clip")
     .append("rect")
     .attr("width", width)
     .attr("height", height);

  var chart = svg.append("g")
                 .attr("class", "focus")
                 .attr("transform", d3.svg.transform().translate([margin.left, margin.top]));

  var context = svg.append("g")
                   .attr("class", "context")
                   .attr("transform", d3.svg.transform().translate([margin2.left, margin2.top]));

  color.domain(readings.keys());

  x.domain(d3.extent(data, d3h("utc")));
  y.domain([0, d3.max(data, d3h("value"))]);

  x2.domain(x.domain());
  y2.domain(y.domain());

  // Chart

  var reading = chart.selectAll(".reading")
                     .data(readings.entries())
                     .enter().append("g")
                     .attr("class", "reading");

  reading.append("path")
         .attr("class", "line")
         .attr("d", d3h("value", line))
         .style("stroke", d3h("key", color));

  chart.append("g")
       .attr("class", "x axis")
       .attr("transform", d3.svg.transform().translate([0, height]))
       .call(xAxis);

  chart.append("g")
       .attr("class", "y axis")
       .call(yAxis)
       .append("text")
       .attr("transform", "rotate(-90)")
       .attr("y", 6)
       .attr("dy", ".71em")
       .style("text-anchor", "end")
       .text("PPM");

  // Context

  var reading2 = context.selectAll(".reading")
                        .data(readings.entries())
                        .enter().append("g")
                        .attr("class", "reading");

  reading2.append("path")
          .attr("class", "line")
          .attr("d", function(d) {
            return line2(d.value);
          })
          .style("stroke", function(d) {
            return color(d.key);
          });

  context.append("g")
         .attr("class", "x axis")
         .attr("transform", d3.svg.transform().translate([0, height2]))
         .call(xAxis2);

  return svgNode.toReact();
}

export default connect(mapStateToProps)(Chart);
