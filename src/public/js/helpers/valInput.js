import { Alert } from '../components/Alert.js';
import { Icon } from '../components/Icons.js';

export function valInput(total, productsMenu) {
	const d = document,
		$register = d.getElementById('register'),
		text = $register.value,
		multiply = text.indexOf('*');

	const exR = /^([1-9])(([0-9]){1,2})?([*]([1-9])([0-9]{1,2})?)?$/;
	const $currentAlerts = d.querySelectorAll('.alertCaja');

	let cod = -1,
		count = false,
		producto = '',
		$alert = '';

	const billete = d.querySelector('.divBillete').querySelector('svg');
	if (billete) billete.remove();

	if (exR.test(text) || valTotal(text, total)) {
		if (multiply !== -1) {
			if (total > 0) count = true;
			cod = parseInt(text.substring(0, multiply));

			if (exR.test(text)) producto = findProduct(cod, productsMenu);
			else if (erase(text, multiply)) {
				$register.value = $register.value.substring(0, multiply + 1);
			}
		} else cod = parseInt(text.substring(0, text.length));

		producto = findProduct(cod, productsMenu);

		if (!producto) {
			//const currentAlert = d.querySelector('.alertCaja');
			//if (currentAlert) currentAlert.remove();
			const $alerts = d.querySelector('.alerts');
			$alert = Alert(
				'warning',
				`Producto: ${cod} no encontrado`,
				'Intente nuevamente'
			);
			if (!count) {
				// si no tiene asterisco
				if (!valTotal(text, total)) {
					updateAlerts($currentAlerts, $alert, $alerts);

					$register.value = '';
				} else {
					const cambio = Number(text);
					if (!isNaN(cambio) && cambio > 999) {
						d.querySelector('.divBillete').appendChild(
							Icon('fas fa-money-bill billete')
						);
					}
				}
			} else if (erase(text, multiply)) {
				updateAlerts($currentAlerts, $alert, $alerts);
				$register.value = $register.value.substring(0, multiply);
			}
		}
	} else {
		if (!$register.value) {
			removeAlerts($currentAlerts);
		}
		if (multiply !== -1) {
			const number = parseInt(text.substring(0, multiply));
			if (number > 999) {
				$register.value = $register.value.substring(0, multiply);
			} else if (erase(text, multiply)) {
				$register.value = $register.value.substring(0, multiply);
			}
		} else $register.value = '';
	}
}

function updateAlerts($currentAlerts, $alert, $alerts) {
	if ($currentAlerts.length < 1) {
		document
			.getElementById('logoCaja')
			.querySelector('img')
			.classList.add('d-none');
		$alerts.appendChild($alert);
	} else $alerts.replaceChild($alert, $alerts.firstElementChild);
}

function removeAlerts($currentAlerts) {
	if ($currentAlerts.length > 0) {
		document
			.getElementById('logoCaja')
			.querySelector('img')
			.classList.remove('d-none');
		$currentAlerts[0].remove();
	}
}

function valTotal(text, total) {
	const exRTotal = /^([1-9])(([0-9]){1,5})?$/;
	return exRTotal.test(text) && total > 0 ? true : false;
}

function findProduct(cod, productsMenu) {
	let product;
	for (let i = 0; i < productsMenu.length; i++) {
		if (productsMenu[i].idProduct === cod) {
			//isProduct = true;
			product = productsMenu[i];
			//listProducts.push(product);
			//total += total + 1;
			break;
		}
	}
	return product;
}

function erase(text, multiply) {
	let erase = true;
	if (text.charAt(text.length - 1) === '*') {
		const repeat = text.split('*').length - 1;
		if (repeat === 1 && multiply !== 0) erase = false;
	}

	return erase;
}

/*export function valInput($register, $multiply, listProdcts) {
	const d = document;
	const text = $register.value,
		multiply = text.indexOf('*');

	if (expReg(text)) {
		let cod = -1,
			isProduct = false;

		$multiply.removeAttribute('disabled');

		if (multiply !== -1) {
			$multiply.setAttribute('disabled', 'true');
			cod = parseInt(text.substring(0, multiply));
		} else cod = parseInt(text.substring(0, text.length));

		let product = '';

		if (!isNaN(cod)) {
			for (let i = 0; i < listProdcts.length; i++) {
				if (listProdcts[i].idProduct === cod) {
					isProduct = true;
					product = listProdcts[i];
					break;
				}
			}
		}

		const $alerts = d.querySelector('.alerts');

		if (!isProduct) {
			$alerts.innerHTML = '';
			if (!isNaN(cod)) {
				const alert = 'No existe el producto: ';
				$alerts.appendChild(Alert('warning', 'Cuidado', alert, cod));
				$register.value = '';
			}
		} else $alerts.innerHTML = '';
	} else {
		let erase = true;
		if (text.charAt(text.length - 1) === '*') {
			const repeat = text.split('*').length - 1;
			if (repeat > 1) erase = true;
			else erase = false;
			if (multiply === 0) erase = true;
		}
		if (erase) $register.value = $register.value.substring(0, text.length - 1);
	}
}*/
