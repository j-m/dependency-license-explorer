var dependencies = [], tree = {info: {}, children: []}, indexList = [];
function createDependency(depth,){
return
`<label class="dependency">
	<input type="radio" name="tier$(depth)"/>
	<div class="item">
		<div class="icons">
			<div class="warnings">1</div>
			<div class="conflicts">1</div>
		</div>
		<div class="content">
			<p>Root</p>
			<a href="#" onclick="show([0,0])">More info...</a>
		</div>
	</div>
	<div class="dependencies">
	</div>
</label>`
}
function generate(){
	var data =
`<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8">
		<meta name="description" content="Dependency License Explorer">
		<meta name="keywords" content="HTML,CSS,JavaScript,License,Dependency">
		<meta name="author" content="Jonathan Marsh, Charlie Parker">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>Dependency License Explorer</title>
		<link rel="stylesheet" type="text/css" href="common/index.css"/>
		<link rel="stylesheet" type="text/css" href="common/tree.css"/>
	</head>
	<body>
		<div class="overlay">
			<div class="popup">
				<label>Module name:</label>
				<input type="text" placeholder="Name"/>
				<label>Module package:</label>
				<input type="text" placeholder="Package"/>
				<label>Module license:</label>
				<input type="text" placeholder="License"/>	
			</div>
		</div>
		<div class="dependencies">

		</div>
		<script type="text/javascript" src="common/index.js"></script>
	</body>
</html>`	
	download(data, 'generated.html','html');
}
function download(data, filename, type) {
    var file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}
function addChild(indexes, info){
	var currentItem = tree;
	for(var index = 0; index < indexes.length-1; index++)
		currentItem = currentItem.children[indexes[index]];
	currentItem.children.push({info:info, children:[]});
}
function processTree(file){
	var lines = file.content.split('\n'),
		lines = lines.filter((line)=>line.length>0);
	var indexes = [], prevDepth = 0;
	for(var index = 0; index < lines.length; index++){
		var depth = (/[^\w]*/.exec(lines[index])[0].length)/3,
			cut = /[^\w]*/.exec(lines[index])[0],
			vGAV = lines[index].replace(cut,''),
			GAV = /[^:]*:[^:]*/.exec(vGAV),
			info = findDependency(GAV);
		addChild(indexes, info);
		for(var popNamount = 0; popNamount < prevDepth-depth; popNamount++)
			indexes.pop();
		indexes[depth]++;
		if(!indexes[depth]) indexes[depth] = 0;
		prevDepth = depth;
	}
	console.log(tree);
}
function findDependency(GAV){
	for(var index = 0; index < dependencies.length; index++)
		if(dependencies[index].GAV == GAV)
			return dependencies[index];
	return -1;
}
function process3rdParty(file){
	var lines = file.content.split('\n');
	for(var index = 0; index < lines.length; index++){
		var components = lines[index].split(/[()]/);
		if(components.length == 5)
			dependencies.push({license: components[1], name:components[2].trim(), GAV:components[3] });
		if(components.length < 5)
			console.log("WARN: Line", index, "has fewer than 3 components:", lines[index])
		if(components.length > 5){
			var calculatedName = components[2];
			for(var componentIndex = 3; componentIndex < components.length - 3; componentIndex++)
				calculatedName += "("+components[componentIndex]+")";
			console.log("WARN: Line", index, "has more than 3 components but was added with the assumed name of:", calculatedName.trim());
			dependencies.push({license: components[1], name:calculatedName.trim(), GAV:components[components.length-2] });
		}
	}
	console.log(dependencies);	
}
function process(files){
	for(var index = 0; index < files.length; index++){
		if(files[index].name == "THIRD-PARTY.txt")
			process3rdParty(files[index]);
		if(files[index].name == "tree.txt")
			processTree(files[index]);
		generate();
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