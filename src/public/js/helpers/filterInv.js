import { ProductInv } from '../components/ProductInv.js';
import { NoFound } from '../components/NoFound.js';

export function filterInv($table, $search, listProdcts) {
	const d = document;
	const $tBody = $table.querySelector('tBody');
	const $notFound = d.querySelector('.noFound');
	$tBody.innerHTML = '';

	const $fragment = d.createDocumentFragment(),
		text = $search.value.toLowerCase();

	if ($notFound) $notFound.remove();

	listProdcts.forEach((el) => {
		const name = el.name.toLowerCase();
		if (name.indexOf(text) !== -1) $fragment.appendChild(ProductInv(el));
	});
	$tBody.appendChild($fragment);

	if ($tBody.innerHTML === '') {
		$table.insertAdjacentElement('afterend', NoFound());
	}
}
