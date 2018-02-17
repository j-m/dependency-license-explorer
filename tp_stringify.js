var thirdPartyJSON;
/*
thirdPartyJSON is a global variable modified by the functions in this script.
call textArray on a text file, such as:
textArray("THIRD-PARTY.txt");
to modify the thirdPartyJSON into a string list of objects containing "Lincence", "Dependency name" & "GAV".

*/

function textArray (url){
	var xmlhttp = new XMLHttpRequest();
	//var url = "THIRD-PARTY.txt";
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			//read txt file using xmlhttp.
			var txt = this.responseText; //string of file content.
			var arr = txt.split(/\r?\n/); //split at newlines using regex.
			arr = arr.filter((line)=>line.length>0); //Delete empty elements/ blank lines.

			var info = arr[0]; //text files begin with a heare line.
			var licences = /(\d+)/.exec(info)[0]; //int number of the amount of licenses, might be useful.
			console.log('Third-party dependencies found: ',licences);
			//console.log(info);
			arr.shift();
			LNVJSON(arr);
			//intoHTML(arr);
	} 
};
xmlhttp.open("GET", url, true);
xmlhttp.send();
}

function intoHTML(arr) {
	document.getElementById("id01").innerHTML = arr;
}
function LNVJSON (array) {
	//Get an array and turn it into licence, name, version JSON.
	var dependencies = []
	for (var i = 0; i < array.length; i++){
		var obj = {};
		var s = array[i];
		var lic = s.split(/[()]/)[1];
		var name = s.split(/[()]/)[2].trim();
		var GAV = s.split(/[()]/)[3];

		obj["License"] = lic;
		obj["Dependency name"] = name;
		obj["GAV"] = GAV;
		dependencies.push(obj);
		//console.log(obj);

	}
	thirdPartyJSON = JSON.stringify(dependencies);
	console.log(thirdPartyJSON);
	//intoHTML(JSON.stringify(dependencies)); 
}


