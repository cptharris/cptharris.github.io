function listEntries(input) {
	/*
	Loads blog posts from a google spreadsheet to display on the main page and the blog archive page.
	https://developers.google.com/gdata/docs/json#json-in-script-output
	https://developers.google.com/gdata/samples/spreadsheet_sample	
	*/
	
	var entries = input.feed.entry; // get the GS feed
	var html = [""]; // start the html addon array
	var patt = /\d/; // for some reason, don't use /\d*/ here
	
	for (var i = 0; i < entries.length; i+=2) { // cycle through the entries, evens are titles, odds are text
		var entry_title = entries[i]; // title
		var entry_text = entries[i+1]; // text
		
		if (patt.test(entry_title.content.$t)) { // title must have numbers to appear
			if (window.location.pathname == "/") { // on the main page, show only the last entry
				// set the array to the text content, to get the last entry
				html = ['<p>', entry_text.content.$t, '</p>']
			} else { // on the blog page, add each entry to the array
				// last entry is the most recent, so add to the start of the array to display correctly
				html.unshift('<p>', entry_text.content.$t, '</p>'); // add text to start of array
				html.unshift('<h2 class="tc_letter_header">', entry_title.content.$t, '</h2>'); //add title to start of array
			}
		}
	}
	
	document.getElementById("letters").innerHTML = html.join(""); // add to the document
}
