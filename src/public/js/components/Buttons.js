export function Buttons(text, id) {
	const d = document,
		$button = d.createElement('button');

	$button.classList = 'btn btn-primary mx-md-2 blockMobile';
	$button.textContent = `${text}`;
	if (id) $button.setAttribute('id', id);

	$button.setAttribute('type', 'submit');

	return $button;
}
