import { decimal } from '../helpers/decimal.js';
import { Alert } from '../components/Alert.js';
import { Colums } from '../components/Columns.js';
import { Loader } from '../components/Loader.js';
import { Vales } from '../components/Vales.js';
import ajax from '../helpers/ajax.js';
import { updateTotal } from '../helpers/updateTotal.js';
import { Cambio } from '../components/Cambio.js';
import { Buttons } from '../components/Buttons.js';

export async function App() {
	//DOM var
	const d = document,
		$btnAdd = d.getElementById('addPay'),
		$btnPay = d.getElementById('btn-pay'),
		$tableVales = d.getElementById('tableVales'),
		$contentTable = d.getElementById('contentTable'),
		$selecUsr = d.getElementById('slUser'),
		$inputAmount = d.getElementById('inputValue');

	//logical var

	let totalSaldar = 0,
		loans = [],
		total = 0;

	//functions
	$inputAmount.setAttribute('disabled', 'true');
	$contentTable.remove();
	$btnAdd.remove();

	$selecUsr.addEventListener('change', async () => {
		const idUser = Number($selecUsr.value);
		totalSaldar = 0;
		total = 0;
		loans = [];

		$contentTable.remove();

		if (!isNaN(idUser) && idUser > 0) {
			$inputAmount.removeAttribute('disabled');

			const $slDiv = d.getElementById('slDiv');
			$slDiv.appendChild(loader());

			removeAlerts();

			await ajax.listLoans({
				URL: `/turno/vales/${idUser}/list`,
				CBSUCCESS: (loansPost) => {
					$contentTable.classList.remove('d-none');
					$tableVales.appendChild($contentTable);

					removeLoader();

					const emp = $selecUsr.options[$selecUsr.selectedIndex].text;

					setTitle(emp);

					const $table = d.getElementById('table'),
						$tBody = $table.querySelector('tBody');

					$tBody.innerHTML = '';
					$tBody.appendChild(completeTable(loansPost));

					completeTotal(emp);
				},
				CBERROR: (err) => {
					$contentTable.remove();
				},
			});

			showBtnSend();
		} else {
			$btnPay.setAttribute('disabled', 'true');
			$inputAmount.value = '';
			$inputAmount.setAttribute('disabled', 'true');
			removeAlerts();
			$btnAdd.remove();
		}
	});

	$inputAmount.addEventListener('keyup', () => {
		const exR = /^([1-9])(([0-9]){1,5})?$/;
		const text = $inputAmount.value;

		if (!exR.test(text)) $inputAmount.value = '';

		const $inputs = d.querySelectorAll('input');

		$inputs.forEach((el) => {
			if (el.type === 'checkbox') el.checked = false;
		});

		totalSaldar = 0;

		if (Number(text) >= 50) $btnPay.removeAttribute('disabled');
		else $btnPay.setAttribute('disabled', 'true');

		loans = [];
	});

	d.addEventListener('change', (e) => {
		if (e.target.matches('.checkVales')) {
			const valor = Number($inputAmount.value),
				idLoan = Number(e.target.id.split('-')[1]),
				$input = d.getElementById(e.target.id);

			if (!isNaN(idLoan)) {
				const $trLoan = d.getElementById(`trLoan-${idLoan}`);
				if ($trLoan) {
					removeAlerts();

					let price = $trLoan.querySelector('.price').textContent;
					price = price.split('$')[1];
					price = decimal(price);

					if ($input.checked) {
						totalSaldar += price;
						const idExist = loans.includes(idLoan);

						if (!idExist) loans.push(idLoan);
					} else {
						totalSaldar -= price;
						emptyLoans(idLoan);
					}

					if (valor >= totalSaldar) {
						$btnPay.removeAttribute('disabled');
						//loans.push(idLoan);
					} else {
						const $afterAlerts = d.getElementById('afterAlerts');
						const $alert = Alert(
							'warning',
							'Cuidado',
							'El valor debe ser mayor al pago a saldar.'
						);
						$afterAlerts.appendChild($alert);
						$input.checked = false;
						totalSaldar -= price;
						emptyLoans(idLoan);
					}
				}
			}
		}
	});

	d.addEventListener('click', (e) => {
		if (e.target.matches('#accepted')) {
			location.pathname = '/turno/pago';
			location = '/turno/pago';
		}
	});

	d.addEventListener('submit', (e) => {
		if (e.target.matches('#formPay')) {
			e.preventDefault();

			//send data
			const amount = Number($inputAmount.value),
				idUser = Number($selecUsr.value);

			if (!isNaN(amount) && !isNaN(idUser)) {
				ajax.registerPay({
					URL: '/turno/pago/agregar',
					idUser,
					amount,
					loans,
					CBSUCCESS: (res) => {
						const response = res.data;
						if (response.status) {
							console.log(response.details);
							if (response.type === 'onlyPay') {
								location.pathname = '/turno/pago';
								location = '/turno/pago';
							} else if (response.details) {
								const $form = d.getElementById('formPay'),
									$divContain = d.getElementById('container');

								$divContain.style.height = '50vh!important';
								$divContain.classList.add(
									'row',
									'justify-content-center',
									'align-items-center',
									'overflow-50'
								);

								$form.remove();
								const $col = Colums(6);
								$col.classList.add(
									'border-red',
									'rounded',
									'pb-4',
									'col-11',
									'col-md-6'
								);
								const emp = $selecUsr.options[$selecUsr.selectedIndex].text;
								response.details.name = emp;
								$col.appendChild(Cambio(response.details, emp));
								$col.appendChild(Buttons('Aceptar', 'accepted'));

								$divContain.appendChild($col);
							}
						} else {
							location = '/turno/pago';
						}
					},
					CBERROR: (error) => {},
				});
			}
		}
	});

	function loader() {
		const $colLoader = Colums(10);
		const $loader = Loader();
		$colLoader.appendChild($loader);
		return $colLoader;
	}

	function removeAlerts() {
		const $currentAlert = d.querySelector('.alert');
		if ($currentAlert) $currentAlert.remove();
	}

	function removeLoader() {
		const $colLoader = d.getElementById('loaderId');
		$colLoader.remove();
	}

	function completeTable(loansPost) {
		const $fragment = d.createDocumentFragment();
		loansPost.forEach((el) => {
			total += decimal(el.price);
			$fragment.appendChild(Vales(el));
		});
		return $fragment;
	}

	function completeTotal(emp) {
		const $divTotal = d.getElementById('totalVales');
		$divTotal.innerHTML = `Total vales de: <span class='red'> ${emp}</span>: $${updateTotal(
			total
		)}`;

		$divTotal.classList.add(
			'border-up-red',
			'border-down-red',
			'p-2',
			'text-right'
		);
	}

	function showBtnSend() {
		const $divPay = d.getElementById('div-btn-pay');
		$btnAdd.classList.remove('d-none');
		$divPay.appendChild($btnAdd);
	}

	function setTitle(emp) {
		d.getElementById(
			'titleVales'
		).innerHTML = `Vales de: <span class='red'> ${emp}</span>`;
	}

	function emptyLoans(idLoan) {
		const pos = loans.indexOf(idLoan);
		if (pos > -1) {
			loans.splice(pos, 1);
		}
	}
}
