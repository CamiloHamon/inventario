export function Alert(type, message1, message2, cod) {
	const d = document;

	const $div = d.createElement('div');
	$div.classList = `alert alert-${type} alert-dismissible fade show pr-5 py-3 alertCaja`;
	$div.setAttribute('role', 'alert');

	const $strong = d.createElement('STRONG');
	const $strongText = d.createTextNode(`¡${message1}! `);
	$strong.appendChild($strongText);

	const $span = d.createElement('span');
	$span.appendChild($strong);
	$span.appendChild(d.createTextNode(`${message2}`));

	if (!isNaN(cod)) {
		const $strongCod = d.createElement('strong');
		$strongCod.appendChild(d.createTextNode(cod));

		$span.appendChild($strongCod);
	}

	$div.appendChild($span);

	const $button = d.createElement('button');
	$button.classList = 'close btn-close';
	$button.setAttribute('type', 'button');
	$button.setAttribute('data-dismiss', 'alert');
	$button.setAttribute('aria-label', 'Close');
	$button.innerHTML = '&times;';

	$div.appendChild($button);

	return $div;
}
