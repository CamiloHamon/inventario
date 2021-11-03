import { ProductOrden } from '../components/ProductOrden.js';
import { expReg } from './expReg.js';
import { getTotal } from './total.js';

export function regProdOrden(text, listProducts, productsMenu, total) {
	const d = document,
		$ordenTable = d.getElementById('orden-table');

	if (expReg(text)) {
		let amount = 1,
			product = '';

		const input = text.split('*'),
			idProduct = parseInt(input[0]);

		if (input.length > 1) {
			const amountR = parseInt(input[1]);
			if (!isNaN(amountR)) amount *= amountR;
		}

		let addAmountProduct = false;

		for (let i = 0; i < listProducts.length; i++) {
			if (listProducts[i].idProduct === idProduct) {
				listProducts[i].amount += amount;

				const $trIdProduct = d.getElementById(`product-${idProduct}`),
					$trAmount = $trIdProduct.querySelector('.amount');
				$trAmount.textContent = listProducts[i].amount;

				total = getTotal(listProducts[i], amount);

				addAmountProduct = true;

				break;
			}
		}

		if (!addAmountProduct) {
			for (let i = 0; i < productsMenu.length; i++) {
				if (productsMenu[i].idProduct === idProduct) {
					product = productsMenu[i];
					product.amount = amount;

					total = getTotal(productsMenu[i], amount);

					listProducts.push(product);
				}
			}

			$ordenTable.querySelector('tBody').appendChild(ProductOrden(product));
		}
	} else total = 0;

	return total;
}
