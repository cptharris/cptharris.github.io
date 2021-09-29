function listEntries(input) {
	var rows = input.values;
	var html = [""];
	var patt = /\d/;

	for (var i = 0; i < rows.length; i++) {
		var title = rows[i][0],
			content = rows[i][1];

		if (patt.test(title)) {
			if (window.location.pathname == "/") {
				html = ["<p>", content, "</p>"];
			} else {
				html.unshift("<p>", content, "</p>");
				html.unshift("<h2 class='tc_letter_header'>", title, "</h2>");
			}
		}
	}

	document.querySelector("#letters").innerHTML = html.join("");
}
