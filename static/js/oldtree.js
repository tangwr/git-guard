
var url = "https://api.github.com/repos/tangwr/pig/git/trees/master?recursive=1";
var head = "tangwr/pig"
/*
"path": "test1/test2",
"mode": "040000",
"type": "tree",
"sha": "b2abdac384f111c1a8a518e05b963a3bb2541659",
"url": "https://api.github.com/repos/tangwr/pig/git/trees/b2abdac384f111c1a8a518e05b963a3bb2541659"

"path": "test1/test2/test2.txt",
"mode": "100644",
"type": "blob",
"sha": "e69de29bb2d1d6434b8b29ae775ad8c2e48c5391",
"size": 0,
"url": "https://api.github.com/repos/tangwr/pig/git/blobs/e69de29bb2d1d6434b8b29ae775ad8c2e48c5391"
*/
var path = [], mode = [], type = [], sha = [], api_url = []; 

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

  var depth = 0;
  for(var i=0; i<path.length; i++){
    var deep = path[i].split("/").length;
    if (deep > depth){
      depth = deep;
    }
  }

  var fileArr = [], typeArr = [];

  for(var i=0; i<depth; i++){
    fileArr.push([]);
    typeArr.push([]);
  }

  for(var i=0; i<path.length; i++){
    var depth = path[i].split("/").length;
    fileArr[depth-1].push(path[i]);
    typeArr[depth-1].push(type[i]);
  }
  
  var tree_data = {};
  tree_data.name = "tangwr/pig(master)";
  tree_data.children = [];

  for(var i=0; i<fileArr.length; i++){
    console.log(fileArr[i]);
  }

  for(var i=0; i<fileArr[0].length; i++){
    if(typeArr[0][i] == "tree"){
      var len = fileArr[0][i].length;
      
      for(var j=depth-1; j>0; j--){
        //console.log(fileArr[j].length);
        console.log(fileArr[0][i]);
        console.log(fileArr[j]);
        
       
        for(var k=0; k<fileArr[j].length; k++){
          if(fileArr[j][k].indexOf(fileArr[0][i]) > -1){
            console.log(fileArr[j][k]);
            console.log("*********");
          }
        }
         console.log("-------------");
      }
      
      var file = fileArr[0][i].split("/")

      var tree = tree_data;
      //console.log(fileArr[0][i] + " " + len);
      //recursion(len-1, file, tree);

    }else{
      var node = {};
      node.name = fileArr[0][i];
      tree_data.children.push(node);
    }
  }
  
  /*
  function recursion(len, file, tree){
    if(len==0){
      console.log("end");
    }else{
      console.log(len);
      recursion(len-1, file, tree);
    }
  }
  */
  console.log("------------");
  console.log(depth);
  console.log(fileArr);
  console.log(typeArr);

  console.log(path);
  console.log(type);
  //onsole.log(sha);
 

  
    /*
    if(type[i] == "tree"){
      var node = new Object();
      node['name'] = path[i];

    }else{
      
    }


    if(path[i].indexOf('/') > -1){
      console.log(path[i].split("/").length);
      console.log(path[i]);
    }
    */
  

});


// console.log(path[i].split("/").length);
/*
var json_addition_data = []
var json_addition = new Object();
json_addition['week'] = combined_week_data[0][i];
json_addition_data.push(json_addition);
json_addition_data = JSON.parse(JSON.stringify(json_addition_data));
*/
  