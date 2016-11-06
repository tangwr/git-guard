/*
var github_api = "https://api.github.com/repos";
var author = "/cs2103aug2015-w09-2j";
var project = "/main"
var git_repo_type = "/stats";
var git_option = "/contributors";

var url = github_api + author + project + git_repo_type + git_option;
*/

var svg = d3.select("svg"),
  margin = {top: 20, right: 80, bottom: 30, left: 50},
  width = svg.attr("width") - margin.left - margin.right,
  height = svg.attr("height") - margin.top - margin.bottom,
  g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var parseTime = d3.timeParse("%Y%m%d");

var x = d3.scaleTime().range([0, width]),
  y = d3.scaleLinear().range([height, 0]),
  z = d3.scaleOrdinal(d3.schemeCategory10);

var line = d3.line()
  .curve(d3.curveBasis)
  .x(function(d) { return x(d.week); })
  .y(function(d) { return y(d.user_data); });


function lineGraph(graph_data, author_data){
  //console.log(author_data);
  //covert graph_data to json format
  

  
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
  
  console.log(json_addition_data);
 
 


  //1.20am 4/11/2016
  
  renderGraph(json_addition_data, author_data);
}

function renderGraph(json_data, author_data){

  var user_history = author_data.map(function(author){
    //console.log(author);
      return {
        author: author,
        values: json_data.map(function(d) {
        
        //console.log(d);

        return {week: d.week, user_data: d[author]};
      })
    };
  });

  x.domain(d3.extent(json_data, function(d) { return d.week; }));

  y.domain([
    d3.min(user_history, function(u) { return d3.min(u.values, function(d) { return d.user_data; }); }),
    d3.max(user_history, function(u) { return d3.max(u.values, function(d) { return d.user_data; }); })
  ]);

  z.domain(user_history.map(function(u) { return u.author; }));

  g.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  g.append("g")
    .attr("class", "axis axis--y")
    .call(d3.axisLeft(y))
  .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", "0.71em")
    .attr("fill", "#000")
    .text("Temperature, ºF");

  var history = g.selectAll(".history")
    .data(user_history)
    .enter().append("g")
      .attr("class", "history");
  
  history.append("path")
      .attr("class", "line")
      .attr("d", function(d) { console.log(d.values); return line(d.values); })
      .style("stroke", function(d) { return z(d.author); });
  
  history.append("text")
      .datum(function(d) { return {author: d.author, value: d.values[d.values.length - 1]}; })
      .attr("transform", function(d) { return "translate(" + x(d.value.week) + "," + y(d.value.user_data) + ")"; })
      .attr("x", 3)
      .attr("dy", "0.35em")
      .style("font", "10px sans-serif")
      .text(function(d) { return d.author; });

}



