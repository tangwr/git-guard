function getHeatMap(url){
  var option = "/stats/punch_card";
  d3.json(url + option, heatMap);
}

function heatMap(dataset){


  
  var margin = { top: 50, right: 120, bottom: 100, left: 80 },
          width = 960 - margin.left - margin.right,
          height = 430 - margin.top - margin.bottom,
          gridSize = Math.floor(width / 24),
          legendElementWidth = gridSize*2,
          buckets = 6,
    			colors = [ "#1a9850", "#66bd63", "#a6d96a", "#d9ef8b", "#ffffbf", "#fee08b", "#fdae61","#f46d43", "#d73027"],
         // colors = ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"], // alternatively colorbrewer.YlGnBu[9]
          days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
          //times = ["0000", "0100", "0200", "0300", "0400", "0500", "0600", "0700", "0800", "0900", "1000", "1100", "1200", "1300", "1400", "1500", "1600", "1700", "1800", "1900", "2000", "2100", "2200", "2300"];
          times = ["12am", "1am", "2am", "3am", "4am", "5am", "6am", "7am", "8am", "9am", "10am", "11am", "12pm", "1pm", "2pm", "3pm", "4pm", "5pm", "6pm", "7pm", "8pm", "9pm", "10pm", "11pm"];
//https://gist.githubusercontent.com/cpattee/7ecfdf7cd4b4881f9102/raw/f4dedda6494edf29e2b4f83151b77663be28a788/example.json
//var url = "https://gist.githubusercontent.com/cpattee/7ecfdf7cd4b4881f9102/raw/f4dedda6494edf29e2b4f83151b77663be28a788/example.json";
//var url = "https://api.github.com/repos/tungnk1993/scrapy/stats/punch_card";
//d3.json(url, function(error,dataset){
    
    var data = [];
    for(var i=0; i<dataset.length; i++){
      var obj = new Object();
      obj.day = dataset[i][0];
      obj.hour = dataset[i][1];
      obj.value = dataset[i][2];

      data.push(obj);
    }
    
    var colorScale = d3.scale.quantile()
        .domain([0, buckets - 1, d3.max(data, function (d) { return d.value; })])
        .range(colors);

    var svg = d3.select("#punchCardChart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var dayLabels = svg.selectAll(".dayLabel")
        .data(days)
        .enter().append("text")
          .text(function (d) { return d; })
          .attr("x", 0)
          .attr("y", function (d, i) { return i * gridSize; })
          .style("text-anchor", "end")
          .attr("transform", "translate(-40," + (gridSize / 1.5 - 40) + ")")
          .attr("class", function (d, i) { return ((i >= 0 && i <= 6) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis"); });

    var timeLabels = svg.selectAll(".timeLabel")
        .data(times)
        .enter().append("text")
          .text(function(d) { return d; })
          .attr("x", function(d, i) { return i * gridSize; })
          .attr("y", 0)
          .style("text-anchor", "middle")
          .attr("transform", "translate(" + (gridSize / 2 - 35 )+ ", -40)")
          .attr("class", function(d, i) { return ((i >= 0 && i <= 23) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis"); });

    var heatMap = svg.selectAll(".hour")
        .data(data)
        .enter().append("rect")
        .attr("x", function(d) { return (d.hour - 1) * gridSize; })
        .attr("y", function(d) { return (d.day - 1) * gridSize; })
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("class", "hour bordered")
        .attr("width", gridSize)
        .attr("height", gridSize)
        .style("fill", colors[0]);

    heatMap.transition().duration(1000)
        .style("fill", function(d) { return colorScale(d.value); });

    heatMap.append("title").text(function(d) { return d.value; });
        
    var legend = svg.selectAll(".legend")
        .data([0].concat(colorScale.quantiles()), function(d) { return d; })
        .enter().append("g")
        .attr("class", "legend");

    legend.append("rect")
      .attr("x", function(d, i) { return (legendElementWidth * i) + 80; })
      .attr("y", height-20)
      .attr("width", legendElementWidth)
      .attr("height", gridSize / 2)
      .style("fill", function(d, i) { return colors[i]; });

    legend.append("text")
      .attr("class", "mono")
      .text(function(d) { return "≥ " + Math.round(d); })
      .attr("x", function(d, i) { return (legendElementWidth * i) + 100; })
      .attr("y", height + gridSize -20)
      .attr("class", function(d, i) { return "timeLabel mono axis axis-worktime" });;
      
}
