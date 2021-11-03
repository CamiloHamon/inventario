export function Product(props) {
	const d = document,
		$tr = d.createElement('tr'),
		$td = d.createElement('td'),
		$tdName = d.createElement('td'),
		$tdPrice = d.createElement('td');

	$td.textContent = props.idProduct;
	$td.classList.add('cod', 'text-center');

	$tdName.textContent = props.name;
	$tdName.classList.add('name', 'text-justify');

	$tdPrice.textContent = `$${props.price}`;
	$tdPrice.classList.add('price', 'text-justify');

	$tr.appendChild($td);
	$tr.appendChild($tdName);
	$tr.appendChild($tdPrice);

	return $tr;
}
