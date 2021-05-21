function setURLParams() {
	/*
	Sets the URL parameters. Pass key, value, key, value, etc.
	Ex: setURLParams("userName","John","age",30,"favFruit","apple");
	*/
	var url = new URL(window.location);
	for (var i = 0; i < arguments.length; i+=2) {
		url.searchParams.set(arguments[i], arguments[i+1]);
	}
	window.history.replaceState({},"",url);
	copyText("queryURL",url);
};
function copyText(id,value) {
	/*
	Copies text to clipboard. Pass the id of an input element and clipboard value
	Ex: copyText("myInput","Hello World");
	*/
	var copyTextElement = document.getElementById(id);
	copyTextElement.setAttribute("value",value)
	copyTextElement.setAttribute("style","display:inline;")
	
	copyTextElement.select();
	copyTextElement.setSelectionRange(0, 99999);
	document.execCommand("copy");
	
	copyTextElement.setAttribute("style","display:none;")
}
