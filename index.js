(function (){
	var items = document.getElementsByClassName("dependencies");
	for(var index = 1; index < items.length; index++){
		var difference = items[index].parentElement.parentElement.offsetWidth - items[index].offsetWidth
		if(difference > 0){
			console.log(document.getElementsByClassName("dependencies")[index].previousSibling.innerHTML);
		}
	}
})();