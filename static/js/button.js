/*
var github_api = "https://api.github.com/repos";
var author = "/cs2103aug2015-w09-2j";
var project = "/main"
var git_repo_type = "/stats";
var git_option = "/contributors";

var url = github_api + author + project + git_repo_type + git_option;

*/
var github_url = "https://github.com/"

var github_api = "https://api.github.com/repos/";
var author = "/cs2103aug2015-w09-2j"; //"/tungnk1993";
var project = "/main"; //"/scrapy"; 
//var author = "/tungnk1993";
//var project = "/scrapy"; 
var git_repo_type = "/stats";   
var git_option = "/contributors";

var url;// = github_api + author + project + git_repo_type + git_option;


//https://api.github.com/repos/tungnk1993/scrapy/git/trees/master?recursive=1
//https://api.github.com/repos/tungnk1993/scrapy/commits/314db3db


/*
$("#clearButton").click(function(){
  d3.selectAll("svg").remove();
});
*/
$("#searchBox").val("https://github.com/nusmodifications/nusmods");
$("#all").hide();
$("#divTable").hide();
$("#commitHistory").hide();


//$("#notificationButton").hide();


var data1 = {"d":"dd"};
//cs2103aug2015-w09-2j/main
$("#searchButton").click(function(){



  d3.selectAll("svg").remove();
  $("#divTable").show();
  $("#all").show();
  $("#notificationButton").show();
  

  var link = $("#searchBox").val();

 
  
  $.post( "/search", {
      javascript_data: link
  });

  $("#notifyRepo").val(link);
  
  if(link.indexOf(github_url) == 0){
    user_project = link.split(".com/")[1];
    
  }else{
    user_project = link;
  }

  url = github_api + user_project;// + git_repo_type + git_option;
  console.log(user_project);
 
  datatables(url);
  
  getHeatMap(url);
  getBarChart(url);
	
 



});

$("#getButton").click(function(){
  
  $("#commitHistory").show();
  getMultiLineGraph(url);
});




/*
/repos/:owner/:repo/contributors		#list of contributors only
/repos/:owner/:repo/stats/contributors		#addition, deletetion, commit of each contributors
		#commit history
		#commit history of a specific file option to slect a code chunk(specific line numbers) and show the history of edits on those lines
		#number of lines of code in the final project version by each team member (similar to one of the views in GIT-Inspector)

*/