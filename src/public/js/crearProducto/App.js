import ajax from '../helpers/ajax.js';
import { updateTotal } from '../helpers/updateTotal.js';
import { Alert } from '../components/AlertCrear.js';
export async function App() {
	$('#showProductsModal').on('hidden.bs.modal', () => saveProducts());

	const d = document;
	const $contPrecio = d.getElementById('contPrecio'),
		$contAmount = d.getElementById('contAmount'),
		$confirmModal = d.getElementById('confirmModal'),
		$checkInv = d.getElementById('checkInv'),
		$checkCarta = d.getElementById('checkCarta'),
		$btnSubmit = d.getElementById('btn-submit'),
		$divProdDe = d.getElementById('prodDepen'),
		$divProducts = d.getElementById('divProducts'),
		$divPrecio = d.getElementById('divPrecio');

	//crear producto
	const $thPrecio = $confirmModal.querySelector('#precioCarta'),
		$tdPrecio = $confirmModal.querySelector('#priceConfirm'),
		$thInventario = $confirmModal.querySelector('#amountInventario'),
		$tdInventario = $confirmModal.querySelector('#invConfirm'),
		$divInventario = $confirmModal.querySelector('#siInventario'),
		$nameConfirm = $confirmModal.querySelector('#nameConfirm'),
		$codConfirm = $confirmModal.querySelector('#codConfirm'),
		$title = $confirmModal.querySelector('#titleModalConfirm'),
		$contentProducts = d.getElementById('overflowProducts');

	$contPrecio.remove();
	$contAmount.remove();
	$btnSubmit.remove();
	$divProdDe.remove();
	$confirmModal.remove();

	let checkInv = false,
		checkCarta = false;

	//Estructura para enviar
	const data = {
		codigo: -1,
		nombre: '',
		inventario: {
			check: false,
			cantidad: 0,
		},
		carta: {
			check: false,
			precio: 0,
		},
		productos: [],
	};
	//events DOM

	//list names
	let namesProducts = [];

	ajax.listLoans({
		URL: '/inventario/productos/nombres',
		CBSUCCESS: (response) => {
			namesProducts = response;
		},
		CBERROR: (err) => {
			const divInfoProduct = d.getElementById('infoProduct');
			divInfoProduct.innerHTML =
				'<div class="text-center"><h5 class="red">HUBO UN ERROR!!</h5></div>';
		},
	});

	d.addEventListener('change', (e) => {
		if (e.target.matches('#slId')) {
			const $selectId = d.getElementById('slId');
			const cod = Number($selectId.value);
			if (!isNaN(cod) && cod > 0) {
				data.codigo = cod;
			} else data.codigo = -1;
		}

		if (e.target.matches('#checkInv')) {
			checkInv = d.getElementById('checkInv').checked;
			showComplementInv();
		}

		if (e.target.matches('#checkCarta')) {
			checkCarta = d.getElementById('checkCarta').checked;
			showComplementCarta();
		}

		if (e.target.matches('.mainProd')) {
			const id = Number(e.target.id.split('-')[1]);
			if (!isNaN(id)) {
				const $inputAmount = d.getElementById(`amount-${id}`);
				const $check = d.getElementById(`defaultCheck-${id}`);
				const textName = $check.title;

				if ($check.checked) {
					$inputAmount.removeAttribute('disabled');
					const pos = postition(id);

					if (pos === -1) {
						data.productos.push({ id, name: textName, amount: null });
					}
				} else {
					$inputAmount.setAttribute('disabled', 'true');
					$inputAmount.value = '';

					deleteProduct(id);
				}
			}
		}
	});

	d.addEventListener('keyup', (e) => {
		if (e.target.matches('.inputAmount')) {
			const id = Number(e.target.id.split('-')[1]);
			const $check = d.getElementById(`defaultCheck-${id}`);
			const $inputAmount = d.getElementById(`amount-${id}`);
			if (!$check.checked) {
				$inputAmount.setAttribute('disabled', 'true');
				$inputAmount.value = '';
			} else {
				const value = Number($inputAmount.value);
				const pos = postition(id);

				if (pos !== -1 && !isNaN(value) && value > -1) {
					data.productos[pos].amount = value;
				} else $inputAmount.value = '';
			}
		}

		if (e.target.matches('#nameProduct')) {
			const $nameProduct = d.getElementById('nameProduct');
			data.nombre = $nameProduct.value;
			const exR = /^\s/;
			if (!exR.test($nameProduct.value)) {
				if (!validarNombre()) {
					if ($nameProduct.value !== '') {
						const $currentAlert = d.querySelector('.alertCaja');
						if ($currentAlert) $currentAlert.remove();
					}
				}
			} else $nameProduct.value = '';

			showBtnSubmit();
		}

		if (e.target.matches('#amount')) {
			const $inputAmount = d.getElementById('amount');
			const amount = Number($inputAmount.value);

			if (!isNaN(amount) && amount !== 0) {
				data.inventario.cantidad = amount;
			} else {
				$inputAmount.value = '';
				data.inventario.cantidad = 0;
			}
			showBtnSubmit();
		}

		if (e.target.matches('#price')) {
			const $inputPrice = d.getElementById('price');
			const precio = Number($inputPrice.value);

			if (!isNaN(precio) && precio !== 0) {
				data.carta.precio = precio;
			} else {
				$inputPrice.value = '';
				data.carta.precio = 0;
			}
			showBtnSubmit();
		}
	});

	//event click DOM
	d.addEventListener('click', (e) => {
		//checked inventario
		if (e.target.matches('#divCheckInv')) {
			if ($checkInv.checked) $checkInv.checked = false;
			else $checkInv.checked = true;

			checkInv = $checkInv.checked;

			showComplementInv();
		}

		//checket carta
		if (e.target.matches('#divCheckCarta')) {
			if ($checkCarta.checked) $checkCarta.checked = false;
			else $checkCarta.checked = true;

			checkCarta = $checkCarta.checked;
			showComplementCarta();
		}

		//mostrar productos
		if (e.target.matches('#a-show')) {
			if (data.carta.check) {
				const $modalContent = d.getElementById('modal-content');
				setTimeout(() => {
					const totalH = d.body.getBoundingClientRect().height - 420;
					$modalContent.style.height = `${totalH}px`;
				}, 100);

				const $cod = d.getElementById('cod'),
					$nameFinally = d.getElementById('nameFinally'),
					$priceFinally = d.getElementById('priceFinally');

				if (data.codigo !== -1) $cod.textContent = data.codigo;
				else $cod.textContent = 'N/A';

				data.nombre = upperCase(data.nombre);
				$nameFinally.textContent = data.nombre;
				$priceFinally.textContent = `$ ${updateTotal(data.carta.precio)}`;
			} else {
				d.getElementById('a-show').setAttribute('disabled', 'true');
			}
		}

		if (e.target.matches('#btn-submit-form')) {
			data.nombre = data.nombre.replace(/\w\S*/g, (w) =>
				w.replace(/^\w/, (c) => c.toUpperCase())
			);

			$title.innerHTML = `Crear producto: <span class='red'>${data.nombre}</span>`;
			$nameConfirm.textContent = data.nombre;
			console.log(data);
			if (data.codigo > 0) $codConfirm.textContent = data.codigo;
			else $codConfirm.textContent = 'N/A';

			if (data.inventario.check && !data.carta.check) {
				if ($thPrecio) $thPrecio.remove();
				if ($tdPrecio) $tdPrecio.remove();
				removeDivInv();

				addThTd($thInventario, $tdInventario);

				$tdInventario.innerHTML = `<strong>${data.inventario.cantidad}</strong> unid.`;
			} else if (data.carta.check && !data.inventario.check) {
				if ($thInventario) $thInventario.remove();
				if ($tdInventario) $tdInventario.remove();

				addThTd($thPrecio, $tdPrecio);

				$tdPrecio.textContent = `$${updateTotal(data.carta.precio)}`;

				if (data.productos.length > 0) {
					$confirmModal.querySelector('table').after($divInventario);
					const $rowProducts = $contentProducts.querySelector('.rowProducts');

					$contentProducts.innerHTML = '';

					const $fragment = d.createDocumentFragment();
					data.productos.forEach((el) => {
						const $clone = $rowProducts.cloneNode(true);

						const $divNombreProduct = $clone.querySelector('.nombreProducto');
						const $cantidadProducto = $clone.querySelector('.cantidadProducto');

						$divNombreProduct.textContent = el.name;
						$cantidadProducto.textContent = `${el.amount} unid.`;

						$fragment.appendChild($clone);
					});

					$contentProducts.appendChild($fragment);
				} else removeDivInv();
			} else {
				removeDivInv();

				$thPrecio.after($thInventario);
				$tdPrecio.after($tdInventario);

				const $nameHeader = d.getElementById('nameTableHeader');
				$nameHeader.after($thPrecio);
				$nameConfirm.after($tdPrecio);

				$tdInventario.innerHTML = `<strong>${data.inventario.cantidad}</strong> unid.`;
				$tdPrecio.textContent = `$${updateTotal(data.carta.precio)}`;
			}
		}

		if (e.target.matches('#save')) {
			saveProducts();
		}

		if (e.target.matches('#crearProducto')) {
			ajax.createProduct({
				URL: '/inventario/crear/producto',
				data,
				CBSUCCESS: (response) => {
					if (response.data) location = '/inventario';
					else location.reload();
				},
				CBERROR: (error) => {
					location.reload();
				},
			});
		}
	});

	function saveProducts() {
		const $mainProducts = d.querySelectorAll('.mainProd');
		$mainProducts.forEach((el) => {
			if (el.checked) {
				const id = Number(el.id.split('-')[1]);
				if (!isNaN(id) && id > 0) {
					const $inputAmount = d.getElementById(`amount-${id}`);
					const cant = Number($inputAmount.value);

					if (!isNaN(cant) && cant <= 0) {
						el.checked = false;
						$inputAmount.setAttribute('disabled', 'true');
						$inputAmount.value = '';
						deleteProduct(id);
					}
				}
			}
		});
	}

	function addThTd($th, $td) {
		const $nameHeader = d.getElementById('nameTableHeader');
		$nameHeader.after($th);
		$nameConfirm.after($td);
	}

	function removeDivInv() {
		if ($divInventario) $divInventario.remove();
	}
	function deleteProduct(id) {
		const pos = data.productos
			.map((e) => {
				return e.id;
			})
			.indexOf(id);
		if (pos !== -1) data.productos.splice(pos, 1);
	}

	function displayNone() {
		const $complements = d.querySelectorAll('.complements');
		if ($complements.length === 0) $divPrecio.classList.add('d-none');
	}

	function showComplementInv() {
		data.inventario.check = checkInv;
		if (checkInv) {
			$divProducts.remove();
			$divPrecio.classList.remove('d-none');
			const $row = $divPrecio.querySelector('.row');
			$row.appendChild($contAmount);
			data.productos = [];
		} else {
			$divProdDe.appendChild($divProducts);
			d.getElementById('amount').value = '';
			$contAmount.remove();
			const $allProducts = d.querySelectorAll('.productosPendientes');
			$allProducts.forEach((el) => {
				el.querySelector('.mainProd').checked = false;
				const $input = el.querySelector('.inputAmount');
				$input.value = '';
				$input.setAttribute('disabled', 'true');
			});
			data.inventario.cantidad = 0;
			displayNone();
		}
		showBtnSubmit();
	}

	function showComplementCarta() {
		const $row = $divPrecio.querySelector('.row');
		data.carta.check = checkCarta;
		if (checkCarta) {
			$divPrecio.classList.remove('d-none');
			$row.classList.add('justify-content-end');
			$row.appendChild($contPrecio);
			const $infoProduct = d.getElementById('infoProduct');
			$divProdDe.classList.remove('d-none');
			$infoProduct.appendChild($divProdDe);
			moveScreen();
		} else {
			d.getElementById('price').value = '';
			$contPrecio.remove();
			$row.classList.remove('justify-content-end');
			$divProdDe.remove();
			displayNone();
			data.carta.precio = 0;
			data.productos = [];
			const $allProducts = d.querySelectorAll('.productosPendientes');
			$allProducts.forEach((el) => {
				el.querySelector('.mainProd').checked = false;
				const $input = el.querySelector('.inputAmount');
				$input.value = '';
				$input.setAttribute('disabled', 'true');
			});
		}
		showBtnSubmit();
	}

	function moveScreen() {
		const totalH = d.body.getBoundingClientRect().height;

		setTimeout(() => {
			window.scroll({
				top: totalH,
				behavior: 'smooth',
			});
		}, 100);
	}

	function showBtnSubmit() {
		btnShowProducts();

		if (data.nombre && data.nombre.length > 2) {
			const $form = d.getElementById('form');
			$form.appendChild($confirmModal);
			if (data.carta.check && data.inventario.check) {
				if (valCarta() && valInv()) {
					$btnSubmit.classList.remove('d-none');
					$form.appendChild($btnSubmit);
					moveScreen();
				} else $btnSubmit.remove();
			} else if (valCarta() || valInv()) {
				$btnSubmit.classList.remove('d-none');
				d.getElementById('form').appendChild($btnSubmit);
				moveScreen();
			} else $btnSubmit.remove();
		} else $btnSubmit.remove();
	}

	function btnShowProducts() {
		const $btn = d.getElementById('a-show');
		if (valCarta() && data.nombre.length > 2 && !valInv()) {
			if ($btn) {
				$btn.setAttribute('data-toggle', 'modal');
				$btn.setAttribute('data-target', '#showProductsModal');
				$btn.removeAttribute('disabled');
			}
		} else if ($btn) {
			$btn.removeAttribute('data-toggle');
			$btn.removeAttribute('data-target');
			$btn.setAttribute('disabled', 'true');
		}
	}

	function valCarta() {
		const cCarta = data.carta.check,
			precioCarta = Number(data.carta.precio);

		return cCarta && precioCarta > 499 ? true : false;
	}

	function valInv() {
		const cInv = data.inventario.check,
			cantidadInv = data.inventario.cantidad;

		return cInv && cantidadInv > 0 ? true : false;
	}

	function upperCase(text) {
		return text.charAt(0).toUpperCase() + text.slice(1);
	}

	function postition(id) {
		return data.productos.map((e) => e.id).indexOf(id);
	}

	function validarNombre() {
		let result = false;
		const text = data.nombre.toLowerCase();
		namesProducts.forEach((el) => {
			const name = el.name.toLowerCase();
			if (name === text) {
				const $alertas = d.getElementById('alertas');
				$alertas.innerHTML = '';

				const $currentAlert = d.querySelector('.alertCaja');
				if ($currentAlert) $currentAlert.remove();

				$alertas.appendChild(Alert('warning', 'Cuidado', upperCase(name)));

				result = true;
			}
		});
		return result;
	}
}
