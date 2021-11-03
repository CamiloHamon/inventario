import { Titles } from './Titles.js';

export function Cambio(props, emp) {
	console.log(props);

	const $container = document.createElement('div'),
		$title = Titles(`Pago del turno de: ${emp}`, 'h5');
	$container.classList = 'd-flex flex-column align-items-center my-3';

	$title.classList = 'my-3';
	$container.appendChild($title);
	$container.innerHTML += `
    <div class="p-2 detailRegister">${points('Turno', props.amount)}</div>
    <div class="p-2 detailRegister">${points('Vales', props.totalVales)}</div>
    <div class="p-2 detailRegister">${points('Pagar', props.vueltas)}</div>
    `;

	function points(description, amount) {
		const start = description.length,
			stop = 30 - String(amount).length;
		let result = description + '...........................................';

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
