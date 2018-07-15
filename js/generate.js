var projects = [],
	conditions = {
		noneLoaded: 0,
		dependenciesLoadedParsedAndWaiting: 1,
		treeLoadedAndWaiting: 2,
		bothParsedNowGenerating: 3,
		generated: 4
	};
function log(project, message){
	projects[project].log.push(message);
	console.log(project, message);
}

function setCondition(project, condition){
	projects[project].condition = condition;
	if (condition == conditions.generated && project == "examples/mavenProjectB/")
			document.getElementById('root').innerHTML = projects[project].generated;
}

function createDependency(dependency) {
	var generated = '<label class="dependency">\n';
	if (dependency.children.length > 0) generated += '\t<input type="radio" name="tier' + dependency.index.length + '"/>\n';
	generated += '\t<div class="item">\n\t\t<div class="icons">\n';
	if (dependency.warnings > 0) generated += '\t\t\t<div class="warnings">' + dependency.warnings + '</div>\n';
	if (dependency.conflicts > 0) generated += '\t\t\t<div class="conflicts">' + dependency.conflicts + '</div>\n';
	generated += '\t</div>\n\t\t<div class="content ' + dependency.flag + '">\n';
	generated += '\t\t\t<p>' + dependency.name + '</p>\n';
	generated += '\t\t\t<a href="#" onclick="show([' + dependency.index + '])">More info...</a>\n';
	generated += '\t\t</div>\n\t</div>\n';
	if (dependency.children.length > 0) {
		generated += '\t<div class="dependencies">\n';
		for (var index = 0; index < dependency.children.length; index++)
			generated += createDependency(dependency.children[index]);
		generated += '\t</div>\n';
	}
	generated += '</label>\n';
	return generated;
}

function whitelisted(info, GAV) {
	for (var index = 0; index < whitelist.length; index++)
		if ((new RegExp(whitelist[index])).test(info.license) || (new RegExp(whitelist[index])).test(info.GAV) || (new RegExp(whitelist[index])).test(info.name) || (new RegExp(whitelist[index])).test(GAV))
			return true;
}

function blacklisted(info, GAV) {
	for (var index = 0; index < blacklist.length; index++)
		if ((new RegExp(blacklist[index])).test(info.license) || (new RegExp(blacklist[index])).test(info.GAV) || (new RegExp(blacklist[index])).test(info.name) || (new RegExp(blacklist[index])).test(GAV))
			return true;
}

function processTree(project) {
	var lines = projects[project]["tree.txt"].split('\n').filter(line => line.length > 0);
	var indexes = [],
		prevDepth = 0;
	for (var lineIndex = 0; lineIndex < lines.length; lineIndex++) {
		var depth = (/[^\w]*/.exec(lines[lineIndex])[0].length) / 3,
			GAV = /[^:]*:[^:]*/.exec(lines[lineIndex].replace(/[^\w]*/.exec(lines[lineIndex])[0], ''))[0],
			info = -1,
			flag = "";

		for (var index = 0; index < projects[project].dependencies.length; index++)
			if (projects[project].dependencies[index].GAV == GAV)
				info = projects[project].dependencies[index];

		if (info == -1) flag = "missing";
		if (whitelisted(info, GAV)) flag = "";
		if (blacklisted(info, GAV)) flag = "conflict";

		var currentItem = projects[project].tree;
		for (var index = 0; index < indexes.length - 1; index++) {
			if (flag == "missing") currentItem["warnings"]++;
			if (flag == "conflict") currentItem["conflicts"]++;
			currentItem = currentItem.children[indexes[index]];
		}
		if (flag == "missing") currentItem["warnings"]++;
		if (flag == "conflict") currentItem["conflicts"]++;
		if (currentItem.children) 
			currentItem.children.push({
				warnings: 0,
				conflicts: 0,
				flag: flag,
				license: info.license,
				name: info.name || GAV,
				GAV: info.GAV,
				index: indexes.slice(),
				children: []
			});
		else projects[project].tree = {
			warnings: 0,
			conflicts: 0,
			flag: flag,
			license: info.license,
			name: info.name,
			GAV: info.GAV,
			depth: depth,
			children: []
		};

		for (var popNamount = 0; popNamount < prevDepth - depth; popNamount++)
			indexes.pop();
		indexes[depth]++;
		if (!indexes[depth]) indexes[depth] = 0;

		prevDepth = depth;
	}
	console.log("INFO: JSON data");
	console.log(projects[project].tree);
	setCondition(project, conditions.bothParsedNowGenerating);
	projects[project].generated = createDependency(projects[project].tree.children[0]);
	setCondition(project, conditions.generated);
}

function process3rdParty(project) {
	console.log("Processing", project+"THIRD-PARTY.txt");
	var lines = projects[project]["THIRD-PARTY.txt"].split('\n');
	for (var index = 0; index < lines.length; index++) {
		var components = lines[index].split(/[()]/),
			GAV = components[components.length - 2];
		if (GAV) GAV = /[^:]*:[^:]*/.exec(GAV.replace(/[^\w]*/.exec(GAV)[0], ''))[0];
		if (components.length < 5) {
			log(project, "WARN: Line " + index + " has fewer than 3 components: " + lines[index]);
			continue;
		}
		var calculatedName = components[2];
		if (components.length > 5) {
			for (var componentIndex = 3; componentIndex < components.length - 3; componentIndex++)
				calculatedName += "(" + components[componentIndex] + ")";
			log(project, "WARN: Line " + index + " has more than 3 components but was added with the assumed name of: " + calculatedName.trim());
		}
		projects[project].dependencies.push({
			license: components[1],
			name: calculatedName.trim(),
			GAV: GAV
		});
	}
	console.log("INFO: Module dependency information");
	console.log(projects[project].dependencies);
	if (projects[project].condition == conditions.treeLoadedAndWaiting)
		processTree(project);
	setCondition(project, conditions.dependenciesLoadedParsedAndWaiting);
}

function readFiles(){
	var raw = document.getElementById('select-files').files;
	console.log("Raw input:");
	console.log(raw);
	var reading = 0;
	for (var index = 0; index < raw.length; index++) {
		if (raw[index].name == "THIRD-PARTY.txt" || raw[index].name == "tree.txt"){
			reading++;
			var reader = new FileReader();
			reader.name = raw[index].name;
			reader.path = raw[index].webkitRelativePath.replace(reader.name,'');
			reader.onload = function (event) {
				if (!projects[this.path])
					projects[this.path] = {condition: conditions.noneLoaded, dependencies: [], tree: {}, generated: "", log: []};
				projects[this.path][this.name] = event.currentTarget.result;
				if (this.name == "THIRD-PARTY.txt")
					process3rdParty(this.path);
				else if (this.name == "tree.txt")
					if (projects[this.path].condition == conditions.dependenciesLoadedParsedAndWaiting)
						processTree(this.path);
					else
						setCondition(this.path, conditions.treeLoadedAndWaiting);
			};
			reader.readAsText(raw[index]);
		}
	}
}
document.getElementById('select-files').onchange = function() {
	document.getElementById('select-files').style.visibility = "hidden";
	document.getElementById('root').innerHTML = "";
	document.getElementById('change').disabled = false;
	readFiles();
};