var state1 = "California";
var state2 = "Minnesota";
var state3 = "Florida";

var state1Tot = 0;
var state2Tot = 0;
var state3Tot = 0;

tData = [
    {label:state1, value:790},
    {label:state2, value:102},
    {label:state3, value:1571},
];

var fillData = d3.csv("./data/parsed_data.csv", function(error, data) {
    if (error) throw error;
    data.forEach(function(d) {
        d.total_incidents = +d.total_incidents;
        if(d.state == state1) {
            state1Tot += d.total_incidents;
        }
        if(d.state == state2) {
            state2Tot += d.total_incidents;
        }
        if(d.state == state3) {
            state3Tot += d.total_incidents;
        }

    });
    
});


var div = d3.select("body").append("div").attr("class", "toolTip");

var axisMargin = 20,
        margin = 40,
        valueMargin = 4,
        width = parseInt(d3.select('body').style('width'), 10),
        height = parseInt(d3.select('body').style('height'), 10),
        barHeight = (height-axisMargin-margin*2)* 0.4/tData.length,
        barPadding = (height-axisMargin-margin*2)*0.6/tData.length,
        data, bar, svg, scale, xAxis, labelWidth = 0;


max = d3.max(tData, function(d) { return d.value; });

svg = d3.select('body')
        .append("svg")
        .attr("width", width)
        .attr("height", height);   


bar = svg.selectAll("g")
        .data(tData)
        .enter()
        .append("g");

bar.attr("class", "bar")
        .attr("cx",0)
        .attr("transform", function(d, i) {
            return "translate(" + margin + "," + (i * (barHeight + barPadding) + barPadding) + ")";
        });

bar.append("text")
        .attr("class", "label")
        .attr("y", barHeight / 2)
        .attr("dy", ".35em") //vertical align middle
        .text(function(d){
            return d.label;
        }).each(function() {
    labelWidth = Math.ceil(Math.max(labelWidth, this.getBBox().width));
    // console.log(barHeight / 2);
});

scale = d3.scaleLinear()
        .domain([0, max])
        .range([0, width - margin*2 - labelWidth]);

xAxis = d3.axisBottom()
        .scale(scale)
        .tickSize(-height + 2*margin + axisMargin);
        // .tickSize(10);

bar.append("rect")
        .attr("transform", "translate("+labelWidth+", 0)")
        .attr("height", barHeight)
        .attr("width", function(d){
            return scale(d.value);
        });

bar.append("text")
        .attr("class", "value")
        .attr("y", barHeight / 2)
        .attr("dx", -valueMargin + labelWidth) //margin right
        .attr("dy", ".35em") //vertical align middle
        .attr("text-anchor", "end")
        .text(function(d){
            // console.log(d.value);
            return (d.value);
        })
        .attr("x", function(d){
            var width = this.getBBox().width;
            return Math.max(width + valueMargin, scale(d.value));
        });


var percent;
bar.on("mousemove", function(d){
            div.style("left", d3.event.pageX+10+"px");
            div.style("top", d3.event.pageY-25+"px");
            div.style("display", "inline-block");
            if(d.label == state1) {
                percent = (d.value / state1Tot) * 100;
                div.html((d.label)+"<br>"+"Percent : "+(percent.toFixed(2)) + "%");
            } 
            if(d.label == state2) {
                percent = (d.value / state2Tot) * 100;
                div.html((d.label)+"<br>"+"Percent : "+(percent.toFixed(2)) + "%");
            } 
            if(d.label == state3) {
                percent = (d.value / state3Tot) * 100;
                div.html((d.label)+"<br>"+"Percent : "+(percent.toFixed(2)) + "%");
            }

     
    });
bar.on("mouseout", function(d){
            div.style("display", "none");
        });

svg.insert("g",":first-child")
        .attr("class", "axisHorizontal")
        .attr("transform", "translate(" + (margin + labelWidth) + ","+ (height - axisMargin - margin)+")")
        .call(xAxis);
      