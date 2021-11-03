ubication();

function ubication() {
	const location = window.location.pathname.split('/')[1];

	if (location === 'cuenta' || location === 'clientes') return;

	const $url = document.getElementById(location);

	if ($url) $url.className += ' active';
}

const d = document,
	$openNav = d.getElementById('openNav'),
	$openNav2 = d.getElementById('openNav2'),
	$closeNav = d.getElementById('closeNav');

if ($openNav && $openNav2 && $closeNav) {
	$openNav.addEventListener('click', fOpenNav);
	$openNav2.addEventListener('click', fOpenNav);
	$closeNav.addEventListener('click', fCloseNav);
}

function fOpenNav() {
	document.getElementById('mNav').style.width = '100%';
	document.getElementsByTagName('html')[0].style.overflow = 'hidden';
}

function fCloseNav(e) {
	e.preventDefault();
	document.getElementById('mNav').style.width = '0%';
	document.getElementsByTagName('html')[0].style.overflow = 'auto';
}
