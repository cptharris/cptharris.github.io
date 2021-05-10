$(document).ready(function(){
	$.each($("include"), function () {
		$(this).load($(this).attr('src'));
	})
});
