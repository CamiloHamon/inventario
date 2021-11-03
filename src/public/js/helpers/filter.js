import { Product } from '../components/Product.js';
import { NoFound } from '../components/NoFound.js';

export function filter($table, $search, listProdcts) {
	const d = document;
	const $tBody = $table.querySelector('tBody');
	const $notFound = d.querySelector('.noFound');
	$tBody.innerHTML = '';

	const $fragment = d.createDocumentFragment(),
		text = $search.value.toLowerCase();

	if ($notFound) $notFound.remove();

	let showProducts = 0;

	listProdcts.forEach((el) => {
		const name = el.name.toLowerCase();
		if (name.indexOf(text) !== -1) {
			$fragment.appendChild(Product(el));
			showProducts++;
		}
	});

	const $divTable = d.getElementById('divTable');
	if (showProducts > 8) {
		$divTable.classList.add('overflow', 'border-red');
		$divTable.classList.remove('border-left-red', 'border-up-red');
	} else {
		$divTable.classList.remove('overflow', 'border-red');
		$divTable.classList.add('border-left-red', 'border-up-red');
	}

	$tBody.appendChild($fragment);

	if ($tBody.innerHTML === '') {
		$table.insertAdjacentElement('afterend', NoFound());
	}
}
