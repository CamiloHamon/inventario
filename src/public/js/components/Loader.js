export function Loader() {
	const $loader = document.createElement('img'),
		$div = document.createElement('div');

	$loader.src = '/assets/loader.svg';
	$loader.alt = 'Cargando...';
	$loader.classList.add('loader');

	$div.appendChild($loader);
	$div.setAttribute('id', 'loaderId');

	return $div;
}
