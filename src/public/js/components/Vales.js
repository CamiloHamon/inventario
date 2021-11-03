export function Vales(props) {
	const d = document,
		$tr = d.createElement('tr'),
		$th = d.createElement('th'),
		$tdPrice = d.createElement('td'),
		$tdSaldar = d.createElement('td');

	$th.textContent = props.date;
	$th.classList.add('date', 'text-center');

	$tdPrice.textContent = `$${props.price}`;
	$tdPrice.classList.add('price');

	const $check = d.createElement('input');
	$check.type = 'checkbox';
	$check.setAttribute('id', `checkLoan-${props.idLoans}`);
	$check.classList.add('checkVales');
	$tdSaldar.appendChild($check);
	$tdSaldar.classList.add('text-center');

	$tr.appendChild($th);
	$tr.appendChild($tdPrice);
	$tr.appendChild($tdSaldar);

	$tr.setAttribute('id', `trLoan-${props.idLoans}`);

	return $tr;
}
