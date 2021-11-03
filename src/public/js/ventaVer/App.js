import { Alert } from '../components/Alert.js';

export async function App() {
	const d = document,
		$observations = d.getElementById('observations'),
		$slObs = d.querySelectorAll('.slObs');

	$slObs.forEach((el) => {
		el.remove();
	});

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

	d.addEventListener('click', (e) => {
		if (e.target.matches('.btn-submit')) {
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
