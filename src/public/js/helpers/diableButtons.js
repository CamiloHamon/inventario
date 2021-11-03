export function disabledButtons() {
	const buttons = document
		.getElementById('orden-table')
		.querySelectorAll('button');

	buttons.forEach((el) => {
		el.setAttribute('disabled', 'true');
	});
}
