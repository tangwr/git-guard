function getBarChart(url){
  var option = "/stats/commit_activity";
  d3.json(url + option, barChart);
}



function barChart(dataset){

  var margin = {top: 20, right: 120, bottom: 90, left: 30},
    width = 960 - margin.left - margin.right, //1260
    height = 600 - margin.top - margin.bottom; //600

  var x = d3.scale.ordinal()
      .rangeRoundBands([0, width], .1);

  var y = d3.scale.linear()
      .rangeRound([height, 0]);

  var color = d3.scale.ordinal()
      .range([ "#1a9850", "#66bd63", "#a6d96a", "#d9ef8b", "#fdae61","#f46d43", "#d73027"]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .tickFormat(d3.format(".2s"));

  var svg = d3.select("#commitActivityChart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var data = [];
  var maxData = 0;
    for(var i=0; i<dataset.length; i++){

          var obj = new Object();

          var date = new Date(dataset[i]["week"]*1000);
          date = date.toString().substring(3,15);
          obj.Week = "Wk " + (i+1).toString() + " : " + date;
                   
          obj.Saturday = dataset[i]["days"][6];
          obj.Friday = dataset[i]["days"][5];
          obj.Thursday = dataset[i]["days"][4];
          obj.Wednesday = dataset[i]["days"][3];
          obj.Tuesday = dataset[i]["days"][2];
          obj.Monday = dataset[i]["days"][1];
          obj.Sunday = dataset[i]["days"][0];

          var k = dataset[i]["days"][6] + dataset[i]["days"][5] + dataset[i]["days"][4] + dataset[i]["days"][3] 
          + dataset[i]["days"][2] + dataset[i]["days"][1] + dataset[i]["days"][0];

          if(k > maxData){
            maxData = k;
          }
                
          data.push(obj);
    }
    var j = 0
    svg.selectAll("text")
   .data(data)
   .enter()
   .append("text")
   .text(function(d,i) {
        return d.Sunday + d.Monday + d.Tuesday + d.Wednesday + d.Thursday + d.Friday + d.Saturday;
   })
    .attr("x", function(d, i) {
      var actual_w = 960 -150;
        return i * (actual_w / data.length) + 22 - i + i/10 + i/5;
   })
   .attr("y", function(d) {
        var h = d.Sunday + d.Monday + d.Tuesday + d.Wednesday + d.Thursday + d.Friday + d.Saturday;
        var actual_h = 600-110;

        if(h != 0){
          return actual_h - (actual_h/maxData * h + 5);
        }else{
          return -actual_h;
        }
   });

  color.domain(d3.keys(data[0]).filter(function(key) { return key !== "Week"; }));

  data.forEach(function(d,i) {
    var y0 = 0;
    d.ages = color.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name], xx: i+1}; });
    d.total = d.ages[d.ages.length - 1].y1;
  });


  x.domain(data.map(function(d) { return d.Week; }));
  y.domain([0, d3.max(data, function(d) { return d.total; })]);

  // .attr("transform", "translate(0," + height + ")")
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll("text")  
       .style("text-anchor", "end")
       .attr("dx", "-.8em")
       .attr("dy", ".15em")
       .attr("transform", "rotate(-45)")
    .append("text")
      .attr("y", 30)
      .attr("dx", 500)
      .style("text-anchor", "end")
      .text("Weeks");;

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -30)
      .attr("dx", -200)
      .style("text-anchor", "end")
      .text("Commits");

  var state = svg.selectAll(".state")
      .data(data)
    .enter().append("g")
      .attr("class", "g")
      .attr("transform", function(d) { return "translate(" + x(d.Week) + ",0)"; });

  state.selectAll("rect")
      .data(function(d,i) { return d.ages; })
    .enter().append("rect")
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.y1); })
      .attr("height", function(d) { return y(d.y0) - y(d.y1); })
      .style("fill", function(d) { return color(d.name); });

  //state.append("title").text(function(d) { return d.ages; });
  state.selectAll("rect").append("title").text(function(d) { return d.y1 - d.y0; })
  
  
   
  /*
   .on("mouseover", function() { tooltip.style("display", null); })
      .on("mouseout", function() { tooltip.style("display", "none"); })
      .on("mousemove", function(d) {
        var xPosition = (15 * d.xx) + ((d.xx-1) * 5);
        var yPosition = d3.mouse(this)[1] - 25 ;
        tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
        tooltip.select("text").text(d.y1 - d.y0);
      })
*/
  var legend = svg.selectAll(".legend")
      .data(color.domain().slice().reverse())
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });


  // Prep the tooltip bits, initial display is hidden
  /*
  var tooltip = svg.append("g")
    .attr("class", "tooltip")
    .style("display", "none");
      
  tooltip.append("rect")
    .attr("width", 30)
    .attr("height", 20)
    .attr("fill", "white")
    .style("opacity", 0.5);

  tooltip.append("text")
    .attr("x", 15)
    .attr("dy", "1.2em")
    .style("text-anchor", "middle")
    .attr("font-size", "12px")
    .attr("font-weight", "bold");
    */

}