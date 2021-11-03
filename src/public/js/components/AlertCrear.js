export function Alert(type, message1, nameProduct) {
	const d = document;

	const $div = d.createElement('div');
	$div.classList = `alert alert-${type} alert-dismissible fade show pr-5 py-3 alertCaja`;
	$div.setAttribute('role', 'alert');

	$div.innerHTML = `<span><strong>¡${message1}!</strong> El producto con nombre <strong>${nameProduct}</strong> ya existe</span>`;

	const $button = d.createElement('button');
	$button.classList = 'close btn-close';
	$button.setAttribute('type', 'button');
	$button.setAttribute('data-dismiss', 'alert');
	$button.setAttribute('aria-label', 'Close');
	$button.innerHTML = '&times;';

	$div.appendChild($button);

	return $div;
}
