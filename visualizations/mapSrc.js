// Set graph dimensions and margins
var margin = {top: 50, right: 20, bottom: 110, left: 40},
    width = 1200 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

var stateLookup = [];

var weaponDict = [];

var projection = d3.geoAlbersUsa()
            .translate([width / 2, height / 2])
            .scale([1400]);

var colorScale = d3.scaleQuantize()
                .range(['rgb(255,245,240)','rgb(254,224,210)','rgb(252,187,161)','rgb(252,146,114)','rgb(251,106,74)','rgb(239,59,44)','rgb(203,24,29)','rgb(165,15,21)','rgb(103,0,13)']);

//Define path generator, using the Albers USA projection
var path = d3.geoPath()
       .projection(projection);
          
// Appends an svg to the body and a group which is moved to the top left margin
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");


// Get data
d3.csv("./data/parsed_data.csv", function(error, data) {
  if (error) throw error;

  // Formats data
  data.forEach(function(d) {
    d.total_incidents = +d.total_incidents;

    if (!stateLookup.includes(d.state)) {
      stateLookup.push(d.state);
      weaponDict.push({state : d.state, total_incidents : 0});
    }
    weaponDict[stateLookup.indexOf(d.state)].total_incidents += d.total_incidents;
  });

  colorScale.domain([d3.min(weaponDict, function(d) { return d.total_incidents; }),
              d3.max(weaponDict, function(d) { return d.total_incidents; })]);

  //Load in GeoJSON data
    d3.json("./data/us_states.json", function(json) {

      for (var i = 0 ; i < weaponDict.length ; i++) {
        //Grab state name
        var dataState = weaponDict[i].state;

        //Grab data value, and convert from string to float
        var dataValue = weaponDict[i].total_incidents;

        for (var j = 0 ; j < json.features.length ; j++) {
          var jsonState = json.features[j].properties.name;

          if (dataState == jsonState) {
            //Copy the datavalue into the JSON
            json.features[j].properties.value = dataValue;
          }
        }
      }
      
      //Bind data and create one path per GeoJSON feature
      svg.selectAll("path")
         .data(json.features)
         .enter()
         .append("path")
         .attr("d", path)
         .style("stroke", "black")
         .style("stroke-width", ".3px")
         .style("fill", function(d) {
          //Get data value
          var value = d.properties.value;

          if (value) {
            //If value exists
            return colorScale(value);
          } else {
            //If value is undefined
            return "#ccc";
          }
        });
      svg.selectAll("text")
        .data(json.features)
        .enter()
        .append("text")
        .attr("class", "label")
        .attr("x", function(d) {
          return path.centroid(d)[0];
        })
        .attr("y", function(d) {
          return path.centroid(d)[1];
        })
        .text(function(d) {
          if (d.properties.value) {
            return d.properties.value;
          }
        });

      });

  // Make a title
  svg.append("text")
      .attr("x", (width / 2))
      .attr("y", 0 - (margin.top / 2))
      .attr("text-anchor", "middle")
      .style("font-size", "20px")
      .text("Map Depicting Homicides in the United States: 1980-2014");

});