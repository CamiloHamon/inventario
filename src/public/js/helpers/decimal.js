export function decimal(price) {
	price = parseFloat(price.replace(/,/g, ''));
	return price;
}
