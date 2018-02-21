var dependencies = [], tree = {}, indexList = [];
function findInTree(){
	
}
function createDependency(dependency){
	var generated =
	`<label class="dependency">
		<input type="radio" name="tier${depth}"/>
		<div class="item">
			<div class="icons">
				<div class="warnings">${warnings}</div>
				<div class="conflicts">${conflicts}</div>
			</div>
			<div class="content ${flag}">
				<p>${name}</p>
				<a href="#" onclick="show(${indexes})">More info...</a>
			</div>
		</div>
		<div class="dependencies">`;
	for()
		generated+=createDependency();
	return generated+=`</div></label>`;
}
function generate(combine){
	var dependencies = "";
	var generated = (combine)?allinone(dependencies):separate(dependencies);
	download(generated, 'generated.html','html');
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
function safeLicense(){
	return true;
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
			info = -1;
		
		for(var index = 0; index < dependencies.length; index++)
			if(dependencies[index].GAV == GAV)
				info = dependencies[index];
		
		var currentItem = tree;
		for(var index = 0; index < indexes.length-1; index++){
			if (info == -1)
				currentItem["warnings"]++; 
			currentItem = currentItem.children[indexes[index]];
		}
		
		flag = 0;
		if(info == -1) flag = 1;
		if(!safeLicense) flag = 2;
		
		currentItem.children.push({warnings: 0, conflicts:0, flag:flag, info:info, indexes: indexes, children:[]});
		
		for(var popNamount = 0; popNamount < prevDepth-depth; popNamount++)
			indexes.pop();
		indexes[depth]++;
		if(!indexes[depth]) indexes[depth] = 0;
		prevDepth = depth;
	}
	console.log(tree);
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
function process(files,combine){
	for(var index = 0; index < files.length; index++){
		if(files[index].name == "THIRD-PARTY.txt")
			process3rdParty(files[index]);
		if(files[index].name == "tree.txt")
			processTree(files[index]);
		generate(combine);
	}
}
function read(e){
	e.preventDefault();
	if(document.getElementById('files').files.length > 2)
		return;
	var files = [],
		group =  document.getElementById('files').files,
		combine = document.getElementById('combined').checked;
	document.getElementsByTagName('body')[0].innerHTML = "";
	for(var index = 0; index < group.length; index++){
		var reader = new FileReader();
		reader.name = group[index].name; /*Hackish but works*/
		reader.onload = function(e2) {
			files.push({name:this.name,content:e2.currentTarget.result});
			if(files.length >= 2)
				process(files,combine);
		};
		reader.readAsText(group[index]);
	}
}
document.getElementsByTagName('form')[0].addEventListener('submit',read,false);