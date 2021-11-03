import { ProductOrden } from '../components/ProductOrden.js';

export function pushListProducts(listProducts, product) {
	const d = document,
		text = d.getElementById('register').value,
		input = text.split('*'),
		idProduct = Number(input[0]),
		result = listProducts,
		$ordenTable = d.getElementById('orden-table');

	let addAmountProduct = false,
		amount = 1;

	if (input.length > 1) {
		const amountR = Number(input[1]);
		if (!isNaN(amountR) && amountR > 0) {
			amount *= amountR;
		}
	}

	for (let i = 0; i < result.length; i++) {
		if (result[i].idProduct === idProduct) {
			result[i].amount += amount;

			const $trIdProduct = d.getElementById(`product-${idProduct}`),
				$trAmount = $trIdProduct.querySelector('.amount');

			$trAmount.textContent = listProducts[i].amount;

			addAmountProduct = true;
			break;
		}
	}

	if (!addAmountProduct) {
		product.amount = amount;
		result.push(product);
		$ordenTable.querySelector('tBody').appendChild(ProductOrden(product));
	}

	return result;
}
