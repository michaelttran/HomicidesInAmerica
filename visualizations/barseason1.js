var init = 0;

var seasonSum = {
  spring: init,
  summer: init,
  fall: init,
  winter: init
};

var seasonMonth = {
  spring: ["March", "April", "May"],
  summer: ["June", "July", "August"],
  fall: ["September", "October", "November"],
  winter: ["December", "January", "February"]
};

// Set graph dimensions and margins
var margin = {top: 50, right: 20, bottom: 200, left: 100},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// Set ranges
var x = d3.scaleBand()
          .range([0, width])
          .padding(0.1);
var y = d3.scaleLinear()
          .range([height, 0]);  
          
// Appends an svg to the body and a group which is moved to the top left margin
var chart3 = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Get data
d3.csv("./data/parsed_data.csv", function(error, data) {
  if (error) throw error;

  // Counts homicides per season
  data.forEach(function(d) {
    d.total_incidents = +d.total_incidents;
    for(var key in seasonMonth) {
      if(seasonMonth[key].includes(d.month)) {
        seasonSum[key] += d.total_incidents;
      }
    }
  })

  var maxVal = seasonSum["spring"]; // Assigns to first value of array to make sure value exists
  var tSeason = [];

  // Finds max value from sum of homicides of each season
  for(season in seasonSum) {
    tSeason.push(season);
    if(maxVal < seasonSum[season]) {
      maxVal = seasonSum[season];
    }
  }

  x.domain(tSeason.map(function(d) { return d; })); 
  y.domain([0, maxVal]);

  var tooltip = d3.select("body")
    .data(tSeason)
    .append("div")
    .style("visibility", "hidden");

  // Append rectangles for the bar chart
  chart3.selectAll(".bar")
      .data(tSeason)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { // Should return seasons
        return x(d); })
      .attr("width", x.bandwidth())
      .attr("y", function(d) {  // Should return values
        
        return y(seasonSum[d]); })
      .attr("height", function(d) { 
      
        return height - y(seasonSum[d]); }) // This should be height - value
      .attr("fill", "red")
      .on('mouseover', function(d) {
        var numHom = seasonSum[d];
        d3.select(this)
        .attr("fill", "gray");
        tooltip.style("visibility", "visible")
                .text(function(d) {
                      return numHom;
              });
      })
      .on('mouseout', function(d) {
        d3.select(this).attr("fill", "red");
        return tooltip.style("visibility", "hidden");
      });


  // add the X Axis
  chart3.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
     .selectAll("text") 
     .style("text-anchor", "middle")
        .attr("dx", ".0em")
  .style("font-size", "12px") 
        .attr("dy", ".75em");

  // add the Y Axis
  chart3.append("g")
      .style("font-size", "14px")
      .call(d3.axisLeft(y));

  chart3.append("text")
      .attr("x", (width / 2))
      .attr("y", 0 - (margin.top / 2))
      .attr("text-anchor", "middle")
      .style("font-size", "25px")
      .text("Number of Homicides per Season");

});
