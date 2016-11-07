
function getTreeJson(url, user_project){
  var option = "/git/trees/master?recursive=1";
  //d3.selectAll("svg").remove();
  treeJson(url + option, user_project);
}


function treeJson(url, user_project){
	var path = [], mode = [], type = [], sha = [], api_url = []; 

	console.log(url);
	console.log(user_project);

	$.getJSON(url, function (jsonData) {
	  //console.log(jsonData);

	  

	  $.each(jsonData.tree, function(index, jsonObj){
	    //console.log(jsonObj);
	    path.push(jsonObj.path);
	    mode.push(jsonObj.mode);
	    type.push(jsonObj.type);
	    sha.push(jsonObj.sha);
	    api_url.push(jsonObj.url);

	  });

	  var jsonTreeData = filesToJson(path);
	  console.log(jsonTreeData);

	   $.post( "/treeJson", {
	      javascript_data: jsonTreeData
	  	}).done(function() {
		    //alert( "second success" );
		    //tree.js
		    getTree();
		  })
		  .fail(function(response) {
      		//alert(response.responseText);
      		//getTree();
		  })
		  .always(function() {
		    //getTree();
		});
	   
	});
}