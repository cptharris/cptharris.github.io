$(document).ready(function(){
	$.each($("include"), function () {
		$(this).load('includes/' + $(this).attr('src'));
	})
	
	// jQuery Scroll Addon
	// https://gist.github.com/iamravenous/f06b341dbb8b0839a7b0
	if ($(window.location.hash).length) {
		$('html, body').animate({
			scrollTop: $(window.location.hash).offset().top - 100
		}, 1, 'swing');
	}
});
