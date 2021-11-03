export function Row(id) {
	const d = document,
		$div = d.createElement('div');

	$div.classList =
		'row align-content-center justify-content-center border border-red rounded h-100 m-0 overflow';
	$div.setAttribute('id', id);

	return $div;
}
