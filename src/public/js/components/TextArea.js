export function TextArea() {
	const $textarea = document.createElement('textarea');
	$textarea.classList = 'form-control my-3';
	$textarea.setAttribute('rows', '3');
	$textarea.setAttribute('required', 'true');
	return $textarea;
}
