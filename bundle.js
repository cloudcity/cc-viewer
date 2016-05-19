/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	// Create a function that returns a particular property of its parameter.
	// If that property is a function, invoke it (and pass optional params).
	function F(name, helper){
	  var id = function(d) { return d; };
	  if (name === undefined) { return id; }
	  if (helper === undefined) { helper = id; }

	  return function(o){
	    return helper(typeof (v=o[name])==='function' ? v.apply(o) : v );
	  };
	}

	var margin = {top: 10, right: 80, bottom: 100, left: 40};
	var margin2 = {top: 430, right: 80, bottom: 20, left: 40};
	var width = 960 - margin.left - margin.right;
	var height = 500 - margin.top - margin.bottom;
	var height2 = 500 - margin2.top - margin2.bottom;

	var parseTime = d3.time.format.iso.parse;

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


	var brush = d3.svg.brush()
	      .x(x2)
	      .on("brush", brushed);

	var color = d3.scale.category10();

	var line = d3.svg.line()
	    .interpolate("linear")
	    .x(F('utc', x))
	    .y(F('value', y));

	var line2 = d3.svg.line()
	      .interpolate("linear")
	      .x(F('utc', x2))
	      .y(F('value', y2));

	var svg = d3.select("#report").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom);

	svg.append("defs").append("clipPath")
	    .attr("id", "clip")
	  .append("rect")
	    .attr("width", width)
	    .attr("height", height);

	var focus = svg.append("g")
	    .attr("class", "focus")
	    .attr("transform", d3.svg.transform().translate([margin.left, margin.top]));

	var context = svg.append("g")
	      .attr("class", "context")
	      .attr("transform", d3.svg.transform().translate([margin2.left, margin2.top]));

	d3.csv("/data/openaq.csv", function(data) {

	  data.forEach(function(d) {
	    d.utc = parseTime(d.utc);
	    d.value = +d.value;
	  });

	  var readings = d3.nest()
	      .key(F('parameter'))
	      .map(data, d3.map);

	  color.domain(readings.keys());

	  x.domain(d3.extent(data, F('utc')));
	  y.domain([0, d3.max(data, F('value'))]);

	  x2.domain(x.domain());
	  y2.domain(y.domain());

	  // Focus

	  var reading = focus.selectAll(".reading")
	      .data(readings.entries())
	    .enter().append("g")
	      .attr("class", "reading");

	  reading.append("path")
	      .attr("class", "line")
	      .attr("d", F('value', line))
	      .style("stroke", F('key', color));

	  focus.append("g")
	      .attr("class", "x axis")
	      .attr("transform", d3.svg.transform().translate([0, height]))
	      .call(xAxis);

	  focus.append("g")
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
	      .attr("d", function(d) { return line2(d.value); })
	      .style("stroke", function(d) { return color(d.key); });

	  context.append("g")
	    .attr("class", "x axis")
	    .attr("transform", d3.svg.transform().translate([0, height2]))
	    .call(xAxis2);

	  context.append("g")
	    .attr("class", "x brush")
	    .call(brush)
	    .selectAll("rect")
	    .attr("y", -6)
	    .attr("height", height2 + 7);
	});

	function brushed() {
	  x.domain(brush.empty() ? x2.domain() : brush.extent());
	  focus.selectAll(".line").attr("d", F('value', line));
	  focus.select(".x.axis").call(xAxis);
	}


/***/ }
/******/ ]);