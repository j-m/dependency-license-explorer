//Create nested objects for processing dir structure.
//WOULDN'T ALLOW JSON.strigify because the object was a circular structure.
var dir_ON; //global variable which nested JSON will be assigned to.
var dir_objs;

function read_txt(url){
	var xmlhttp = new XMLHttpRequest();
	//var url = "THIRD-PARTY.txt";
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			//read txt file using xmlhttp.
			var txt = this.responseText; //string of file content.
			var artefacts = txt.split(/\r?\n/); //split at newlines using regex.
			artefacts = artefacts.filter((line)=>line.length>0); //Delete empty elements/ blank lines.

			var root = artefacts[0]; //text files begin with a heare line.
			console.log(root);
			console.log("Total artefacts: ", artefacts.length)
			var obj_root = {GAV: root, children: [], parent: NaN, depth: 0};
			dir_objs = [obj_root];
			objectify_artefacts(artefacts);

	} 
};
xmlhttp.open("GET", url, true);
xmlhttp.send();
}


function objectify_artefacts(artefacts){
	//This Function will only work for 2 layers in a tree.
	var dir_depth = 0; //root depth.
	var dir = dir_objs[0] //current dir is root.
	var par = NaN; //root has no parent.
	for (var i = 1; i < artefacts.length; ++i){
		var depth = (/[^\w]*/.exec(artefacts[i])[0].length)/3;
		var cut = /[^\w]*/.exec(artefacts[i])[0];
		var vGAV = artefacts[i].replace(cut,'');
		var GAV = /[^:]*:[^:]*/.exec(vGAV);
		if (depth == 1) {
			dir_depth = 1;
			var new_artefact = {GAV: GAV, children: [], parent: dir_objs[0], depth: 1};
			dir_objs[0].children.push(new_artefact);
			var last_dir = dir_objs[0].children.length-1;
			dir = dir_objs[0].children[last_dir]; //iterating so current directory is the last one.
		} else if (depth > 1 && depth > dir_depth){
			//deeper - will only ever go one deeper.
			dir_depth = depth;
			var new_artefact = {GAV: GAV, children: [], parent: dir, depth: dir_depth};
			dir.children.push(new_artefact);
			var last_dir = dir.children.length-1;
			dir = dir.children[last_dir];
			
		} else if (depth > 1 && depth < dir_depth){
			//shallower
			var back = dir_depth - depth;
			dir_depth = depth;
			while (back > 0){
				dir = dir.parent;
				--back;
			}
			var new_artefact = {GAV: GAV, children: [], parent: dir.parent, depth: dir_depth};
			dir.parent.children.push(new_artefact);
			var last_dir = dir.children.length-1;
			dir = dir.children[last_dir];
			
		}
	}
	
	dir_ON = dir_objs[0];
}


read_txt("../projects/Project-A/tree.txt");