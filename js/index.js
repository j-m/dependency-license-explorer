function show(ignore){
	alert(ignore);
}
function showProject(project){
	document.getElementById('projects').style.visibility = "hidden";
	document.getElementById('root').innerHTML = projects[project].generated;
	document.getElementById('root').style.visibility = "visible";
}
document.getElementById('select-files').onchange = function() {
	document.getElementById('upload-form').style.visibility = "hidden";
	document.getElementById('download').style.visibility = "visible";
	document.getElementById('projects').style.visibility = "visible";
	document.getElementById('root').innerHTML = "";
	document.getElementById('view-projects').disabled = false;
	document.getElementById('change-projects').disabled = false;
	readFiles(document.getElementById('select-files').files);
}
document.getElementById('view-projects').onclick = function(){
	document.getElementById('root').style.visibility = "hidden";
	document.getElementById('upload-form').style.visibility = "hidden";
	document.getElementById('projects').style.visibility = "visible";
}
document.getElementById('change-projects').onclick = function(){
	document.getElementById('root').style.visibility = "hidden";
	document.getElementById('download').style.visibility = "hidden";
	document.getElementById('upload-form').style.visibility = "visible";
	document.getElementById('projects').style.visibility = "hidden";
}