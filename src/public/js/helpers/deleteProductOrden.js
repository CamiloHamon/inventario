export function deleteProductOrden(listProducts, idProduct, total) {
	document.getElementById(`product-${idProduct}`).remove();

	for (let i = 0; i < listProducts.length; i++) {
		const index = listProducts[i].idProduct;
		if (index === idProduct) {
			const price = parseFloat(listProducts[i].price.replace(/,/g, ''));
			const newTotal = listProducts[i].amount * price;
			total = total - newTotal;

			listProducts.splice(i, 1);
		}
	}
	return total;
}
