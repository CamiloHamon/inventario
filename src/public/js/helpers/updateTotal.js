export function updateTotal(total) {
	const newTotal = new Intl.NumberFormat('de-DE').format(total);
	return newTotal;
}
