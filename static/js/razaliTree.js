function Queue() {
    this._oldestIndex = 1;
    this._newestIndex = 1;
    this._storage = {};
}
 
Queue.prototype.size = function() {
    return this._newestIndex - this._oldestIndex;
};
 
Queue.prototype.enqueue = function(data) {
    this._storage[this._newestIndex] = data;
    this._newestIndex++;
};
 
Queue.prototype.dequeue = function() {
    var oldestIndex = this._oldestIndex,
        newestIndex = this._newestIndex,
        deletedData;
 
    if (oldestIndex !== newestIndex) {
        deletedData = this._storage[oldestIndex];
        delete this._storage[oldestIndex];
        this._oldestIndex++;
 
        return deletedData;
    }
};

function Node(data) {
    this.data = data;
    this.parent = null;
    this.children = [];
}
function Tree(data) {
    var node = new Node(data);
    this._root = node;
}
Tree.prototype.traverseDF = function(callback) {
 
    // this is a recurse and immediately-invoking function 
    (function recurse(currentNode) {
        // step 2
        for (var i = 0, length = currentNode.children.length; i < length; i++) {
            // step 3
            recurse(currentNode.children[i]);
        }
 
        // step 4
        callback(currentNode);
         
        // step 1
    })(this._root);
 
};

Tree.prototype.traverseBF = function(callback) {
    var queue = new Queue();
     
    queue.enqueue(this._root);
 
    currentTree = queue.dequeue();
 
    while(currentTree){
        for (var i = 0, length = currentTree.children.length; i < length; i++) {
            queue.enqueue(currentTree.children[i]);
        }
 
        callback(currentTree);
        currentTree = queue.dequeue();
    }
};

Tree.prototype.contains = function(callback, traversal) {
    traversal.call(this, callback);
};
Tree.prototype.add = function(data, toData, traversal) {
	
	
	for(var i = 0; i < toData; i++){
			//Check if node exists
			contains = false;
			this.contains(function(node){
				if (node.data === toData[i]) {
					console.log("Found dir:" + toData[i]);
				}
				else{
					this.add(toData[i], toData[i-1])
				}
			}, tree.traverseBF);
	}
	
    var child = new Node(data),
        parent = null,
        callback = function(node) {
            if (node.data === toData[toData.length-1]) {
                parent = node;
            }
        };
 
    this.contains(callback, traversal);
 
    if (parent) {
        parent.children.push(child);
        child.parent = parent;
    } else {
        throw new Error('Cannot add node to a non-existent parent.');
    }
};

function addLevelToString(string){
	array = string.split("/")
	
	for(var i = 0; i < array.length; i++){
		array[i] = array[i]+":"+ i
		if(i != array.length-1)
			array[i] +="/"
	}
	
	string = ""
	for(var i = 0; i < array.length; i++){
		string +=array[i]
	}
	return string
}

function addLevelToArray(array){
	for(var i = 0; i < array.length; i++){
		array[i] = addLevelToString(array[i])
	}
	return array
}

function getLevel(string){
	return string.substring(string.indexOf(":",1)).replace(":","")
}

function removeLevel(string){
	removeThis = string.substring(string.indexOf(":",1))
	return string.replace(removeThis, "")
}

function getNodesFromLevel(level, tree){
	nodes = []
	tree.traverseBF(function(node) {
		l = getLevel(node.data)
		if(l == level)
			nodes.push(node)
	})	
	return nodes
}

function isParentOf(Parent,child){
	if(child.parent==null)
		return false
	if(child.parent.data == Parent.data)
		return true;
	return false
}

function getMaxLevel(tree){
	max = -1
	tree.traverseBF(function(node) {
		l = getLevel(node.data)
		if(l>max)
			max = l
	})	
	return l
}


//Given a parent and its level, i need to find its array IN JSON

function createJsonElement(name, children){
	return {"name":name, "children":children}
}


function getArrayOfNodes(tree){
	array = []
	tree.traverseBF(function(node) {
		if(node.data != "root")
			array.push(node)
	})
	return array
}

function toJson(node, allnodes){
	
	var childrenList = []
	
	var jsonElement = {}
	jsonElement["name"] = node.data
	
	
	for(var i = 0; i < allnodes.length; i++){
		var item = allnodes[i]
		if(isParentOf(node, item) == true){
			allnodes.splice(i, 1)
			childrenList.push(toJson(item, allnodes))
			i=-1
		}
		
	}
	
	jsonElement["children"] = childrenList
	
	return jsonElement
}

function filesToJson(files){
	//var files = ["README.md", "dog", "dog/cat.txt", "test.txt", "test1", "test1/test1.txt","test1/test1", "test1/test2", "test1/test2/test2.txt"];


	var tree = new Tree('root');

	for(var i = 0; i < files.length; i++){
		var paths = files[i].split("/")
		data = ""
		
		if(paths.length == 1){
			data = paths[0]
			paths = ["root"]
		}
		else{
			data = paths[paths.length-1];
			paths = paths.splice(0,paths.length-1) //remove last elementFromPoint
			paths2 = ["root"];
			
			for(var x = 0; x < paths.length; x++){
				paths2.push(paths[x]);
			}
			paths = paths2;
		}
		tree.add(data, paths, tree.traverseBF);
	}



	/* Add Level Info */
	files = addLevelToArray(files)
	maxLevel = getMaxLevel(tree)
	root = {"name":"root", "children":[]}
	var allnodes = getArrayOfNodes(tree);
	json = toJson(tree._root, allnodes)
	return JSON.stringify(json)
	
}
