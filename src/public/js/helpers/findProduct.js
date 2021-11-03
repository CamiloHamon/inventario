export function findProduct(productsMenu) {
	const d = document,
		text = d.getElementById('register').value,
		input = text.split('*'),
		idProduct = Number(input[0]);

	let product;

	if (!isNaN(idProduct)) {
		for (let i = 0; i < productsMenu.length; i++) {
			if (productsMenu[i].idProduct === idProduct) product = productsMenu[i];
		}
	}

	return product;
}
