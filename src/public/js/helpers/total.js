export function getTotal(price, amount) {
	price = parseFloat(price.replace(/,/g, ''));
	const total = price * amount;
	return total;
}
