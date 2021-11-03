import { updateTotal } from '../helpers/updateTotal.js';
export function ProductInputs(props) {
	const d = document,
		$tr = d.createElement('tr'),
		$tdName = d.createElement('td'),
		$tdInputs = d.createElement('td'),
		$tdFecha = d.createElement('td'),
		$tdHora = d.createElement('td'),
		$tdPrice = d.createElement('td'),
		$tdActions = d.createElement('td');

	$tdInputs.textContent = props.amountInput;
	$tdInputs.classList = 'text-center amountInput';

	$tdName.textContent = props.name;
	$tdName.classList = 'sticky-prod-inv-act name';

	$tdFecha.textContent = props.date;
	$tdFecha.classList = 'text-center date';

	$tdHora.textContent = props.time;
	$tdHora.classList = 'text-center time';

	$tdPrice.textContent = `$${updateTotal(props.price)}`;
	$tdPrice.classList = 'text-center price';

	const $a = d.createElement('a');
	$a.href = `/inventario/entradas/${props.idInputProduct}/editar`;
	$a.classList = 'white';

	const $i = d.createElement('i');
	$i.classList = 'fas fa-edit gray cursor-pointer';

	$a.appendChild($i);
	$a.style.marginRight = '25px';

	$tdActions.appendChild($a);
	$tdActions.insertAdjacentHTML(
		'beforeend',
		`
	<i class="fas fa-trash red cursor-pointer" data-toggle="modal" data-target="#deleteInput${props.idInputProduct}"></i>
	`
	);
	$tdActions.classList = 'text-center';

	$tr.appendChild($tdName);
	$tr.appendChild($tdInputs);
	$tr.appendChild($tdPrice);
	$tr.appendChild($tdFecha);
	$tr.appendChild($tdHora);
	$tr.appendChild($tdActions);

	return $tr;
}
