export function ProductOrden(product) {
	const d = document,
		$fragment = d.createDocumentFragment(),
		$template = d.getElementById('orden-template').content;

	$template.querySelector('tr').id = `product-${product.idProduct}`;
	$template.querySelector('tr').dataset.id = product.idProduct;
	$template.querySelector('.name').textContent = product.name;
	$template.querySelector('.amount').textContent = product.amount;
	$template.querySelector('.act').dataset.name = product.name;
	$template.querySelector('.act').dataset.id = product.idProduct;

	const $clone = d.importNode($template, true);
	$fragment.appendChild($clone);

	return $fragment;
}
