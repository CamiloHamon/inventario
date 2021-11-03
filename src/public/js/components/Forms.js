export function Forms(type) {
	const d = document,
		$form = d.createElement('form');

	$form.setAttribute('id', `${type}`);
	$form.classList = 'd-contents';

	return $form;
}
