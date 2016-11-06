function getMultiLineGraph(url){

  var graph_data = [];
  var author_data = [];

  var option = "/stats/contributors";

  url = url + option;

  $.getJSON(url, function (jsonData) {
    $.each(jsonData, function(index, jsonObj){
        var author = jsonObj.author.login;
        var total_commit = jsonObj.total;
        var weeks = jsonObj.weeks;   

        for(var i=0; i<user_data_arr.length; i++){
  
          if(user_data_arr[i][0].includes("img")){
            var user_author = user_data_arr[i][0].split(">")[1].trim();
            user_data_arr[i][0] = String(user_author);
          }
 
          if(author == user_data_arr[i][0]){
            graph_data.push(jsonObj);
            author_data.push(author);
          }
        
        }
    });

    //lineGraph(graph_data, author_data);
    multiLineGraph(graph_data, author_data);
  });
}


function multiLineGraph(graph_data, author_data){

  var combined_week_data = [], combined_addition_data = [], combined_delete_data = [], combined_commit_data = [];

  for(var i=0; i<graph_data.length; i++){
    //console.log(graph_data[i]);

    var  week_data = [], addition_data = [], delete_data = [], commit_data = [];

    for(var j=0; j<graph_data[i].weeks.length; j++){
      week_data.push(graph_data[i].weeks[j].w);
      addition_data.push(graph_data[i].weeks[j].a);
      delete_data.push(graph_data[i].weeks[j].d);
      commit_data.push(graph_data[i].weeks[j].c);
    }
    combined_week_data.push(week_data);
    combined_addition_data.push(addition_data);
    combined_delete_data.push(delete_data);
    combined_commit_data.push(commit_data);
  }
  
  var json_addition_data = [], json_delete_data = [], json_commit_data = [];

  for(var i=0; i<combined_week_data[0].length; i++){
    var json_addition = new Object();
    var json_delete = new Object();
    var json_commit = new Object();

    json_addition['week'] = combined_week_data[0][i];
    json_delete['week'] = combined_week_data[0][i];
    json_commit['week'] = combined_week_data[0][i];

    for(var j=0; j<author_data.length; j++){
      json_addition[author_data[j]] = combined_addition_data[j][i];
      json_delete[author_data[j]] = combined_delete_data[j][i];
      json_commit[author_data[j]] = combined_commit_data[j][i];
    }
    json_addition_data.push(json_addition);
    json_delete_data.push(json_delete);
    json_commit_data.push(json_commit);
  }
  
  json_addition_data = JSON.parse(JSON.stringify(json_addition_data));
  json_delete_data = JSON.parse(JSON.stringify(json_delete_data));
  json_commit_data = JSON.parse(JSON.stringify(json_commit_data));
  
  //console.log(json_addition_data);

  renderGraph(json_addition_data, author_data, "additionChart");
  renderGraph(json_delete_data, author_data, "deletionChart");
  renderGraph(json_commit_data, author_data, "commitChart");
}


