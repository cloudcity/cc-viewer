import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

import 'd3';
import 'd3-helpers';
import 'd3-transform';

const transformData = (data) => {
  return data.map(function (d) {
    return {
      value: d.value,
      utc: parseTime(d.date.utc),
      parameter: d.parameter
    };
  });
}

const parameters = ["pm25", "pm10", "so2", "no2", "o3", "co", "bc"];

const parseTime = d3.time.format.iso.parse;

const mapStateToProps = ({data}) => { return {data: transformData(data)}; };

class Chart extends React.Component {
  render() {
    return (
      <svg
        ref='chart'
        width={960}
        height={500} >
      </svg>
    );
  }

  componentDidMount() {
    this.updateChart(this.props);
  }

  componentWillUpdate(newProps) {
    this.updateChart(newProps);
  }

  updateChart = (myProps) => {
    d3.select(ReactDOM.findDOMNode(this.refs.chart)).call(this.chart(myProps)) ;
  }

  chart = ({data}) => {
    return (svg) => {
      svg.selectAll('*').remove();

      const readings = d3.nest()
                         .key(d3h("parameter"))
                         .map(data, d3.map);

      var margin = {
        top: 50,
        right: 80,
        bottom: 100,
        left: 40
      };

      var width = svg.attr('width') - margin.left - margin.right;
      var height = svg.attr('height') - margin.top - margin.bottom;

      var x = d3.time.scale().range([0, width]).domain(d3.extent(data, d3h("utc")));
      var y = d3.scale.linear().range([height, 0]).domain([0, d3.max(data, d3h("value"))]);

      var xAxis = d3.svg.axis().scale(x).orient("bottom");
      var yAxis = d3.svg.axis()
                    .scale(y)
                    .orient("left")
                    .innerTickSize(-width)
                    .tickPadding(8);

      var color = d3.scale.category10().domain(parameters);

      var line = d3.svg.line()
                   .interpolate("linear")
                   .x(d3h("utc", x))
                   .y(d3h("value", y));

      svg.append("defs").append("clipPath")
         .attr("id", "clip")
         .append("rect")
         .attr("width", width)
         .attr("height", height);

      var chart = svg.append("g")
                     .attr("class", "focus")
                     .attr("transform", d3.svg.transform().translate([margin.left, margin.top]));

      // Legend

      const legendScale = d3.scale.linear().range([0, width]).domain([0, parameters.length]);

      var legends = svg.append("g").attr("class", "legend-container")
                       .attr("transform", d3.svg.transform().translate([margin.left, margin.top - 30]));

      var legend = legends.selectAll(".legend")
                          .data(readings.keys())
                          .enter().append("g")
                          .attr("class", "legend")
                          .attr("transform", (d,i) => {return `translate(${legendScale(i)},0)`});

      legend.append('rect')
            .attr('width', 20)
            .attr('height', 20)
            .style('fill', color)
            .style('stroke', color);

      legend.append('text')
            .attr('x', 25)
            .attr('y', 10)
            .attr('dy', '0.71em')
            .text((d) => { return d; })

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

      // Brush

      const margin2 = {
        top: 430,
        right: 80,
        bottom: 20,
        left: 40
      };

      var height2 = svg.attr('height') - margin2.top - margin2.bottom;

      var x2 = d3.time.scale()
                 .range([0, width])
                 .domain(x.domain());
      var y2 = d3.scale.linear()
                 .range([height2, 0])
                 .domain(y.domain());

      var xAxis2 = d3.svg.axis().scale(x).orient("bottom");

      var line2 = d3.svg.line()
                    .interpolate("linear")
                    .x(d3h("utc", x2))
                    .y(d3h("value", y2));

      var context = svg.append("g")
                       .attr("class", "context")
                       .attr("transform", d3.svg.transform().translate([margin2.left, margin2.top]));


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

      var brush = d3.svg.brush()
                    .x(x2)
                    .on("brush", brushed);

      context.append("g")
             .attr("class", "x brush")
             .call(brush)
             .selectAll("rect")
             .attr("y", -6)
             .attr("height", height2 + 7);

      function brushed() {
        x.domain(brush.empty() ? x2.domain() : brush.extent());
        chart.selectAll(".line").attr("d", d3h("value", line));
        chart.select(".x.axis").call(xAxis);
      }

    };

  }

}

export default connect(mapStateToProps)(Chart);
