export async function App() {
	const d = document,
		$amount = d.getElementById('amount'),
		amount = $amount.value;

	d.addEventListener('click', (e) => {
		if (e.target.matches('#sumar')) {
			const auxAmount = Number($amount.value);
			if (!isNaN(auxAmount)) $amount.value = auxAmount + 1;
		}

		if (e.target.matches('#restar')) {
			const auxAmount = Number($amount.value);
			if (!isNaN(auxAmount) && auxAmount > 1) $amount.value = auxAmount - 1;
		}
	});

	$amount.addEventListener('keyup', () => {
		const exR = /^([1-9])(([0-9]){1,2})?$/,
			text = $amount.value;
		if (!exR.test(text)) {
			$amount.value = amount;
		}
	});
}
