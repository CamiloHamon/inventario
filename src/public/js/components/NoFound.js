export function NoFound(type) {
	const d = document;
	const $div = d.createElement('div'),
		$span = d.createElement('span'),
		$divTable = d.getElementById('divTable');

	$divTable.classList.remove('overflow');

	$div.classList.add(
		'text-center',
		'rounded',
		'py-2',
		'noFound',
		'border-down-red',
		'border-right-red'
	);
	if (type) {
		$span.textContent = `${type} no encontrado...`;
	} else $span.textContent = 'Producto no encontrado...';

	$div.appendChild($span);
	return $div;
}
