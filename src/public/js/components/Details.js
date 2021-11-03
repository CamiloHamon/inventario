import { Titles } from './Titles.js';

export function Details(cambio) {
	const $container = document.createElement('div'),
		$title = Titles('Detalles de la compra', 'h5');
	$container.classList =
		'd-flex flex-column align-items-center border-red my-3 rounded shadow';

	$title.classList = 'my-3';
	$container.appendChild($title);
	$container.innerHTML += `
    <div class="p-2 detailRegister">${points('Total', cambio.total)}</div>
    <div class="p-2 detailRegister">${points('Pago', cambio.bill)}</div>
    <div class="p-2 detailRegister">${points('Cambio', cambio.vueltas)}</div>
    `;

	function points(description, amount) {
		const start = description.length,
			stop = 30 - String(amount).length;
		let result = description + '..................................';

		result = result.slice(0, stop);

		result += `$${price(amount)}`;

		console.log(result.length);
		return result;
	}

	function price(price) {
		return new Intl.NumberFormat('de-DE').format(price);
	}

	return $container;
}
