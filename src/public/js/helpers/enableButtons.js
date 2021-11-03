export function enableButtons() {
	const buttons = document
		.getElementById('orden-table')
		.querySelectorAll('button');

	buttons.forEach((el) => {
		el.removeAttribute('disabled');
	});
}
