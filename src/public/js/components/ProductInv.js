export function ProductInv(props) {
	const d = document,
		$tr = d.createElement('tr'),
		$tdName = d.createElement('td'),
		$tdAmount = d.createElement('td'),
		$tdInputs = d.createElement('td'),
		$tdSell = d.createElement('td'),
		$tdDischarged = d.createElement('td'),
		$tdFiados = d.createElement('td'),
		$tdActions = d.createElement('td'),
		$tdExist = d.createElement('td');

	$tdName.textContent = props.name;
	$tdName.classList = 'sticky-prod-inv-act name';

	$tdAmount.textContent = props.amount;
	$tdAmount.classList = 'text-center amount';

	$tdInputs.textContent = props.inputs;
	$tdInputs.classList = 'text-center inputs';

	$tdSell.textContent = props.sell;
	$tdSell.classList = 'text-center sell';

	$tdDischarged.textContent = props.discharged;
	$tdDischarged.classList = 'text-center discharged';

	$tdFiados.textContent = props.fiados;
	$tdFiados.classList = 'text-center fiados';

	$tdExist.textContent = props.exist;
	$tdExist.classList = 'text-center exist';

	const $a = d.createElement('a');
	$a.href = `/inventario/editar/${props.idProduct}/producto`;
	$a.classList = 'white';

	const $i = d.createElement('i');
	$i.classList = 'fas fa-edit gray cursor-pointer';

	$a.appendChild($i);

	$tdActions.appendChild($a);
	$tdActions.classList = 'text-center';

	$tr.appendChild($tdName);
	$tr.appendChild($tdAmount);
	$tr.appendChild($tdInputs);
	$tr.appendChild($tdSell);
	$tr.appendChild($tdDischarged);
	$tr.appendChild($tdFiados);
	$tr.appendChild($tdExist);
	$tr.appendChild($tdActions);

	return $tr;
}
