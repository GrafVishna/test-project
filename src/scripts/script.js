$(document).ready(function () {
	$('.burger').click(function (event) {
		$('.burger, .menu, .menu__links').toggleClass('active');
		$('body').toggleClass('lock');
	});
});