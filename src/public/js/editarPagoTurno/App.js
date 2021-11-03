import { decimal } from '../helpers/decimal.js';
import ajax from '../helpers/ajax.js';
import { Alert } from '../components/Alert.js';

export async function App() {
	const d = document,
		$inputAmount = d.getElementById('inputValue');

	let total = 0,
		idPayTurn = 0;

	getTotal();
	getIdPayTurn();

	function getIdPayTurn() {
		let ruta = location.pathname;
		ruta = Number(ruta.split('/')[3]);
		idPayTurn = ruta;
	}

	function getTotal() {
		const $tableLoans = d.getElementById('table');
		if ($tableLoans) {
			const $prices = $tableLoans.querySelectorAll('.price');
			$prices.forEach((el) => {
				let price = el.textContent.split('$')[1];
				price = decimal(price);
				total += price;
			});
		}
	}

	d.addEventListener('click', (e) => {
		if (e.target.matches('.delLoan')) {
			e.preventDefault();
			const idLoan = Number(e.target.id.split('-')[1]);
			const idUser = Number(e.target.getAttribute('data-idUser'));
			if (!isNaN(idLoan) && !isNaN(idUser)) {
				ajax.delLoanPay({
					URL: '/turno/vales/delPay',
					idUser,
					idLoan,
					CBSUCCESS: (res) => {
						const data = res.data;
						if (data) location.reload();
					},
					CBERROR: (error) => {},
				});
			}
		}
	});

	d.addEventListener('submit', (e) => {
		if (e.target.matches('#form')) {
			e.preventDefault();
			const amount = Number($inputAmount.value);
			if (!isNaN(amount)) {
				if (amount >= total) {
					ajax.updateLoanPay({
						URL: `/turno/pago/${idPayTurn}/editar`,
						price: amount,
						CBSUCCESS: (res) => {
							location = '/turno/pago';
						},
						CBERROR: (error) => {},
					});
				} else {
					const $divAlerts = d.getElementById('alerts');
					const $alert = Alert(
						'warning',
						'Cuidado',
						'El valor debe ser mayor al pago a saldar.'
					);
					$divAlerts.appendChild($alert);
				}
			}
		}
	});

	function removeAlerts() {
		const $currentAlert = d.querySelector('.alert');
		if ($currentAlert) $currentAlert.remove();
	}
}
