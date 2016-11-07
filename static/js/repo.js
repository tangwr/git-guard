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
/*
$("#searchBox").val("https://github.com/nusmodifications/nusmods");
$("#all").hide();
$("#divTable").hide();
$("#commitHistory").hide();
$("#tree-container").hide();
$("#br").hide();
*/
/*
//$("#notificationButton").hide();
function encrypt(string){
  var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9+/=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/rn/g,"n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}

  // Define the string
  //var string = 'https://api.github.com/repos/tungnk1993/scrapy/stats/contributors';

  // Encode the String
  var encodedString = Base64.encode(string);
  console.log(encodedString); // Outputs: "SGVsbG8gV29ybGQh"

  return encodedString;
  
}

function decode(encodedString){
  // Decode the String
  var decodedString = Base64.decode(encodedString);
  console.log(decodedString); // Outputs: "Hello World!"

  return decodedString;

}
*/

function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

var crypt = getUrlVars()["repo"];
console.log(crypt);

repoLink(crypt);

//cs2103aug2015-w09-2j/main
function repoLink(crypt){



  d3.selectAll("svg").remove();
  $("#divTable").show();
  $("#all").show();
  $("#notificationButton").show();
  $("#tree-container").show();
  $("#br").show();
  

  var user_project = decrypt(crypt);
  console.log(user_project);

  //var crpyt = encrypt(link); 
  /*
  $.post( "/search", {
      javascript_data: link + "?twr?" + crpyt
  });
  */
  var jj ='{"name": "tangwr/pig(master)","children": [{"name": "dog","children": [{"name": "cat.txt"}]}]}';
  
  var jj = '{"name": "tangwr/pig(master)","children": [{"name": "dog","children": [{"name": "cat.txt"}]},{"name": "test1","children" : [{"name" : "test1.txt"},{"name" : "test2","children" : [{"name" : "test2.txt"}]}]},{"name": "README.md"},{"name": "test.txt"}]}';

   $.post( "/treeJson", {
      javascript_data: jj
  });

  //$("#notifyRepo").val(link);
  /*

  if(link.indexOf(github_url) == 0){
    user_project = link.split(".com/")[1];
    
  }else{
    user_project = link;
  }
  */
  user_project = user_project.slice(0,-1);
  console.log(user_project);
  console.log(user_project.length);
  url = github_api + user_project;// + git_repo_type + git_option;
  console.log(url);
 
  datatables(url);
  
  getHeatMap(url);
  getBarChart(url);
	getTree();
 



}

$("#getButton").click(function(){
  d3.selectAll("svg").remove();
  $("#commitHistory").show();
  getMultiLineGraph(url);
  
  
  getHeatMap(url);
  getBarChart(url);
  getTree();
});




/*
/repos/:owner/:repo/contributors		#list of contributors only
/repos/:owner/:repo/stats/contributors		#addition, deletetion, commit of each contributors
		#commit history
		#commit history of a specific file option to slect a code chunk(specific line numbers) and show the history of edits on those lines
		#number of lines of code in the final project version by each team member (similar to one of the views in GIT-Inspector)

*/