import { Alert } from '../components/Alert.js';
import ajax from '../helpers/ajax.js';

export async function App() {
	const d = document,
		$observations = d.getElementById('observations'),
		$slObs = d.querySelectorAll('.slObs');

	$slObs.forEach((el) => {
		el.remove();
	});

	const idUser = getIdUser();

	if (!$observations) {
		const $container = d.getElementById('modals');
		const $delSale = d.querySelectorAll('.delSale');
		$delSale.forEach((el) => {
			el.setAttribute('data-target', '#errorDelete');
		});

		$container.appendChild(modal('errorDelete', 'eliminar'));

		const $editSales = d.querySelectorAll('.editSale');
		$editSales.forEach((el) => {
			el.setAttribute('data-toggle', 'modal');
			el.setAttribute('data-target', '#error');
		});

		$container.appendChild(modal('error', 'editar'));
	} else {
		const $modalDel = d.querySelectorAll('.modalDel');
		$modalDel.forEach((el) => {
			const $obs = el.querySelector('select');
			const $fragment = d.createDocumentFragment();
			$slObs.forEach((el) => {
				const $clon = el.cloneNode(true);
				$fragment.appendChild($clon);
			});
			$obs.appendChild($fragment);
		});
	}

	let arrayTrust = [],
		state = false;

	function getIdUser() {
		return Number(location.pathname.split('/')[3]);
	}

	d.addEventListener('click', (e) => {
		if (e.target.matches('.btn-submit')) {
			if (arrayTrust.length > 0) {
				if (!isNaN(idUser)) {
					ajax.saldar({
						URL: `/turno/fiados/${idUser}/saldar`,
						idUser,
						trust: arrayTrust,
						CBSUCCESS: (res) => {
							location.reload();
						},
						CBERROR: (error) => {
							location.reload();
						},
					});
				} else location.reload();
			} else {
				const $divAlerts = d.getElementById('alertas'),
					$alert = d.querySelector('.alert');

				if ($alert) $alert.remove();

				const $cAlert = Alert(
					'warning',
					'Cuidado',
					'Seleccione almenos un fiado para saldar'
				);

				$divAlerts.appendChild($cAlert);
			}
		}

		if (e.target.matches('#allTrust')) {
			const $checkBoxes = d.querySelectorAll('.trust');
			if (state) {
				e.target.textContent = 'Todo';
				state = false;
			} else {
				e.target.textContent = 'Deshacer';
				state = true;
			}
			$checkBoxes.forEach((el) => {
				el.checked = state;
				checked(el);
			});
		}

		if (e.target.matches('.btn-submitDel')) {
			const id = e.target.id.split('-')[1];
			const $select = d.getElementById(`sl-${id}`);
			const valor = $select.value;
			const $alert = d.querySelector('.alert');
			if ($alert) $alert.remove();
			if (valor) {
				const $form = d.querySelector(`#form-${id}`);
				$form.submit();
			} else {
				d.getElementById('alerts').appendChild(
					Alert(
						'warning',
						'Cudiado',
						'Debe seleccionar al menos una observacion'
					)
				);
			}
		}
	});

	d.addEventListener('change', (e) => {
		if (e.target.matches('.trust')) checked(e.target);
	});

	function checked(e) {
		const idTrust = Number(e.value);
		if (!isNaN(idTrust)) {
			const $checkbox = d.getElementById(`trust-${idTrust}`);
			if (!$checkbox.checked) {
				const pos = arrayTrust.indexOf(idTrust);
				if (pos !== -1) arrayTrust.splice(pos, 1);
			} else arrayTrust.push(idTrust);
		}
	}

	function modal(id, type) {
		const $modal = d.createElement('div');

		$modal.innerHTML = `
		<div class="modal fade" id="${id}" tabindex="-1" role="dialog"
		aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
		<div class="modal-dialog modal-dialog-centered" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title" id="exampleModalLongTitle">No puede ${type} la venta
					</h5>
					<button type="button" class="close" data-dismiss="modal" aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body">
					<div class="text-center justify-content-center">
						<p>No puede <strong>${type}</strong> la venta porque no tiene observaciones.</p>
					</div>
				</div>
				<div class="modal-footer justify-content-center">
					<button type="button" class="btn btn-primary" data-dismiss="modal">Aceptar</button>
				</div>
			</div>
		</div>
	</div>`;

		return $modal;
	}
}
