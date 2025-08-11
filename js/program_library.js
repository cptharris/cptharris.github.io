if (window.jQuery) { // for pages where jQuery is not loaded, but other functions are necessary
	$(document).ready(function () {
		$("#progCanvas").mouseenter(function () {
			$("include[src='headermenu.html'],include[src='footermenu.html']").hide("slow");
		});
		$("#progCanvas").mouseleave(function () {
			$("include[src='headermenu.html'],include[src='footermenu.html']").show("slow");
		});
	});
}

var setURLParams = function () {
	/*
	Sets the URL parameters. Pass key, value, key, value, etc.
	Ex: setURLParams("userName","John","age",30,"favFruit","apple");
	*/
	var url = new URL(window.location);
	for (var i = 0; i < arguments.length; i += 2) {
		url.searchParams.set(arguments[i], arguments[i + 1]);
	}
	window.history.replaceState({}, "", url);
	copyText("queryURL", url);
};

var copyText = function (id, value) {
	/*
	Copies text to clipboard. Pass the id of an input element and clipboard value
	Ex: copyText("myInput","Hello World");
	*/
	var copyTextElement = document.getElementById(id);

	copyTextElement.setAttribute("value", value)
	copyTextElement.setAttribute("style", "display:inline;")

	copyTextElement.select();
	copyTextElement.setSelectionRange(0, 99999);
	document.execCommand("copy");

	copyTextElement.setAttribute("style", "display:none;")
}

var fastAES = function (entry, password, method = 1) {
	/**
	 * @desc Uses CryptoJS AES function (defined at js/aes.js) to encrypt/decrypt a string
	 * @param {string} entry plain text OR encrypted plain text
	 * @param {string} password encryption/decryption password.
	 * @param {number} [method] encryption (1) OR decryption (0)
	 * @return {string} encrypted or decrypted value
	 */
	if (!(entry) || !(password)) {
		return;
	}
	if (method) {
		return CryptoJS.AES.encrypt(entry, password, "{ mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }") + "";
	} else if (!(method)) {
		return CryptoJS.AES.decrypt(entry, password, "{ mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }").toString(CryptoJS.enc.Utf8);
	} else {
		return;
	}
};

var fastHash = function (str, seed = 0) { // returns the hash of the hashes of the halves of the string
	return cyrb53(cyrb53(str.substring(0, str.length / 2), seed) + cyrb53(str.substring(str.length / 2), seed));
};

var cyrb53 = function (str, seed = 0) { // https://stackoverflow.com/a/52171480
	var h1 = 0xdeadbeef ^ seed,
		h2 = 0x41c6ce57 ^ seed;
	for (var i = 0, ch; i < str.length; i++) {
		ch = str.charCodeAt(i);
		h1 = Math.imul(h1 ^ ch, 2654435761);
		h2 = Math.imul(h2 ^ ch, 1597334677);
	}
	h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
	h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
	return (h2 >>> 0).toString(16).padStart(8, 0) + (h1 >>> 0).toString(16).padStart(8, 0);
};

var sleepJSCustom = function (milliseconds) {
	var date = Date.now();
	var currentDate = null;
	while (currentDate - date < milliseconds) {
		currentDate = Date.now();
	}
};

var validURL = function (url) {
	console.groupCollapsed("URL Test");
	console.count("Test #")
	console.log("Testing: '" + url + "'");
	try {
		var testURL = new URL(url);
	} catch (e) {
		console.log("FAIL");
		console.error(e.name, "\n", e.message);
		console.groupEnd("URL Test");
		return 0;
	}
	console.log("PASS");
	console.groupEnd("URL Test");
	return 1;
};
