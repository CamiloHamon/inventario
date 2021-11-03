import ajax from '../helpers/ajax.js';
import { Loader } from '../components/Loader.js';
import { filter } from '../helpers/filter.js';
import { valInput } from '../helpers/valInput.js';
import { updateTotal } from '../helpers/updateTotal.js';
import { valInNoEmpty } from '../helpers/valInputsNoEmpty.js';
import { Alert } from '../components/Alert.js';
import { sendOrden } from '../helpers/sendOrden.js';
import { FinallyRegisterObs } from '../components/FinallyRegisterObs.js';
import { disabledButtons } from '../helpers/diableButtons.js';
import { enableButtons } from '../helpers/enableButtons.js';
import { pushListProducts } from '../helpers/pushListProduct.js';
import { getTotal } from '../helpers/total.js';
import { findProduct } from '../helpers/findProduct.js';
import { sliceProducts } from '../helpers/sliceProducts.js';

export async function App() {
	const d = document;
	//const DOM
	const $table = d.getElementById('products-table'),
		$search = d.getElementById('search-products'),
		$register = d.getElementById('register'),
		$divImgCaja = d.getElementById('logoCaja'),
		$total = d.getElementById('total'),
		$caja = d.getElementById('cajaRegistradora'),
		$colum3 = d.getElementById('column-3'),
		$contCaja = d.getElementById('container-caja'),
		$divCheckObs = d.getElementById('divCheckObs'),
		$divCheckFiado = d.getElementById('divCheckFiado');

	//request cash in a box

	const $btnSendCash = d.getElementById('send-cash');
	ajax.checkCashBox({
		URL: '/check-cash-box',
		CBSUCCESS: (response) => {
			if(response.data){
				$('#modal-box').modal('show');
			}else{
				d.getElementById('modal-box').remove();
			}
		}
	});
	
	$btnSendCash.addEventListener('submit', (e)=>{
		e.preventDefault();
		const $priceCashBox = d.getElementById('input-cash');
		if($priceCashBox.value > 49){
			ajax.saveCashBox({
				URL: '/save-cash-box',
				price: $priceCashBox.value,
				CBSUCCESS: (res)=>{ 
					if(res.data){
						$('#modal-box').modal('hide');
						d.getElementById('check-b').textContent = '$' + new Intl.NumberFormat("es-CO", "COP", 2, 2500000).format($priceCashBox.value);
						$('#modal-check-box').modal('show');
						setTimeout(() => {
							d.getElementById('modal-box').remove();
						}, 1000);
					}
				}
			});
		}else{
			const $alertCashBox = d.getElementById('alert-cash-box');
			$alertCashBox.classList.remove('d-none');
			$alertCashBox.textContent = `El valor debe ser mínimo de $50.`;
		}

	});

	//buttons number
	const $multiply = d.getElementById('multiply'),
		$delete = d.getElementById('delete');

	//stetic
	const $alertUser = d.getElementById('alertUser');
	if ($alertUser) {
		$alertUser.classList.remove('my-3');
		$alertUser.classList.add('mb-3');
	}

	//Variables logic
	let productsMenu = null,
		listProducts = [],
		total = 0,
		cambio,
		clients,
		observations,
		checkObs = false,
		checkFiado = false;

	$register.focus();
	$table.insertAdjacentElement('afterend', Loader());

	await ajax.productsMenu({
		URL: '/turno/caja/products',
		CBSUCCESS: (products) => {
			d.querySelector('.loader').remove();
			productsMenu = products;
			filter($table, $search, productsMenu);
		},
	});

	//Search product
	$search.addEventListener('keyup', () => {
		filter($table, $search, productsMenu);
	});

	//Press number button
	$multiply.addEventListener('click', () => {
		$register.value += '*';
		if (!isMobile()) $register.focus();
		valInput(total, productsMenu);
	});

	$delete.addEventListener('click', () => {
		const text = $register.value;
		$register.value = text.substring(0, text.length - 1);
		if (!isMobile()) $register.focus();
		valInput(total, productsMenu);
	});

	$register.addEventListener('keyup', () => {
		if (!isMobile()) $register.focus();
		valInput(total, productsMenu);
	});

	$divCheckObs.addEventListener('click', () => {
		const checkObservations = d.getElementById('checkObs');
		if (listProducts.length > 0) {
			if (checkObservations.checked) {
				checkObservations.checked = false;
				checkObs = false;
			} else {
				checkObservations.checked = true;
				checkObs = true;
			}
		}
	});

	$divCheckFiado.addEventListener('click', () => {
		const checkFiados = d.getElementById('checkFiado');
		if (listProducts.length > 0) {
			if (checkFiados.checked) {
				checkFiados.checked = false;
				checkFiado = false;
			} else {
				checkFiados.checked = true;
				checkFiado = true;
			}
		}
	});

	$caja.addEventListener('submit', (e) => {
		e.preventDefault();

		const valRegister = Number($register.value);
		cambio = null;
		if (!isNaN(valRegister) && valRegister > 999) {
			cambio = { bill: valRegister, vueltas: valRegister - total, total };
			if (valRegister >= total) {
				d.getElementById('registrar').click();
			} else {
				cambio.vueltas = updateTotal(cambio.vueltas * -1);
				const $alert = Alert('warning', `Faltan: $${cambio.vueltas}`, '');
				updateAlerts($alert);
			}
		} else {
			if ($register.value) {
				const billete = d.querySelector('.divBillete').querySelector('svg');
				if (billete) billete.remove();

				const product = findProduct(productsMenu);
				if (product) {
					listProducts = pushListProducts(listProducts, product);

					removeAlerts();
					d.getElementById('checkFiado').removeAttribute('disabled');
					d.getElementById('checkObs').removeAttribute('disabled');

					$register.value = '';
				} else {
					const $alert = Alert(
						'warning',
						`Producto: ${$register.value} no encontrado`,
						'Intente nuevamente'
					);
					updateAlerts($alert);
				}
			}
		}
		if (!isMobile()) $register.focus();
		replaceTotal();
	});

	//Events of DOM
	d.addEventListener('click', async (e) => {
		//Write numbers in the input
		if (e.target.matches('.btn-caja')) {
			const number = Number(d.querySelector(`#${e.target.id}`).textContent);
			if (!isNaN(number)) {
				$register.value += number;
				if (d.querySelector('.btn-close')) {
					$divImgCaja.querySelector('img').classList.remove('d-none');
					const currentAlert = d.querySelector('.alertCaja');
					if (currentAlert) currentAlert.remove();
				}
			}
			valInput(total, productsMenu);
			if (!isMobile()) $register.focus();
		}

		//close Alert
		if (e.target.matches('.btn-close')) {
			setTimeout(() => {
				$divImgCaja.querySelector('img').classList.remove('d-none');
			}, 150);
			if (!isMobile()) $register.focus();
		}

		//Delete Product Orden
		if (e.target.matches('.act')) {
			const $divFinally = d.getElementById('div-finally');
			if (!$divFinally) {
				const idProduct = parseInt(e.target.dataset.id);
				document.getElementById(`product-${idProduct}`).remove();

				listProducts = sliceProducts(listProducts, idProduct);

				//total = deleteProductOrden(listProducts, idProduct, total);
				if (listProducts.length <= 0) {
					d.getElementById('checkFiado').setAttribute('disabled', true);
					d.getElementById('checkObs').setAttribute('disabled', true);
				}

				replaceTotal();
			}
		}

		//Register Orden
		if (e.target.matches('#registrar')) {
			const $divFinally = d.getElementById('div-finally');
			if (valInNoEmpty($divFinally, listProducts)) {

				if (checkFiado) await getClients();
				else clients = null;

				d.getElementById('container-caja').remove();

				if (checkFiado || checkObs) {
					$colum3.appendChild(FinallyRegisterObs(checkObs, clients));
				} else {
					clients = null;
					observations = null;
					sendOrden(listProducts, clients, observations, cambio);
				}
			} else {
				const $alert = Alert(
					'danger',
					'Error',
					'Registre al menos un producto.'
				);
				updateAlerts($alert);

				if (!isMobile()) $register.focus();
			}
		}

		//Render Caja
		if (e.target.matches('#back')) {
			$colum3.childNodes[2].remove();
			$colum3.appendChild($contCaja);
			$register.value = '';
			const billete = d.querySelector('.divBillete').querySelector('svg');
			if (billete) billete.remove();
			if (!isMobile()) $register.focus();
			enableButtons();
		}

		if (e.target.matches('#aceptar')) {
			location.reload();
		}
	});

	//Submit DOM
	d.addEventListener('submit', (e) => {
		if (e.target.matches('#finally')) {
			e.preventDefault();
			sendOrden(listProducts, clients, observations, cambio);
		}
	});

	//Change DOM
	d.addEventListener('change', (e) => {
		if (e.target.matches('#clients')) {
			if (e.target.value > 0) {
				const idClient = Number(e.target.value);
				if (!isNaN(idClient)) clients = idClient;
			} else clients = -1;
		}

		if (e.target.matches('#checkObs')) {
			const checkObservations = d.getElementById('checkObs');
			checkObs = checkObservations.checked;
			//console.log(checkObs);
		}

		if (e.target.matches('#checkFiado')) {
			const checkFiados = d.getElementById('checkFiado');
			checkFiado = checkFiados.checked;
			//console.log(checkFiado);
		}
	});

	d.addEventListener('keyup', (e) => {
		if (e.target.matches('#textAreaObs')) {
			const $observations = d.getElementById('textAreaObs');
			let text = 'Fiado: ';
			if (!clients) text = $observations.value;
			else text += $observations.value;

			observations = text;
		}
	});

	//Shortcuts keys

	d.addEventListener('keydown', (e) => {
		const keyCtrl = e.ctrlKey,
			keyPress = e.key,
			focus = d.activeElement.id;

		if (keyCtrl && keyPress === 'Enter' && focus === 'register') {
			const textRegister = $register.value;
			cambio = null;
			if (textRegister) d.getElementById('plu').click();
			else d.getElementById('registrar').click();
		}

		if (keyPress === 'Escape') {
			if (focus === 'register') $register.blur();
			else if (!isMobile()) $register.focus();
		}
	});

	//functions
	function updateAlerts($alert) {
		const $alerts = d.querySelector('.alerts'),
			$currentAlerts = d.querySelectorAll('.alertCaja');

		if ($currentAlerts.length < 1) {
			$divImgCaja.querySelector('img').classList.add('d-none');
			$alerts.appendChild($alert);
		} else {
			$alerts.replaceChild($alert, $alerts.firstElementChild);
		}
	}

	function removeAlerts() {
		const $currentAlerts = d.querySelectorAll('.alertCaja');

		if ($currentAlerts.length > 0) {
			$divImgCaja.querySelector('img').classList.remove('d-none');
			$currentAlerts[0].remove();
		}
	}

	async function getClients() {
		await ajax.productsMenu({
			URL: '/clientes/list',
			CBSUCCESS: (cli) => {
				clients = cli;
			},
		});
	}

	function replaceTotal() {
		total = 0;
		for (const list of listProducts) {
			console.log(list.price);
			total += getTotal(list.price, list.amount);
		}
		$total.textContent = updateTotal(total);
	}

	function isMobile() {
		return (
			navigator.userAgent.match(/Android/i) ||
			navigator.userAgent.match(/webOS/i) ||
			navigator.userAgent.match(/iPhone/i) ||
			navigator.userAgent.match(/iPod/i) ||
			navigator.userAgent.match(/iPad/i) ||
			navigator.userAgent.match(/BlackBerry/i)
		);
	}
}
