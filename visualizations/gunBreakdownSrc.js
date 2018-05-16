var init = 0;

var homicides = {
  handgun: init,
  shotgun: init,
  rifle: init,
  firearm: init,
  other: init
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
var chart1 = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Get data
d3.csv("./data/parsed_data.csv", function(error, data) {
  if (error) throw error;

  // Fills up diciontary
  data.forEach(function(d) {
    d.handgun_incidents = +d.handgun_incidents;
    homicides["handgun"] += d.handgun_incidents;

    d.shotgun_incidents = +d.shotgun_incidents;
    homicides["shotgun"] += d.shotgun_incidents;

    d.rifle_incidents = +d.rifle_incidents;
    homicides["rifle"] += d.rifle_incidents;

    d.firearm_incidents = +d.firearm_incidents;
    homicides["firearm"] += d.firearm_incidents;

    d.knife_incidents = +d.knife_incidents;
    d.other_weapon_incidents = +d.other_weapon_incidents;

    homicides["other"] += (d.knife_incidents + d.other_weapon_incidents);
  })

  var maxVal = homicides["handgun"]; // Assigns to first value of array to make sure value exists

  var tHom = [];
  for(hom in homicides) {
    tHom.push(hom);
    if(homicides[hom] > maxVal) {
      maxVal = homicides[hom];
    }
  }

  x.domain(tHom.map(function(d) { return d; })); 
  y.domain([0, maxVal]);

  var tooltip2 = d3.select("body")
    .data(tHom)
    .append("div")
    .attr("id", "tooltip2") //
    .style("opacity", 0); //

  // Append rectangles for the bar chart
  chart1.selectAll(".bar")
      .data(tHom)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { // Should return seasons
        return x(d); })
      .attr("width", x.bandwidth())
      .attr("y", function(d) {  // Should return values
        
        return y(homicides[d]); })
      .attr("height", function(d) { 
      
        return height - y(homicides[d]); }) // This should be height - value
      .attr("fill", "red")
      .on('mouseover', function(d) {
        onMouseOver();
        var numHom = homicides[d];
        d3.select(this)
        .attr("fill", "gray");
        tooltip2.text(function(d) {
          return numHom;
        });
      })
      .on('mouseout', function(d) {
        onMouseOut();
        d3.select(this).attr("fill", "red");
      });


  // add the X Axis
  chart1.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
     .selectAll("text") 
     .style("text-anchor", "middle")
        .attr("dx", ".0em")
  .style("font-size", "12px") 
        .attr("dy", ".75em");

  // add the Y Axis
  chart1.append("g")
      .style("font-size", "14px")
      .call(d3.axisLeft(y));

  chart1.append("text")
      .attr("x", (width / 2))
      .attr("y", 0 - (margin.top / 2))
      .attr("text-anchor", "middle")
      .style("font-size", "25px")
      .text("Homicides In Gun Categories versus All Others");
});

function onMouseOver(d) {
  var tooltipDiv = d3.select("#tooltip2"); 

  tooltipDiv.transition()        
     .duration(200)      
     .style("opacity", 1);   

  tooltipDiv
      .style("left", d3.event.pageX + "px") 
     .style("cursor", "pointer")
     .style("top", d3.event.pageY + "px") 
      .style("color", "#000000"); 
}

function onMouseOut(d){
    var tooltipDiv = d3.select("#tooltip2").style("opacity", 0); 
}

  