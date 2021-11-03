import { Clients } from './Clients.js';

export function ListClients(clients) {
	const d = document,
		$select = d.createElement('select'),
		$opSelected = d.createElement('option');

	$opSelected.textContent = '-- Seleccione un Cliente --';
	$opSelected.setAttribute('selected', 'true');
	$opSelected.value = '';
	$select.appendChild($opSelected);

	$select.setAttribute('id', 'clients');
	$select.classList = 'form-control';
	$select.setAttribute('required', 'true');

	clients.forEach((cli) => {
		$select.appendChild(Clients(cli));
	});

	return $select;
}
