var weapons_dict = [{id: "weapon", value: ""},
                  {id: "weapon.gun", value: ""},
                  {id: "weapon.gun.handgun" , value: 0},
                  {id: "weapon.gun.shotgun", value: 0},
                  {id: "weapon.gun.rifle", value: 0},
                  {id: "weapon.gun.firearm", value: 0},
                  {id: "weapon.random", value: ""},
                  {id: "weapon.random.knife", value: 0},
                  {id: "weapon.random.other", value: 0}];

var width = 960,
    height = 960;

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", 
          "translate(1,1)");    

var format = d3.format(",d");

var color = d3.scaleSequential(d3.interpolateWarm)
    .domain([-4, 4]);

var stratify = d3.stratify()
    .parentId(function(d) { return d.id.substring(0, d.id.lastIndexOf(".")); });

var pack = d3.pack()
    .size([width - 2, height - 2])
    .padding(3); 

d3.csv("./data/parsed_data.csv", function(error, data) {
  if (error) throw error;

  console.log(weapons_dict);
  data.forEach(function(d) {
    d.handgun_incidents = +d.handgun_incidents;
    weapons_dict[2]["value"] += d.handgun_incidents;

    d.shotgun_incidents = +d.shotgun_incidents;
    weapons_dict[3]["value"] += d.shotgun_incidents;

    d.rifle_incidents = +d.rifle_incidents;
    weapons_dict[4]["value"] += d.rifle_incidents;

    d.firearm_incidents = +d.firearm_incidents;
    weapons_dict[5]["value"] += d.firearm_incidents;

    d.knife_incidents = +d.knife_incidents;
    weapons_dict[7]["value"] += d.knife_incidents;

    d.other_weapon_incidents = +d.other_weapon_incidents;
    weapons_dict[8]["value"] += d.other_weapon_incidents;
  });

  var root = stratify(weapons_dict)
      .sum(function(d) { return d.value; })
      .sort(function(a, b) { return b.value - a.value; });

  pack(root);

  var node = svg.select("g")
    .selectAll("g")
    .data(root.descendants())
    .enter().append("g")
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
      .attr("class", function(d) { return "node" + (!d.children ? " node--leaf" : d.depth ? "" : " node--root"); })
      .each(function(d) { d.node = this; })
      .on("mouseover", hovered(true))
      .on("mouseout", hovered(false));

  node.append("circle")
      .attr("id", function(d) { return "node-" + d.id; })
      .attr("r", function(d) { return d.r; })
      .style("fill", function(d) { return color(d.depth); })
      .on("mouseover", function(d) {
        if (!d.children) {
          // This is where you would insert the mouseover adding a tooltip.
        }
      });

  var leaf = node.filter(function(d) { return !d.children; });

  leaf.append("clipPath")
      .attr("id", function(d) { return "clip-" + d.id; })
    .append("use")
      .attr("xlink:href", function(d) { return "#node-" + d.id + ""; });

  leaf.append("text")
      .attr("clip-path", function(d) { return "url(#clip-" + d.id + ")"; })
      .attr("id", function(d) { return "leaf-" + d.id; })
    .selectAll("tspan")
    .data(function(d) { return d.id.substring(d.id.lastIndexOf(".") + 1).split(/(?=[A-Z][^A-Z])/g); })
    .enter().append("tspan")
      .attr("x", 0)
      .attr("y", function(d, i, nodes) { return 13 + (i - nodes.length / 2 - 0.5) * 10; })
      .text(function(d) { return d; });

  node.append("title")
      .text(function(d) { return d.id + "\n" + format(d.value); });
});

function hovered(hover) {
  return function(d) {
    d3.selectAll(d.ancestors().map(function(d) { return d.node; })).classed("node--hover", hover);
  };
}