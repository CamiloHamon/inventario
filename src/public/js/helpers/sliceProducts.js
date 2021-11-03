export function sliceProducts(listProducts, idProduct) {
	let products = listProducts;
	for (let i = 0; i < products.length; i++) {
		const index = products[i].idProduct;
		if (index === idProduct) products.splice(i, 1);
	}

	return products;
}
