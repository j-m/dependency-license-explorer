var dependencies = [];
function processTree(file){
	
}
function process3P(file){
	var lines = file.content.split('\n'),
		lines = lines.filter((line)=>line.length>0);
	for(var index = 1; index < lines.length; index++){
		var obj = {},
			s = lines[index];
		obj.License = s.split(/[()]/)[1];
		obj.Dependency_name = s.split(/[()]/)[2].trim();
		obj.GAV = s.split(/[()]/)[3];
		dependencies.push(obj);
	}
	console.log(dependencies);	
}
function process(files){
	for(var index = 0; index < files.length; index++){
		if(files[index].name == "THIRD-PARTY.txt")
			process3P(files[index]);
		if(files[index].name == "tree.txt")
			processTree(files[index]);
	}
}
function read(e){
	e.preventDefault();
	if(document.getElementById('files').files.length > 2)
		return;
	var files = [],
		group =  document.getElementById('files').files;
	document.getElementsByTagName('body')[0].innerHTML = "";
	for(var index = 0; index < group.length; index++){
		var reader = new FileReader();
		reader.name = group[index].name; /*Hackish but works*/
		reader.onload = function(e2) {
			files.push({name:this.name,content:e2.currentTarget.result});
			if(files.length >= 2)
				process(files);
		};
		reader.readAsText(group[index]);
	}
}
document.getElementsByTagName('form')[0].addEventListener('submit',read,false);