function renderGraph(json_data, author_data,chart){

  function brush() {
    x.domain(brush.empty() ? x2.domain() : brush.extent());
    focus.selectAll("path.line").attr("d",  function(d) {return line(d.values)});
    focus.select(".x.axis").call(xAxis);
    focus.select(".y.axis").call(yAxis);
  }

  function draw() {
    focus.select(".area").attr("d", line);
    focus.select(".x.axis").call(xAxis);
    // Force changing brush range
    brush.extent(x.domain());
    svg.select(".brush").call(brush);
  }


  var margin = {top: 10, right: 200, bottom: 100, left: 40},
    margin2 = {top: 430, right: 10, bottom: 20, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    height2 = 500 - margin2.top - margin2.bottom;
 
  var color = d3.scale.category10();
   
  var parseDate = d3.time.format("%Y%m%d").parse;
   
  var x = d3.time.scale().range([0, width]),
      x2 = d3.time.scale().range([0, width]),
      y = d3.scale.linear().range([height, 0]),
      y2 = d3.scale.linear().range([height2, 0]);
   
  var xAxis = d3.svg.axis().scale(x).orient("bottom"),
      xAxis2 = d3.svg.axis().scale(x2).orient("bottom"),
      yAxis = d3.svg.axis().scale(y).orient("left");
   
  var brush = d3.svg.brush()
      .x(x2)
      .on("brush", brush);
   
  var line = d3.svg.line()
      .defined(function(d) { return !isNaN(d.user_data); })
      .interpolate("cubic")
      .x(function(d) { return x(d.week); })
      .y(function(d) { return y(d.user_data); });
   
  var line2 = d3.svg.line()
      .defined(function(d) { return !isNaN(d.user_data); })
      .interpolate("cubic")
      .x(function(d) {return x2(d.week); })
      .y(function(d) {return y2(d.user_data); });

  var svg = d3.select("#" + chart).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);
   
  svg.append("defs").append("clipPath")
      .attr("id", "clip")
    .append("rect")
      .attr("width", width)
      .attr("height", height);
   
  var focus = svg.append("g")
    .attr("class", "focus")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
  var context = svg.append("g")
    .attr("class", "context")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

  /*
  var zoom = d3.behavior.zoom()
      .on("zoom", draw);

  // Add rect cover the zoomed graph and attach zoom event.
  var rect = svg.append("svg:rect")
      .attr("class", "pane")
      .attr("width", width)
      .attr("height", height)
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .call(zoom);

  */

  //Main

  //console.log(json_data);
  color.domain(d3.keys(json_data[0]).filter(function(key) { return key !== "week";}));
 
  json_data.forEach(function(d) {

    //d3.time.format("%Y%m").parse;
    var date = new Date(d.week*1000).toISOString();
    //console.log(date);
    date = date.toString().substring(0,10).replace(new RegExp('-', 'g'), "");
    //console.log(date);
    
    d.week = parseDate(date);
    //console.log(d.week);
    //console.log("------------");
  });

  var sources = color.domain().map(function(author) {
    return {
      author: author,
      values: json_data.map(function(d) {
        return {week: d.week, user_data: +d[author]};
      })
    };
  });

  x.domain(d3.extent(json_data, function(d) { return d.week; }));
  y.domain([d3.min(sources, function(c) { return d3.min(c.values, function(v) { return v.user_data; }); }),
            d3.max(sources, function(c) { return d3.max(c.values, function(v) { return v.user_data; }); }) ]);
  x2.domain(x.domain());
  y2.domain(y.domain());

  //zoom.x(x);
  

  

  legendSpace = width/author_data.length; // spacing for legend
  //console.log(legendSpace);
  // Loop through each symbol / key
  author_data.forEach(function(d,i) { 
    //console.log(d);  
    // Add the Legend
    svg.append("text")
        .attr("x", width+50)//(legendSpace/2)+i*legendSpace) // spacing
        .attr("y", 10 * (i+1))//height) + (margin.bottom/2))
        .attr("class", "legend")    // style the legend
        .style("fill", function() { // dynamic colours
            return d.color = color(d); })
        .text(d);
    
  });


  var focuslineGroups = focus.selectAll("g")
      .data(sources)
    .enter().append("g");
    
  var focuslines = focuslineGroups.append("path")
      .attr("class","line")
      .attr("d", function(d) { return line(d.values); })
      .style("stroke", function(d) {return color(d.author);})
      .attr("clip-path", "url(#clip)");
  
   


  

  focus.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  focus.append("g")
      .attr("class", "y axis")
      .call(yAxis);
      
  var contextlineGroups = context.selectAll("g")
      .data(sources)
    .enter().append("g");
  
  var contextLines = contextlineGroups.append("path")
      .attr("class", "line")
      .attr("d", function(d) { return line2(d.values); })
      .style("stroke", function(d) {return color(d.author);})
      .attr("clip-path", "url(#clip)");

  context.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height2 + ")")
      .call(xAxis2);

  context.append("g")
      .attr("class", "x brush")
      .call(brush)
    .selectAll("rect")
      .attr("y", -6)
      .attr("height", height2 + 7);
  /*
  legend = svg.append("g")
    .attr("class","legend")
    .attr("transform","translate(50,30)")
    .style("font-size","12px");
  */
  

 
}