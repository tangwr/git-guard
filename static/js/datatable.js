/*
var github_api = "https://api.github.com/repos";
var author = "/cs2103aug2015-w09-2j"; //"/tungnk1993";
var project = "/main"; //"/scrapy"; 
//var author = "/tungnk1993";
//var project = "/scrapy"; 
var git_repo_type = "/stats";   
var git_option = "/contributors";

var url = github_api + author + project + git_repo_type + git_option;
*/

//cs2103aug2015-w09-2j/main
// /repos/:owner/:repo/commits       /repos/:owner/:repo/stats/contributors (part b)
// https://api.github.com/repos/cs2103aug2015-w09-2j/main/commits?path=.gitignore (d)

//https://api.github.com/repos/tungnk1993/scrapy/contents
//https://api.github.com/repos/tungnk1993/scrapy/commits?path=.gitignore
//search/code


//https://api.github.com/repos/tungnk1993/scrapy/git/trees/master?recursive=1
//https://api.github.com/repos/tungnk1993/scrapy/commits/314db3db

//var option = "/stats/punch_card";
// var option = "/stats/commit_activity";

var user_data_arr = [];

function datatables(url) {

  var option = "/stats/contributors";

  url = url + option;

  var table_columns = 5;
  var total_rows = 0;
  


  

  var table = $('#userTable').DataTable({  
    'columnDefs': [{
       'targets': table_columns-1,
       'searchable': false,
       'orderable': false,
       'className': 'dt-body-center',
       'render': function (data, type, full, meta){
           return '<input type="checkbox" name="id[]" value="' + $('<div/>').text(data).html() + '">';
       }
    }],
    'order': [[0, 'asc']]
  });
  
  table.clear();
    
    // Handle click on "Select all" control
  $('#check-select-all').on('click', function(){
    // Get all rows with search applied
    var rows = table.rows({ 'search': 'applied' }).nodes();
    // Check/uncheck checkboxes for all rows in the table
    $('input[type="checkbox"]', rows).prop('checked', this.checked);

    var row_data = table.rows().data();
    if(user_data_arr.length != total_rows){
      user_data_arr = [];
    }
    if (user_data_arr.length == 0){
      //user_data_arr = row_data;
      for(var i=0; i<row_data.length; i++){
        user_data_arr.push(row_data[i]);
        //console.log(row_data[i]);
      }
      //console.log(row_data.length);
    }
    else{
      user_data_arr = [];
    }
    //console.log(user_data_arr);
  });
      
  $('#userTable tbody').on( 'click', 'input', function () {
      var row_data = table.row( $(this).parents('tr') ).data();

      if($('#check-select-all').is(':checked')){
        $('#check-select-all').prop('checked', this.checked);
      }
      if(user_data_arr.length != 0){
        //if($.inArray(row_data, user_data_arr) > -1){
        
        if($.inArray(row_data, user_data_arr) < 0){         
          user_data_arr.push(row_data);
        }else{
          var index = user_data_arr.indexOf(row_data);
          user_data_arr.splice(index, 1);
        }
      }
      else{
        user_data_arr.push(row_data);
      }
      //console.log(user_data_arr);
    });


    

  //console.log(url);

  $.getJSON(url, function (jsonData) {
    $.each(jsonData, function(index, jsonObj){
      var additons = 0, deletions = 0, commits = 0;
      var rowData = [];

      for(var i=0; i<jsonObj.weeks.length; i++){
        additons += jsonObj.weeks[i].a;
        deletions += jsonObj.weeks[i].d;
        commits += jsonObj.weeks[i].c;
      }

      var author = jsonObj.author.login;
      var avatar_url = jsonObj.author.avatar_url;

      var img = "<img id='" + jsonObj.author.id + "' width='15px' height='15px style='marign: 0 auto' src='" + avatar_url + "'> ";

      

      table.row.add([img + " " + author, additons, deletions, commits]).draw();
      //table.row.add(["author", "additons", "deletions", "commits"]).draw();
      //console.log(index);
      total_rows++;
    });
 
  });
  
}