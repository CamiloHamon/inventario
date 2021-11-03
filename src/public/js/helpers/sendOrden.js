import { Loader } from '../components/Loader.js';
import { Row } from '../components/Row.js';
import { Colums } from '../components/Columns.js';
import { Icon } from '../components/Icons.js';
import { Text } from '../components/Text.js';

import ajax from './ajax.js';
import { Buttons } from '../components/Buttons.js';
import { Details } from '../components/Details.js';

export async function sendOrden(listProducts, clients, observations, cambio) {
	const d = document,
		$colum3 = d.getElementById('column-3'),
		$divFinally = d.getElementById('div-finally'),
		$divObs = d.getElementById('div-obs'),
		$loader = Loader(),
		$divSuccess = Row('success'),
		$col = Colums(12);

	if ($divFinally) $divFinally.remove();
	if ($divObs) $divObs.remove();

	$col.appendChild($loader);
	$divSuccess.appendChild($col);
	$colum3.appendChild($divSuccess);

	ajax.registerProducts({
		URL: '/turno/caja/registrar',
		listProducts,
		clients,
		observations,
		CBSUCCESS: (res) => {
			$loader.remove();
			if (res.data.status) {
				$col.classList.add(
					'my-2',
					'row',
					'align-items-center',
					'justify-content-center'
				);
				const type = res.data.type;
				$col.appendChild(
					Icon(
						'fas fa-check-circle text-success check-success my-3 blockMobile'
					)
				);
				$col.appendChild(
					Text(
						`${type} Registrado Exitosamente`,
						'text-success-caja text-success blockMobile'
					)
				);

				if (cambio) $col.appendChild(Details(cambio));
			} else {
				$col.appendChild(
					Icon('fas fa-times-circle text-danger check-success my-1')
				);
				$col.appendChild(
					Text(
						'¡No se pudo registar la orden!',
						'text-success-caja text-danger'
					)
				);
				const message = res.data.message;
				if (message) {
					$col.appendChild(Text(message));
				}

				const products = res.data.failProduct;
				if (products) {
					const $table = d.createElement('table'),
						$tHead = d.createElement('thead'),
						$tBody = d.createElement('tbody');

					const $tr = d.createElement('tr'),
						$th1 = d.createElement('th'),
						$th2 = d.createElement('th'),
						$th3 = d.createElement('th');

					$th1.textContent = 'Nombre';
					$tr.appendChild($th1);
					$th2.textContent = 'Actual';
					$tr.appendChild($th2);
					$th3.textContent = 'Registrar';
					$tr.appendChild($th3);

					$tHead.appendChild($tr);

					products.forEach((el) => {
						const $trBody = d.createElement('tr');
						const $thTable = d.createElement('th');
						$thTable.textContent = el.name;
						const $thTable2 = d.createElement('th');
						$thTable2.textContent = el.currentAmount;
						$thTable2.className = 'text-success';
						const $thTable3 = d.createElement('th');
						$thTable3.textContent = el.amount;
						$thTable3.className = 'red';
						$trBody.appendChild($thTable);
						$trBody.appendChild($thTable2);
						$trBody.appendChild($thTable3);
						$tBody.appendChild($trBody);
					});

					$table.className = 'table table-bordered';
					$tHead.className = 'border-red';

					$table.appendChild($tHead);
					$table.appendChild($tBody);
					$col.appendChild($table);
					$col.appendChild(Text('Por favor, revise su inventario.'));
					//setTimeout('document.location.reload()', 700);
				}
			}
			$col.appendChild(Buttons('Aceptar', 'aceptar'));
			const $btnReload = $col.querySelector('button');
			$btnReload.classList.add('blockMobile', 'mb-3');
			$btnReload.focus();
		},
		CBERROR: (error) => {
			$loader.remove();

			$col.appendChild(
				Icon('fas fa-times-circle text-danger check-success my-3')
			);
			$col.appendChild(
				Text('No se pudo registar!!!', 'text-success-caja text-danger')
			);
			$col.appendChild(Text(error));
			//setTimeout('document.location.reload()', 700);
		},
	});
}
