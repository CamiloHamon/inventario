import { updateTotal } from '../helpers/updateTotal.js';
export function ProductMenu(props) {
	const d = document,
		$tr = d.createElement('tr'),
		$tdCod = d.createElement('td'),
		$tdName = d.createElement('td'),
		$tdPrice = d.createElement('td'),
		$tdActions = d.createElement('td');

	$tdCod.textContent = props.idProduct;
	$tdCod.classList = 'text-center codProduct';

	$tdName.textContent = props.name;
	$tdName.classList = 'name';

	$tdPrice.textContent = `$${updateTotal(props.price)}`;
	$tdPrice.classList = 'text-center price';

	const $a = d.createElement('a');
	$a.href = `/inventario/editar/${props.idProduct}/producto-menu`;
	$a.classList = 'white';

	const $i = d.createElement('i');
	$i.classList = 'fas fa-edit gray cursor-pointer';

	$a.appendChild($i);

	$tdActions.appendChild($a);
	$tdActions.classList = 'text-center';

	$tr.appendChild($tdCod);
	$tr.appendChild($tdName);
	$tr.appendChild($tdPrice);
	$tr.appendChild($tdActions);

	return $tr;
}
