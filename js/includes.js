$(document).ready(function () {
	$.each($("include"), function () {
		$(this).load('includes/' + $(this).attr('src'));
	})

	if ($(window.location.hash).length) {
		scrollTo(window.location.hash);
	}
	$(window).on('hashchange', function () {
		scrollTo(window.location.hash);
	});
});

function scrollTo(elem) {
	// jQuery Scroll Addon
	// https://gist.github.com/iamravenous/f06b341dbb8b0839a7b0
	$('html, body').animate({
		scrollTop: $(elem).offset().top * 0.90
	}, 1, 'swing');
}
